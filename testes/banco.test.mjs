// Rodar com: npm test
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import fs from "fs";
import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "url";
// Testa o banco (supabase/migrations) num Postgres em memória, com papéis e auth.uid() simulados como no Supabase.
const db = new PGlite({ extensions: { pgcrypto } });
const sql = fs.readFileSync(fileURLToPath(new URL("../supabase/migrations/0001_inicial.sql", import.meta.url)), "utf8");
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth; create schema extensions;
  grant usage on schema public, auth, extensions to anon, authenticated;
  create table auth.users (id uuid primary key, raw_user_meta_data jsonb);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.uid', true), '')::uuid $$;
  grant execute on function auth.uid() to anon, authenticated;
`);
await db.exec(sql);
await db.exec(`grant usage on schema extensions to anon, authenticated; grant execute on all functions in schema extensions to anon, authenticated;`);
const A = "11111111-1111-1111-1111-111111111111", B = "22222222-2222-2222-2222-222222222222";
await db.exec(`insert into auth.users values ('${A}', '{"nome":"Isaías"}'), ('${B}', '{}');`);
const as = async (role, uid, q, params) => {
  await db.exec(`reset role; select set_config('request.uid', '${uid || ""}', false); set role ${role};`);
  try { return await db.query(q, params); } finally { await db.exec("reset role"); }
};
const ok = (c, m) => test(m, () => assert.ok(c));
const fails = async (fn, m) => { let erro = null; try { await fn(); } catch (e) { erro = e; } ok(!!erro, m); };

ok((await db.query("select count(*)::int n from gestores")).rows[0].n === 2, "trigger cria os gestores");
const emp = (await as("authenticated", A, "insert into empresas (nome) values ('Empresa A') returning id")).rows[0].id;
const cv = (await as("authenticated", A, "insert into convites (empresa_id, tipo, rotulo) values ($1, 'funcionario', 'Equipe') returning token, gestor_id", [emp])).rows[0];
ok(cv.gestor_id === A && cv.token.length === 24, "convite criado com gestor e token");
await fails(() => as("authenticated", B, "insert into convites (empresa_id, tipo) values ($1, 'avulso')", [emp]), "B não cria convite na empresa de A");
await fails(() => as("authenticated", A, "insert into convites (tipo, menores) values ('avulso', true)"), "menores sem autorização é recusado");
ok((await as("authenticated", B, "select * from empresas")).rows.length === 0, "B não vê empresas de A");
const pub = (await as("anon", null, "select * from convite_publico($1)", [cv.token])).rows[0];
ok(pub.empresa === "Empresa A" && pub.aberto === true, "anônimo lê o convite público");
await fails(() => as("anon", null, "select * from convites"), "anônimo não lê a tabela de convites");
const resp = Array(60).fill(4), ent = Array(10).fill("Resposta com exemplo concreto.");
const seg = (await as("anon", null, "select enviar_respostas($1, $2, $3::smallint[], $4::text[], true, 1500) s", [cv.token, "Pessoa Teste", resp, ent])).rows[0].s;
ok(seg && seg.length === 32, "anônimo envia respostas e recebe o segredo");
await fails(() => as("anon", null, "select enviar_respostas($1, 'Pessoa X', $2::smallint[], $3::text[], true, 10)", [cv.token, Array(59).fill(3), ent]), "59 respostas são recusadas");
await fails(() => as("anon", null, "select enviar_respostas($1, 'Pessoa X', $2::smallint[], $3::text[], true, 10)", [cv.token, Array(60).fill(6), ent]), "resposta 6 é recusada");
await fails(() => as("anon", null, "select enviar_respostas('naoexiste', 'Pessoa X', $1::smallint[], $2::text[], true, 10)", [resp, ent]), "token inexistente é recusado");
await fails(() => as("anon", null, "select enviar_respostas($1, 'Pessoa X', $2::smallint[], $3::text[], false, 10)", [cv.token, resp, ent]), "sem consentimento é recusado");
await fails(() => as("anon", null, "insert into avaliacoes (gestor_id, nome, tipo, respostas, entrevista, consentimento) values ($1, 'x', 'avulso', '{}', '{}', true)", [A]), "anônimo não insere direto");
const dv0 = (await as("anon", null, "select * from devolutiva_publica($1)", [seg])).rows[0];
ok(dv0.nome === "Pessoa Teste" && dv0.devolutiva === null, "devolutiva ainda não liberada não aparece");
const avA = (await as("authenticated", A, "select id, gestor_id, tipo, empresa_id from avaliacoes")).rows;
ok(avA.length === 1 && avA[0].tipo === "funcionario" && avA[0].empresa_id === emp, "A vê a avaliação, com tipo e empresa do convite");
ok((await as("authenticated", B, "select * from avaliacoes")).rows.length === 0, "B não vê a avaliação de A");
ok((await as("authenticated", B, "update avaliacoes set notas = '{3,3,3,3,3,3,3,3,3,3}' returning id")).rows.length === 0, "B não altera a avaliação de A");
await fails(() => as("authenticated", A, "update avaliacoes set respostas = $1::smallint[]", [Array(60).fill(1)]), "A não altera as respostas da pessoa");
await fails(() => as("authenticated", A, "update avaliacoes set notas = '{9,3,3,3,3,3,3,3,3,3}'"), "nota 9 é recusada");
await as("authenticated", A, "update avaliacoes set notas = '{3,4,5,3,3,4,2,5,4,3}', devolutiva = '{\"intro\":\"oi\"}', devolutiva_liberada_em = now()");
const dv1 = (await as("anon", null, "select * from devolutiva_publica($1)", [seg])).rows[0];
ok(dv1.devolutiva && dv1.devolutiva.intro === "oi", "devolutiva liberada aparece pelo link");
await as("authenticated", A, "update convites set ativo = false");
ok((await as("anon", null, "select * from convite_publico($1)", [cv.token])).rows[0].aberto === false, "convite desativado aparece fechado");
await fails(() => as("anon", null, "select enviar_respostas($1, 'Pessoa Y', $2::smallint[], $3::text[], true, 10)", [cv.token, resp, ent]), "convite desativado não recebe respostas");
await as("authenticated", A, "update convites set ativo = true, limite = 1");
await fails(() => as("anon", null, "select enviar_respostas($1, 'Pessoa Y', $2::smallint[], $3::text[], true, 10)", [cv.token, resp, ent]), "convite no limite não recebe respostas");
ok((await as("authenticated", A, "delete from avaliacoes returning id")).rows.length === 1, "A exclui a própria avaliação");
