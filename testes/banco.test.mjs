// Rodar com: npm test
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import fs from "fs";
import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "url";
// Testa o banco (supabase/migrations) num Postgres em memória, com papéis e auth.uid() simulados como no Supabase.
const db = new PGlite({ extensions: { pgcrypto } });
const pasta = fileURLToPath(new URL("../supabase/migrations/", import.meta.url));
const migracoes = fs.readdirSync(pasta).filter(f => f.endsWith(".sql")).sort();
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth; create schema extensions;
  grant usage on schema public, auth, extensions to anon, authenticated;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.uid', true), '')::uuid $$;
  grant execute on function auth.uid() to anon, authenticated;
`);
const A = "11111111-1111-1111-1111-111111111111", B = "22222222-2222-2222-2222-222222222222";
// Aplica as migrações em ordem. Os dois primeiros gestores entram antes da 0003 (como no banco real).
for (const m of migracoes) {
  if (m.startsWith("0003")) await db.exec(`insert into auth.users (id, email, raw_user_meta_data) values ('${A}', 'a@teste.com', '{"nome":"Isaías"}'), ('${B}', 'b@teste.com', '{}');`);
  await db.exec(fs.readFileSync(pasta + m, "utf8"));
}
await db.exec(`grant usage on schema extensions to anon, authenticated; grant execute on all functions in schema extensions to anon, authenticated;`);
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

// ------------------------------------------------------------ 0003: administrador e convite de gestor
const papel = async id => (await db.query("select papel from gestores where id = $1", [id])).rows[0].papel;
ok((await papel(A)) === "admin" && (await papel(B)) === "gestor", "o primeiro gestor vira administrador");
ok((await as("authenticated", A, "select eh_admin() v")).rows[0].v === true && (await as("authenticated", B, "select eh_admin() v")).rows[0].v === false, "eh_admin só é verdadeiro para o administrador");
await fails(() => as("authenticated", B, "insert into convites_gestor (email) values ('c@teste.com')"), "gestor comum não cria convite de gestor");
ok((await as("authenticated", B, "select * from convites_gestor")).rows.length === 0, "gestor comum não vê convites de gestor");
await fails(() => as("anon", null, "select * from convites_gestor"), "anônimo não lê a tabela de convites de gestor");
await fails(() => as("authenticated", A, "insert into convites_gestor (email) values ('sem-arroba')"), "e-mail inválido é recusado");
const cg = (await as("authenticated", A, "insert into convites_gestor (email, nome) values ('c@teste.com', 'Carla') returning token, criado_por")).rows[0];
ok(cg.token.length === 32 && cg.criado_por === A, "administrador cria convite de gestor");
await fails(() => as("authenticated", A, "insert into convites_gestor (email, criado_por) values ('d@teste.com', $1)", [B]), "não dá para forjar quem criou o convite");
const pubG = (await as("anon", null, "select * from convite_gestor_publico($1)", [cg.token])).rows[0];
ok(pubG.email === "c@teste.com" && pubG.nome === "Carla" && pubG.valido === true, "anônimo lê o convite de gestor pelo token");
ok((await as("anon", null, "select * from convite_gestor_publico('errado')")).rows.length === 0, "token errado não mostra nada");
const C = "33333333-3333-3333-3333-333333333333", D = "44444444-4444-4444-4444-444444444444";
await fails(() => db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, 'x@teste.com', '{}')", [D]), "cadastro sem convite é recusado");
await fails(() => db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, 'outro@teste.com', $2)", [D, { convite: cg.token }]), "convite usado com outro e-mail é recusado");
await db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, 'C@Teste.com', $2)", [C, { convite: cg.token }]);
ok((await papel(C)) === "gestor" && (await db.query("select nome from gestores where id = $1", [C])).rows[0].nome === "Carla", "cadastro com convite cria o gestor com o nome do convite");
ok((await as("anon", null, "select valido from convite_gestor_publico($1)", [cg.token])).rows[0].valido === false, "convite usado deixa de valer");
await fails(() => db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, 'c@teste.com', $2)", [D, { convite: cg.token }]), "convite não serve duas vezes");
const cg2 = (await as("authenticated", A, "insert into convites_gestor (email) values ('e@teste.com') returning id, token")).rows[0];
await as("authenticated", A, "update convites_gestor set cancelado_em = now() where id = $1", [cg2.id]);
await fails(() => db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, 'e@teste.com', $2)", [D, { convite: cg2.token }]), "convite cancelado é recusado");
await as("authenticated", A, "update convites_gestor set cancelado_em = null, expira_em = now() - interval '1 minute' where id = $1", [cg2.id]);
await fails(() => db.query("insert into auth.users (id, email, raw_user_meta_data) values ($1, 'e@teste.com', $2)", [D, { convite: cg2.token }]), "convite vencido é recusado");
const lista = (await as("authenticated", A, "select * from listar_gestores()")).rows;
ok(lista.length === 3 && lista.some(g => g.email === "C@Teste.com" && g.papel === "gestor"), "administrador vê a lista de gestores com e-mail");
ok((await as("authenticated", B, "select * from listar_gestores()")).rows.length === 0, "gestor comum não vê a lista de gestores");
await fails(() => as("anon", null, "select * from listar_gestores()"), "anônimo não chama a lista de gestores");
await fails(() => as("authenticated", B, "update gestores set papel = 'admin' where id = $1 returning id", [B]), "gestor não se promove a administrador");
ok((await as("authenticated", C, "select * from empresas")).rows.length === 0, "gestor novo começa sem dados de outros");
const ent2 = (await as("authenticated", C, "insert into empresas (nome, tipo) values ('Curso de Liderança', 'treinamento') returning tipo")).rows[0];
ok(ent2.tipo === "treinamento", "cadastra treinamento como tipo de organização");
await fails(() => as("authenticated", C, "insert into empresas (nome, tipo) values ('X Y', 'escola')"), "tipo de organização desconhecido é recusado");

