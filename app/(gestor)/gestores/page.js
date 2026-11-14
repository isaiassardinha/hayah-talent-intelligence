import { redirect } from "next/navigation";
import { usuarioAtual } from "@/lib/supabase/server";
import { origem } from "@/lib/origem";
import { fData } from "@/lib/formato";
import CopiarBotao from "@/components/CopiarBotao";
import { convidarGestor, cancelarConviteGestor, renovarConviteGestor } from "./acoes";

export const dynamic = "force-dynamic";

function situacao(c) {
  if (c.usado_em) return ["good", "Cadastro feito em " + fData(c.usado_em)];
  if (c.cancelado_em) return ["plain", "Cancelado"];
  if (new Date(c.expira_em) <= new Date()) return ["warn", "Vencido"];
  return ["", "Aguardando · vale até " + fData(c.expira_em)];
}

export default async function Gestores({ searchParams }) {
  const { erro, ok } = await searchParams;
  const { supabase } = await usuarioAtual();
  const { data: admin } = await supabase.rpc("eh_admin");
  if (!admin) redirect("/painel");
  const [{ data: gestores }, { data: convites }] = await Promise.all([
    supabase.rpc("listar_gestores"),
    supabase.from("convites_gestor").select("id, email, nome, token, criado_em, expira_em, usado_em, cancelado_em").order("criado_em", { ascending: false })
  ]);
  const base = await origem();

  return (
    <>
      <div className="stack" style={{ gap: 4 }}>
        <h2>Gestores</h2>
        <p className="muted small">Só você, como administrador, vê esta página. Gere o convite e envie o link você mesmo (WhatsApp, por exemplo): o sistema não manda e-mail. O gestor abre o link, cria a senha e já entra. O e-mail serve só como login. Cada gestor vê só os próprios dados.</p>
      </div>
      {erro && <div className="alert bad" role="alert">{erro}</div>}
      {ok && <div className="alert good" role="status">{ok}</div>}

      <section className="card stack">
        <h3>Convidar gestor</h3>
        <form action={convidarGestor} className="stack">
          <div className="grid2">
            <label className="field">Nome<input type="text" name="nome" maxLength={120} placeholder="Ex.: Carla Souza" autoComplete="off" /></label>
            <label className="field">E-mail<input type="email" name="email" required maxLength={254} placeholder="carla@empresa.com.br" autoComplete="off" /></label>
          </div>
          <p className="small muted">O link vale por 7 dias e só funciona uma vez, com este e-mail. Nenhum e-mail é enviado: copie o link na lista abaixo.</p>
          <div><button className="btn primary">Gerar convite</button></div>
        </form>
      </section>

      <section className="card stack">
        <h3>Convites enviados</h3>
        {convites && convites.length ? (
          <div className="tablewrap">
            <table className="tab">
              <thead><tr><th>Gestor</th><th>Situação</th><th>Link</th></tr></thead>
              <tbody>
                {convites.map(c => {
                  const [cor, texto] = situacao(c);
                  const aberto = cor === "";
                  return (
                    <tr key={c.id}>
                      <td>{c.nome || "–"}<br /><span className="small muted">{c.email} · criado em {fData(c.criado_em)}</span></td>
                      <td><span className={"chip " + cor}>{texto}</span></td>
                      <td>
                        <div className="row" style={{ gap: 6 }}>
                          {aberto && <CopiarBotao texto={base + "/cadastro/" + c.token} rotulo="Copiar link" />}
                          {aberto && <form action={cancelarConviteGestor.bind(null, c.id)}><button className="btn small">Cancelar</button></form>}
                          {!aberto && !c.usado_em && <form action={renovarConviteGestor.bind(null, c.id)}><button className="btn small">Reativar por 7 dias</button></form>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <p className="small muted">Nenhum convite ainda.</p>}
      </section>

      <section className="card stack">
        <h3>Gestores cadastrados</h3>
        <p className="small muted">Você vê quantos convites e testes cada gestor tem, mas não as pessoas avaliadas nem as respostas.</p>
        <div className="tablewrap">
          <table className="tab">
            <thead><tr><th>Gestor</th><th>Desde</th><th className="n">Convites</th><th className="n">Testes feitos</th></tr></thead>
            <tbody>
              {(gestores || []).map(g => (
                <tr key={g.id}>
                  <td>{g.nome || "–"} {g.papel === "admin" && <span className="chip">Administrador</span>}<br /><span className="small muted">{g.email}</span></td>
                  <td>{fData(g.criado_em)}</td>
                  <td className="n num">{g.convites}</td>
                  <td className="n num">{g.avaliacoes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
