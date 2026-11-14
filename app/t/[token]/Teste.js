"use client";
import { useEffect, useState } from "react";
import M from "@/lib/motor";
import { LIKERT } from "@/lib/formato";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import CopiarBotao from "@/components/CopiarBotao";

const ERROS = {
  convite_invalido: "Este convite não está mais ativo. Fale com quem enviou o link.",
  convite_esgotado: "Este convite atingiu o limite de respostas. Fale com quem enviou o link.",
  respostas_invalidas: "Algumas afirmações ficaram sem resposta. Volte e confira.",
  sem_consentimento: "É preciso concordar com o uso das respostas para enviar."
};

// Etapas: 0 = início; 1 a 6 = afirmações (10 por parte); 7 = perguntas abertas; 8 = enviado.
export default function Teste({ token }) {
  const chave = "hayah-teste-" + token;
  const [T, setT] = useState({ etapa: 0, nome: "", consent: false, ans: Array(60).fill(null), ent: Array(10).fill(""), t1: null, t7: null, avisoBranco: false });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [segredo, setSegredo] = useState(null);

  // Guarda o progresso neste aparelho, para não perder nada se a página fechar.
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(chave) || "null"); if (s && s.ans && s.ans.length === 60) setT(s); } catch {}
  }, [chave]);
  useEffect(() => {
    try { if (T.etapa < 8) localStorage.setItem(chave, JSON.stringify(T)); } catch {}
  }, [T, chave]);

  const muda = patch => setT(t => ({ ...t, ...patch }));
  const idxs = T.etapa >= 1 && T.etapa <= 6 ? M.ITEM_ORDER.slice((T.etapa - 1) * 10, T.etapa * 10) : [];
  const topo = () => window.scrollTo(0, 0);

  async function continuar() {
    setErro("");
    if (T.etapa === 0) {
      if (T.nome.trim().length < 3) return setErro("Escreva o seu nome completo para continuar.");
      if (!T.consent) return setErro("Para continuar, marque que concorda com o uso das respostas.");
      muda({ etapa: 1, t1: T.t1 || Date.now() }); return topo();
    }
    if (T.etapa >= 1 && T.etapa <= 6) {
      const falta = idxs.map((ix, j) => (T.ans[ix] == null ? (T.etapa - 1) * 10 + j + 1 : null)).filter(Boolean);
      if (falta.length) return setErro("Falta responder: " + falta.join(", ") + ".");
      muda({ etapa: T.etapa + 1, t7: T.etapa === 6 ? Date.now() : T.t7 }); return topo();
    }
    if (T.etapa === 7) {
      const brancos = T.ent.filter(x => !x.trim()).length;
      if (brancos > 3 && !T.avisoBranco) { muda({ avisoBranco: true }); return setErro(brancos + " perguntas estão em branco. Se quiser enviar assim mesmo, clique de novo em Enviar respostas."); }
      setEnviando(true);
      const { data, error } = await supabaseNavegador().rpc("enviar_respostas", {
        p_token: token, p_nome: T.nome.trim(), p_respostas: T.ans, p_entrevista: T.ent.map(x => x.slice(0, 4000)),
        p_consentimento: true, p_duracao_seg: T.t1 && T.t7 ? Math.round((T.t7 - T.t1) / 1000) : null
      });
      setEnviando(false);
      if (error) {
        const cod = Object.keys(ERROS).find(k => (error.message || "").includes(k));
        return setErro(cod ? ERROS[cod] : "Não foi possível enviar. Confira a conexão e clique de novo em Enviar respostas.");
      }
      try { localStorage.removeItem(chave); } catch {}
      setSegredo(data);
      muda({ etapa: 8 }); topo();
    }
  }

  const pct = Math.round(Math.min(T.etapa, 7) / 8 * 100);
  const linkDevolutiva = segredo && typeof window !== "undefined" ? window.location.origin + "/d/" + segredo : "";

  return (
    <div className="stack">
      <div className="progresso" aria-hidden="true"><i style={{ width: pct + "%" }} /></div>
      {T.etapa === 0 && (
        <div className="card stack">
          <h2>Antes de começar</h2>
          <p>Você vai ler 60 afirmações sobre o seu jeito de ser e de trabalhar e dizer o quanto concorda com cada uma. Depois, vai responder 10 perguntas contando situações que viveu. Leva de 30 a 40 minutos.</p>
          <p>Não existe resposta certa ou errada. Responda como você é de verdade, não como acha que deveria ser.</p>
          <label className="field">Seu nome completo<input type="text" value={T.nome} onChange={e => muda({ nome: e.target.value })} autoComplete="name" /></label>
          <label className="row small" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
            <input type="checkbox" checked={T.consent} onChange={e => muda({ consent: e.target.checked })} />
            <span>Concordo que as minhas respostas sejam usadas para a análise do meu perfil profissional por quem me enviou este convite, de acordo com a Lei Geral de Proteção de Dados (LGPD). Sei que este teste não é uma avaliação psicológica.</span>
          </label>
        </div>
      )}
      {T.etapa >= 1 && T.etapa <= 6 && (
        <div className="card">
          <div className="row between"><h2>Parte {T.etapa} de 6</h2><span className="small muted">{idxs.filter(ix => T.ans[ix] != null).length} de 10 respondidas</span></div>
          <p className="small muted">O quanto cada afirmação descreve você?</p>
          {idxs.map((ix, j) => {
            const n = (T.etapa - 1) * 10 + j + 1;
            return (
              <fieldset className="item" key={ix}>
                <legend>{n}. {M.ITEMS[ix].t}</legend>
                <div className="likert">
                  {[1, 2, 3, 4, 5].map(v => (
                    <span key={v} style={{ display: "contents" }}>
                      <input type="radio" id={"it" + ix + "-" + v} name={"it" + ix} checked={T.ans[ix] === v}
                        onChange={() => setT(t => { const ans = [...t.ans]; ans[ix] = v; return { ...t, ans }; })} />
                      <label htmlFor={"it" + ix + "-" + v}><b>{v}</b>{LIKERT[v - 1]}</label>
                    </span>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>
      )}
      {T.etapa === 7 && (
        <div className="card stack">
          <h2>Perguntas abertas</h2>
          <p className="muted">Conte situações reais: o que aconteceu, o que você fez e qual foi o resultado. Pode usar exemplos do trabalho, da escola, de projetos ou da vida pessoal.</p>
          {M.INTERVIEW.map((q, i) => (
            <label className="field" key={i}>{i + 1}. {q.q}
              <textarea value={T.ent[i]} onChange={e => setT(t => { const ent = [...t.ent]; ent[i] = e.target.value; return { ...t, ent }; })} />
            </label>
          ))}
        </div>
      )}
      {T.etapa === 8 && (
        <div className="card stack">
          <h2>Pronto, {T.nome.trim().split(" ")[0]}!</h2>
          <p>Suas respostas chegaram. Quando a sua devolutiva for liberada, ela aparece neste link. Guarde-o:</p>
          <p style={{ overflowWrap: "anywhere" }}><a href={linkDevolutiva}>{linkDevolutiva}</a></p>
          <div><CopiarBotao texto={linkDevolutiva} rotulo="Copiar o link" className="btn primary" /></div>
        </div>
      )}
      {T.etapa <= 7 && (
        <div className="row between">
          {T.etapa > 0 ? <button className="btn" onClick={() => { setErro(""); muda({ etapa: T.etapa - 1 }); topo(); }}>Voltar</button> : <span />}
          <button className="btn primary" onClick={continuar} disabled={enviando}>{T.etapa === 7 ? (enviando ? "Enviando…" : "Enviar respostas") : "Continuar"}</button>
        </div>
      )}
      {erro && <p className="err" role="alert">{erro}</p>}
    </div>
  );
}
