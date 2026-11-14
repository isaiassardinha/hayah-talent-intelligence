"use client";
import { useEffect, useState } from "react";
import M from "@/lib/motor";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import CopiarBotao from "@/components/CopiarBotao";

const ERROS = {
  convite_invalido: "Este convite não está mais ativo. Fale com quem enviou o link.",
  convite_vencido: "O prazo deste convite terminou. Fale com quem enviou o link.",
  convite_esgotado: "Este convite atingiu o limite de respostas. Fale com quem enviou o link.",
  respostas_invalidas: "Algumas afirmações ficaram sem resposta. Volte e confira.",
  sem_consentimento: "É preciso concordar com o uso das respostas para enviar."
};

// Etapas: 0 = início; 1 a 6 = afirmações de personalidade (10 por parte);
// 7 e 8 = interesses (12 por parte); 9 = motivação para liderar e histórico; 10 = perguntas abertas; 11 = enviado.
const PARTES = 9, ABERTAS = 10, ENVIADO = 11;
const EXTRA_PARTES = { 7: [0, 12], 8: [12, 24], 9: [24, M.EXTRA_N] };
const vazio = () => ({ etapa: 0, nome: "", consent: false, ans: Array(60).fill(null), ext: Array(M.EXTRA_N).fill(null), ent: Array(10).fill(""), t1: null, t7: null, avisoBranco: false });

