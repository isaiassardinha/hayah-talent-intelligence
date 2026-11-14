import Link from "next/link";
import { supabaseServidor } from "@/lib/supabase/server";
import { analisar, ALERTAS_GRAVES } from "@/lib/analise";
import { fData, TIPO } from "@/lib/formato";

export const dynamic = "force-dynamic";

export default async function Painel() {
  const supabase = await supabaseServidor();
  const [{ data: avs }, { count: nConvites }, { count: nEmpresas }] = await Promise.all([
    supabase.from("avaliacoes").select("id, nome, tipo, respostas, notas, duracao_seg, devolutiva_liberada_em, criado_em, empresas(nome)").order("criado_em", { ascending: false }),
    supabase.from("convites").select("id", { count: "exact", head: true }).eq("ativo", true),
    supabase.from("empresas").select("id", { count: "exact", head: true })
  ]);
  const lista = (avs || []).map(av => ({ av, a: analisar(av) }));
  const pendentes = lista.filter(x => !x.a.interviewDone).length;
  const aLiberar = lista.filter(x => x.a.interviewDone && !x.av.devolutiva_liberada_em).length;

  return (
    <>
      <div className="stack" style={{ gap: 4 }}>
        <h2>Painel</h2>
        <p className="muted small">Todas as pessoas que fizeram o teste pelos seus convites.</p>
      </div>
      <div className="kpis">
        <div className="kpi"><span className="small muted">Pessoas avaliadas</span><b className="num">{lista.length}</b></div>
        <div className="kpi"><span className="small muted">Entrevistas para avaliar</span><b className="num">{pendentes}</b></div>
        <div className="kpi"><span className="small muted">Devolutivas para liberar</span><b className="num">{aLiberar}</b></div>
        <div className="kpi"><span className="small muted">Convites ativos</span><b className="num">{nConvites || 0}</b></div>
        <div className="kpi"><span className="small muted">Empresas</span><b className="num">{nEmpresas || 0}</b></div>
      </div>
      {!lista.length ? (
        <div className="card stack" style={{ alignItems: "flex-start" }}>
          <h3>Ninguém fez o teste ainda</h3>
          <p className="muted">Crie um convite, copie o link e envie para a pessoa. Ou abra o teste na sua tela para aplicar presencialmente.</p>
          <Link className="btn primary" href="/convites">Criar um convite</Link>
        </div>
      ) : (
        <div className="stack" style={{ gap: 8 }}>
          {lista.map(({ av, a }) => (
            <Link key={av.id} href={"/pessoas/" + av.id} className="pessoa">
              <div className="row between">
                <div>
                  <b>{av.nome}</b>
                  <div className="small muted">{av.empresas ? av.empresas.nome : "Sem empresa"} · {TIPO[av.tipo]} · {fData(av.criado_em)}</div>
                </div>
                <div className="row" style={{ gap: 6 }}>
                  {a.top[0] && <span className="chip plain">{a.top[0].dept} · {a.top[0].best}%</span>}
                  {a.interviewDone ? <span className="chip good">Entrevista avaliada</span> : <span className="chip warn">Entrevista pendente</span>}
                  {av.devolutiva_liberada_em && <span className="chip">Devolutiva liberada</span>}
                  {a.alerts.some(x => ALERTAS_GRAVES.includes(x.code)) && <span className="chip bad">Alerta</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
