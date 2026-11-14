import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { supabaseServidor } from "@/lib/supabase/server";
import { analisar, ALERTAS_GRAVES } from "@/lib/analise";
import { claudeDisponivel } from "@/lib/claude";
import { f1, fData, corBarra, TIPO } from "@/lib/formato";
import M from "@/lib/motor";
import Devolutiva from "@/components/Devolutiva";
import CopiarBotao from "@/components/CopiarBotao";
import BotaoConfirmar from "@/components/BotaoConfirmar";
import { salvarNotas, avaliarComClaude, liberarDevolutiva, excluirAvaliacao } from "./acoes";

export const dynamic = "force-dynamic";

function Area({ d, tipo, pos }) {
  const pct = tipo === "good" ? d.best : d.avg;
  return (
    <div className={"area " + tipo}>
      <div className="row between" style={{ alignItems: "flex-start" }}>
        <h3>{d.dept}</h3><span className="pct num">{pct}%</span>
      </div>
      <span className="small muted">{tipo === "good" ? pos + "º · maior nota entre as funções" : "média das funções"}</span>
      {d.funcs.map(f => (
        <div className="frow" key={f.name}>
          <span>{f.name}</span><span className="num">{f.pct == null ? "–" : f.pct + "%"}</span>
          <div className={"bar " + corBarra(f.pct)}><i style={{ width: (f.pct || 0) + "%" }} /></div>
        </div>
      ))}
      {tipo === "bad" && d.reasons.length > 0 && (
        <p className="small"><b>Motivo:</b> {d.reasons.map(r => r.label.toLowerCase() + " " + f1(r.value) + " (" + r.risk + ")").join("; ")}</p>
      )}
    </div>
  );
}