export default function Teste({ token }) {
  const chave = "hayah-teste-" + token;
  const [T, setT] = useState(vazio);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [segredo, setSegredo] = useState(null);

  // Guarda o progresso neste aparelho, para não perder nada se a página fechar.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(chave) || "null");
      if (s && s.ans && s.ans.length === 60) setT({ ...vazio(), ...s, ext: Array.isArray(s.ext) && s.ext.length === M.EXTRA_N ? s.ext : Array(M.EXTRA_N).fill(null), etapa: Math.min(s.etapa || 0, ABERTAS) });
    } catch {}
  }, [chave]);
  useEffect(() => {
    try { if (T.etapa < ENVIADO) localStorage.setItem(chave, JSON.stringify(T)); } catch {}
  }, [T, chave]);

  const muda = patch => setT(t => ({ ...t, ...patch }));
  const idxs = T.etapa >= 1 && T.etapa <= 6 ? M.ITEM_ORDER.slice((T.etapa - 1) * 10, T.etapa * 10) : [];
  const faixa = EXTRA_PARTES[T.etapa];
  const extIdxs = faixa ? Array.from({ length: faixa[1] - faixa[0] }, (_, j) => faixa[0] + j) : [];
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
    if (faixa) {
      const falta = extIdxs.filter(ix => T.ext[ix] == null).map(ix => 61 + ix);
      if (falta.length) return setErro("Falta responder: " + falta.join(", ") + ".");
      muda({ etapa: T.etapa + 1 }); return topo();
    }
    if (T.etapa === ABERTAS) {
      const brancos = T.ent.filter(x => !x.trim()).length;
      if (brancos > 3 && !T.avisoBranco) { muda({ avisoBranco: true }); return setErro(brancos + " perguntas estão em branco. Se quiser enviar assim mesmo, clique de novo em Enviar respostas."); }
      setEnviando(true);
      const { data, error } = await supabaseNavegador().rpc("enviar_respostas", {
        p_token: token, p_nome: T.nome.trim(), p_respostas: T.ans, p_respostas_extra: T.ext, p_entrevista: T.ent.map(x => x.slice(0, 4000)),
        p_consentimento: true, p_duracao_seg: T.t1 && T.t7 ? Math.round((T.t7 - T.t1) / 1000) : null
      });
      setEnviando(false);
      if (error) {
        const cod = Object.keys(ERROS).find(k => (error.message || "").includes(k));
        return setErro(cod ? ERROS[cod] : "Não foi possível enviar. Confira a conexão e clique de novo em Enviar respostas.");
      }
      try { localStorage.removeItem(chave); } catch {}
      setSegredo(data);
      muda({ etapa: ENVIADO }); topo();
    }
  }

  const pct = Math.round(Math.min(T.etapa, ABERTAS) / ENVIADO * 100);
  const escolha = (lista, ix, campo, escala) => (
    <div className="likert">
      {[1, 2, 3, 4, 5].map(v => (
        <span key={v} style={{ display: "contents" }}>
          <input type="radio" id={campo + ix + "-" + v} name={campo + ix} checked={lista[ix] === v}
            onChange={() => setT(t => { const arr = [...t[campo]]; arr[ix] = v; return { ...t, [campo]: arr }; })} />
          <label htmlFor={campo + ix + "-" + v}><b>{v}</b>{escala[v - 1]}</label>
        </span>
      ))}
    </div>
  );
  const linkDevolutiva = segredo && typeof window !== "undefined" ? window.location.origin + "/d/" + segredo : "";

  return (
    <div className="stack">
      <div className="progresso" aria-hidden="true"><i style={{ width: pct + "%" }} /></div>
      {T.etapa === 0 && (
        <div className="card stack">
          <h2>Antes de começar</h2>
          <p>Você vai ler 60 afirmações sobre o seu jeito de ser e de trabalhar e dizer o quanto concorda com cada uma. Depois, 33 itens rápidos sobre atividades que te atraem e experiências que já viveu. Por fim, 10 perguntas contando situações reais. Leva de 35 a 45 minutos.</p>
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
          <div className="row between"><h2>Parte {T.etapa} de {PARTES}</h2><span className="small muted">{idxs.filter(ix => T.ans[ix] != null).length} de 10 respondidas</span></div>
          <p className="small muted">O quanto cada afirmação descreve você?</p>
          {idxs.map((ix, j) => (
            <fieldset className="item" key={ix}>
              <legend>{(T.etapa - 1) * 10 + j + 1}. {M.ITEMS[ix].t}</legend>
              {escolha(T.ans, ix, "ans", M.ESCALAS.concordo)}
            </fieldset>
          ))}
        </div>
      )}
      {faixa && (
        <div className="card">
          <div className="row between"><h2>Parte {T.etapa} de {PARTES}</h2><span className="small muted">{extIdxs.filter(ix => T.ext[ix] != null).length} de {extIdxs.length} respondidas</span></div>
          {extIdxs.map((ix, j) => {
            const it = M.EXTRA_ITEMS[ix];
            const novoBloco = j === 0 || M.EXTRA_ITEMS[ix - 1].bloco !== it.bloco;
            return (
              <div key={ix}>
                {novoBloco && <p className="small muted" style={{ margin: "8px 0 0" }}>{M.EXTRA_INTRO[it.bloco]}</p>}
                <fieldset className="item">
                  <legend>{61 + ix}. {it.t}</legend>
                  {escolha(T.ext, ix, "ext", M.ESCALAS[it.escala])}
                </fieldset>
              </div>
            );
          })}
        </div>
      )}
      {T.etapa === ABERTAS && (
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
      {T.etapa === ENVIADO && (
        <div className="card stack">
          <h2>Pronto, {T.nome.trim().split(" ")[0]}!</h2>
          <p>Suas respostas chegaram. Quando a sua devolutiva for liberada, ela aparece neste link. Guarde-o:</p>
          <p style={{ overflowWrap: "anywhere" }}><a href={linkDevolutiva}>{linkDevolutiva}</a></p>
          <div><CopiarBotao texto={linkDevolutiva} rotulo="Copiar o link" className="btn primary" /></div>
        </div>
      )}
      {T.etapa <= ABERTAS && (
        <div className="row between">
          {T.etapa > 0 ? <button className="btn" onClick={() => { setErro(""); muda({ etapa: T.etapa - 1 }); topo(); }}>Voltar</button> : <span />}
          <button className="btn primary" onClick={continuar} disabled={enviando}>{T.etapa === ABERTAS ? (enviando ? "Enviando…" : "Enviar respostas") : "Continuar"}</button>
        </div>
      )}
      {erro && <p className="err" role="alert">{erro}</p>}
    </div>
  );
}
