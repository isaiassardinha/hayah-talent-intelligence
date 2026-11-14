import { supabaseServidor } from "@/lib/supabase/server";
import { criarEmpresa, criarConvite, alternarConvite, renovarConvite } from "./acoes";
import CopiarBotao from "@/components/CopiarBotao";
import { fData, TIPO, ORG } from "@/lib/formato";
import { origem } from "@/lib/origem";

export const dynamic = "force-dynamic";


export default async function Convites({ searchParams }) {
  const { erro, ok } = await searchParams;
  const supabase = await supabaseServidor();
  const [{ data: empresas }, { data: convites }, { data: contagem }] = await Promise.all([
    supabase.from("empresas").select("id, nome, tipo").order("nome"),
    supabase.from("convites").select("id, token, tipo, rotulo, menores, autorizacao_em, ativo, limite, expira_em, criado_em, empresas(nome, tipo)").order("criado_em", { ascending: false }),
    supabase.from("avaliacoes").select("convite_id")
  ]);
  const respostas = {};
  (contagem || []).forEach(a => { respostas[a.convite_id] = (respostas[a.convite_id] || 0) + 1; });
  const base = await origem();

  return (
    <>
      <div className="stack" style={{ gap: 4 }}>
        <h2>Testes e convites</h2>
        <p className="muted small">Cada convite gera um link e um QR code. O sistema não envia e-mail: você manda o link por WhatsApp, mostra o QR code no projetor ou imprime. A pessoa faz o teste no celular ou no computador, sem criar conta, e o resultado aparece no seu painel.</p>
      </div>
      {erro && <div className="alert bad" role="alert">{erro}</div>}
      {ok && <div className="alert good" role="status">{ok}</div>}

      <div className="grid2" style={{ gridTemplateColumns: "1fr 2fr" }}>
        <section className="card stack">
          <h3>Onde você aplica</h3>
          <p className="small muted">Empresas, entidades ou treinamentos em que você vai aplicar os testes.</p>
          <form action={criarEmpresa} className="stack">
            <label className="field">Tipo
              <select name="tipo" defaultValue="empresa">
                <option value="empresa">Empresa</option>
                <option value="entidade">Entidade (associação, ONG, igreja, escola…)</option>
                <option value="treinamento">Treinamento (curso, turma, programa)</option>
              </select>
            </label>
            <label className="field">Nome<input type="text" name="nome" required maxLength={120} placeholder="Ex.: Transportadora Rio Sul" /></label>
            <div><button className="btn primary">Cadastrar</button></div>
          </form>
          {empresas && empresas.length
            ? <ul className="stack" style={{ margin: 0, padding: 0, listStyle: "none", gap: 6 }}>{empresas.map(e => <li key={e.id} className="row" style={{ gap: 6 }}><span className="chip plain">{ORG[e.tipo]}</span> {e.nome}</li>)}</ul>
            : <p className="small muted">Nada cadastrado ainda.</p>}
        </section>

        <section className="card stack">
          <h3>Novo convite</h3>
          <form action={criarConvite} className="stack">
            <div className="grid2">
              <label className="field">Empresa, entidade ou treinamento
                <select name="empresa_id" defaultValue="">
                  <option value="">Nenhum (pessoa avulsa)</option>
                  {(empresas || []).map(e => <option key={e.id} value={e.id}>{e.nome} ({ORG[e.tipo].toLowerCase()})</option>)}
                </select>
              </label>
              <label className="field">Tipo
                <select name="tipo" defaultValue="avulso">
                  <option value="avulso">Pessoa avulsa (orientação de carreira)</option>
                  <option value="funcionario">Participante (funcionário, membro ou aluno)</option>
                </select>
              </label>
            </div>
            <label className="field">Identificação do convite<input type="text" name="rotulo" maxLength={160} placeholder="Ex.: Equipe comercial, março" /></label>
            <div className="grid2">
              <label className="field">Quantas pessoas podem responder
                <input type="number" name="limite" min={1} max={5000} defaultValue={1} />
                <span className="small muted" style={{ fontWeight: 400 }}>1 = convite individual. Para uma turma ou palestra, use o número de participantes.</span>
              </label>
              <label className="field">O link vale por
                <select name="dias" defaultValue="7">
                  <option value="1">1 dia (bom para palestra ou evento)</option>
                  <option value="7">7 dias</option>
                  <option value="30">30 dias</option>
                  <option value="90">90 dias</option>
                  <option value="0">Sem prazo</option>
                </select>
              </label>
            </div>
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
              <thead><tr><th>Identificação</th><th>Onde</th><th>Tipo</th><th className="n">Respostas</th><th>Situação</th><th>Link</th></tr></thead>
              <tbody>
                {convites.map(c => {
                  const link = base + "/t/" + c.token;
                  const vencido = c.expira_em && new Date(c.expira_em) <= new Date();
                  const usados = respostas[c.id] || 0;
                  return (
                    <tr key={c.id}>
                      <td>{c.rotulo || "–"}{c.menores && <> <span className="chip warn">Menores · autorização em {fData(c.autorizacao_em)}</span></>}<br /><span className="small muted">criado em {fData(c.criado_em)}</span></td>
                      <td>{c.empresas ? <>{c.empresas.nome}<br /><span className="small muted">{ORG[c.empresas.tipo]}</span></> : "–"}</td>
                      <td>{TIPO[c.tipo]}</td>
                      <td className="n num">{usados} de {c.limite}</td>
                      <td>
                        <form action={alternarConvite.bind(null, c.id, c.ativo)} className="row" style={{ gap: 6 }}>
                          {!c.ativo ? <span className="chip plain">Encerrado</span> : vencido ? <span className="chip warn">Vencido</span> : usados >= c.limite ? <span className="chip warn">Esgotado</span> : <span className="chip good">Ativo</span>}
                          <button className="btn small">{c.ativo ? "Encerrar" : "Reabrir"}</button>
                        </form>
                        <span className="small muted">{c.expira_em ? (vencido ? "venceu em " : "vale até ") + fData(c.expira_em) : "sem prazo"}</span>
                        {vencido && <form action={renovarConvite.bind(null, c.id)}><button className="btn small">Mais 7 dias</button></form>}
                      </td>
                      <td>
                        <div className="row" style={{ gap: 6 }}>
                          <CopiarBotao texto={link} rotulo="Copiar link" />
                          <a className="btn small" href={"/convites/" + c.id + "/qr"} target="_blank" rel="noopener">QR code</a>
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
