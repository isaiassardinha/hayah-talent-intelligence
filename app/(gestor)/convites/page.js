import { headers } from "next/headers";
import { supabaseServidor } from "@/lib/supabase/server";
import { criarEmpresa, criarConvite, alternarConvite } from "./acoes";
import CopiarBotao from "@/components/CopiarBotao";
import { fData, TIPO } from "@/lib/formato";

export const dynamic = "force-dynamic";

async function origem() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || (host && host.startsWith("localhost") ? "http" : "https");
  return proto + "://" + host;
}

export default async function Convites({ searchParams }) {
  const { erro, ok } = await searchParams;
  const supabase = await supabaseServidor();
  const [{ data: empresas }, { data: convites }, { data: contagem }] = await Promise.all([
    supabase.from("empresas").select("id, nome").order("nome"),
    supabase.from("convites").select("id, token, tipo, rotulo, menores, autorizacao_em, ativo, limite, criado_em, empresas(nome)").order("criado_em", { ascending: false }),
    supabase.from("avaliacoes").select("convite_id")
  ]);
  const respostas = {};
  (contagem || []).forEach(a => { respostas[a.convite_id] = (respostas[a.convite_id] || 0) + 1; });
  const base = await origem();

  return (
    <>
      <div className="stack" style={{ gap: 4 }}>
        <h2>Testes e convites</h2>
        <p className="muted small">Cada convite gera um link. A pessoa abre o link no celular ou no computador, faz o teste e o resultado aparece no seu painel. Para aplicar na sua tela, use "Abrir o teste aqui".</p>
      </div>
      {erro && <div className="alert bad" role="alert">{erro}</div>}
      {ok && <div className="alert good" role="status">{ok}</div>}

      <div className="grid2" style={{ gridTemplateColumns: "1fr 2fr" }}>
        <section className="card stack">
          <h3>Empresas</h3>
          <form action={criarEmpresa} className="stack">
            <label className="field">Nome da empresa<input type="text" name="nome" required maxLength={120} placeholder="Ex.: Transportadora Rio Sul" /></label>
            <div><button className="btn primary">Cadastrar empresa</button></div>
          </form>
          {empresas && empresas.length
            ? <ul style={{ margin: 0, paddingLeft: 18 }}>{empresas.map(e => <li key={e.id}>{e.nome}</li>)}</ul>
            : <p className="small muted">Nenhuma empresa cadastrada.</p>}
        </section>

        <section className="card stack">
          <h3>Novo convite</h3>
          <form action={criarConvite} className="stack">
            <div className="grid2">
              <label className="field">Empresa
                <select name="empresa_id" defaultValue="">
                  <option value="">Sem empresa</option>
                  {(empresas || []).map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </label>
              <label className="field">Tipo
                <select name="tipo" defaultValue="avulso">
                  <option value="avulso">Pessoa avulsa (orientação de carreira)</option>
                  <option value="funcionario">Funcionário da empresa</option>
                </select>
              </label>
            </div>
            <label className="field">Identificação do convite<input type="text" name="rotulo" maxLength={160} placeholder="Ex.: Equipe comercial, março" /></label>
            <label className="row small" style={{ fontWeight: 600 }}><input type="checkbox" name="menores" /> O grupo inclui menores de idade</label>
            <div className="alert small">Se o grupo tiver menores de idade, os dados são sensíveis. Confirme que você tem a autorização dos pais ou responsáveis.</div>
            <label className="row small"><input type="checkbox" name="autorizo" /> Confirmo que tenho a autorização dos pais ou responsáveis (só para grupos com menores)</label>
            <div><button className="btn primary">Gerar link</button></div>
          </form>
        </section>
      </div>

      <section className="card stack">
        <h3>Convites</h3>
        {convites && convites.length ? (
          <div className="tablewrap">
            <table className="tab">
              <thead><tr><th>Identificação</th><th>Empresa</th><th>Tipo</th><th className="n">Respostas</th><th>Situação</th><th>Link</th></tr></thead>
              <tbody>
                {convites.map(c => {
                  const link = base + "/t/" + c.token;
                  return (
                    <tr key={c.id}>
                      <td>{c.rotulo || "–"}{c.menores && <> <span className="chip warn">Menores · autorização em {fData(c.autorizacao_em)}</span></>}<br /><span className="small muted">criado em {fData(c.criado_em)}</span></td>
                      <td>{c.empresas ? c.empresas.nome : "–"}</td>
                      <td>{TIPO[c.tipo]}</td>
                      <td className="n num">{respostas[c.id] || 0}</td>
                      <td>
                        <form action={alternarConvite.bind(null, c.id, c.ativo)} className="row" style={{ gap: 6 }}>
                          {c.ativo ? <span className="chip good">Ativo</span> : <span className="chip plain">Encerrado</span>}
                          <button className="btn small">{c.ativo ? "Encerrar" : "Reabrir"}</button>
                        </form>
                      </td>
                      <td>
                        <div className="row" style={{ gap: 6 }}>
                          <CopiarBotao texto={link} rotulo="Copiar link" />
                          <a className="btn small" href={"/t/" + c.token} target="_blank" rel="noopener">Abrir o teste aqui</a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <p className="small muted">Nenhum convite ainda. Crie o primeiro acima.</p>}
      </section>
    </>
  );
}