export default async function Pessoa({ params, searchParams }) {
  const { id } = await params;
  const { ok, erro } = await searchParams;
  const supabase = await supabaseServidor();
  const { data: av } = await supabase.from("avaliacoes").select("*, empresas(nome), convites(rotulo, menores)").eq("id", id).maybeSingle();
  if (!av) notFound();
  const a = analisar(av);
  const g = M.buildGuide(a);
  const fb = M.buildFeedback(a, av.tipo);
  const notas = Array.isArray(av.notas) ? av.notas : Array(10).fill(null);
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const base = process.env.NEXT_PUBLIC_SITE_URL || ((h.get("x-forwarded-proto") || "https") + "://" + host);
  const linkDevolutiva = base.replace(/\/$/, "") + "/d/" + av.segredo;
  const alertas = [...a.alerts];
  if (av.convites && av.convites.menores) alertas.unshift({ code: "menores", text: "Pessoa de um grupo com menores de idade. Trate estes dados como sensíveis." });
  if (!a.interviewDone) alertas.push({ code: "pendente", text: "A entrevista ainda não foi avaliada. Por enquanto as notas usam só o teste de personalidade." });

  return (
    <>
      <p className="small"><Link href="/painel">← Painel</Link></p>
      {erro && <div className="alert bad" role="alert">{erro}</div>}
      {ok && <div className="alert good" role="status">{ok}</div>}
      <section className="card row between">
        <div>
          <h2>{av.nome}</h2>
          <p className="muted small">{av.empresas ? av.empresas.nome : "Sem empresa"} · {TIPO[av.tipo]} · {av.convites && av.convites.rotulo ? "convite " + av.convites.rotulo + " · " : ""}{fData(av.criado_em)}</p>
        </div>
        <span className="chip plain">Relatório técnico do gestor · não compartilhar com a pessoa</span>
      </section>
      {alertas.length > 0 && <div className="stack" style={{ gap: 8 }}>{alertas.map((x, i) => <div key={i} className={"alert" + (ALERTAS_GRAVES.includes(x.code) ? " bad" : "")}>{x.text}</div>)}</div>}

      <section className="stack"><h3>Áreas recomendadas</h3><div className="grid3">{a.top.map((d, i) => <Area key={d.dept} d={d} tipo="good" pos={i + 1} />)}</div></section>
      <section className="stack"><h3>Áreas não indicadas</h3><div className="grid3">{a.bottom.map(d => <Area key={d.dept} d={d} tipo="bad" />)}</div></section>

      <section className="card stack">
        <h3>Traços de personalidade (HEXACO, de 1 a 5)</h3>
        <div className="grid3">
          {M.TRAITS.map(t => (
            <div key={t} className="stack" style={{ gap: 6 }}>
              <div className="row between"><span>{M.TRAIT_NAMES[t]}</span><b className="num">{f1(a.traits[t])}</b></div>
              <div className="escala"><b style={{ left: ((a.traits[t] - 1) / 4 * 100) + "%" }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h3>Competências</h3>
        <div className="tablewrap">
          <table className="tab">
            <thead><tr><th>Competência</th><th className="n">Teste</th><th className="n">Entrevista</th><th className="n">Nota</th><th style={{ width: "30%" }}></th></tr></thead>
            <tbody>
              {a.compList.map(c => (
                <tr key={c.key}>
                  <td>{c.label}</td><td className="n num">{f1(c.traits)}</td><td className="n num">{f1(c.interview)}</td><td className="n num"><b>{f1(c.value)}</b></td>
                  <td><div className={"bar " + corBarra((c.value - 1) / 4 * 100)}><i style={{ width: ((c.value - 1) / 4 * 100) + "%" }} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted">Nota = 60% teste + 40% entrevista, quando a entrevista foi avaliada.</p>
      </section>

      <section className="card stack">
        <div className="row between"><h3>Guia de gestão</h3><span className="chip plain">Para o gestor da área</span></div>
        <div className="guia">
          {g.sections.map(s => <div key={s.key}><h4>{s.title}</h4><ul>{s.items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>)}
          <div><h4>Aproveite os pontos fortes</h4><p className="small">Dê tarefas que pedem {g.fortes.map(x => x.toLowerCase()).join(", ")}.</p></div>
          <div><h4>Plano de desenvolvimento</h4><ul>{g.dev.map(d => <li key={d.label}><b>{d.label}</b> ({f1(d.value)}): {d.acao}</li>)}</ul></div>
        </div>
      </section>

      <section className="card stack">
        <div className="row between">
          <h3>Entrevista</h3>
          <span className="small muted">{av.avaliado_em ? "Avaliada " + (av.avaliado_por === "ia" ? "pelo Claude" : "pelo gestor") + " em " + fData(av.avaliado_em) : "Ainda não avaliada"}</span>
        </div>
        <p className="small muted">Régua: 1 sem exemplo real · 2 exemplo vago · 3 exemplo concreto · 4 com ação própria e resultado · 5 com resultado claro e aprendizado.</p>
        <form action={salvarNotas.bind(null, av.id)} className="stack">
          {M.INTERVIEW.map((q, i) => (
            <div className="qa" key={i}>
              <div className="stack" style={{ gap: 4 }}>
                <b>{i + 1}. {q.q}</b>
                <p style={{ whiteSpace: "pre-wrap" }}>{(av.entrevista || [])[i] || <span className="muted">(em branco)</span>}</p>
                {av.motivos && av.motivos[i] && <p className="small muted">{av.motivos[i]}</p>}
              </div>
              <label className="field">Nota
                <select name={"n" + i} defaultValue={notas[i] || ""}>
                  <option value="">–</option>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>
          ))}
          <div className="row">
            <button className="btn primary">Salvar notas</button>
            {claudeDisponivel() && <button className="btn" formAction={avaliarComClaude.bind(null, av.id)}>Avaliar com o Claude</button>}
          </div>
        </form>
      </section>

      <section className="card stack">
        <div className="row between">
          <h3>Devolutiva da pessoa</h3>
          {av.devolutiva_liberada_em ? <span className="chip good">Liberada em {fData(av.devolutiva_liberada_em)}</span> : <span className="chip plain">Ainda não liberada</span>}
        </div>
        <p className="small muted">É isto que a pessoa vê. Não mostra as áreas não indicadas nem as notas.</p>
        <Devolutiva fb={fb} />
        <div className="row">
          <form action={liberarDevolutiva.bind(null, av.id)}><button className="btn primary">{av.devolutiva_liberada_em ? "Atualizar a devolutiva liberada" : "Liberar a devolutiva"}</button></form>
          <CopiarBotao texto={linkDevolutiva} rotulo="Copiar o link da devolutiva" className="btn" />
        </div>
        {!a.interviewDone && <p className="small muted">Dica: avalie a entrevista antes de liberar, para a devolutiva usar as notas completas.</p>}
      </section>

      <form action={excluirAvaliacao.bind(null, av.id)}>
        <BotaoConfirmar rotulo="Excluir avaliação" confirmar="Excluir de vez" aviso="Excluir esta avaliação de vez? Não dá para desfazer." />
      </form>
    </>
  );
}
