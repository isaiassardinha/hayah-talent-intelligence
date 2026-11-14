"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import { AVISO_LEGAL } from "@/lib/formato";

const ERROS = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "Email not confirmed": "Confirme o seu e-mail pelo link que enviamos antes de entrar.",
  "User already registered": "Já existe uma conta com este e-mail. Use Entrar."
};

export default function Entrar() {
  const router = useRouter();
  const [modo, setModo] = useState("entrar");
  const [msg, setMsg] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  async function enviar(ev) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const email = String(f.get("email") || "").trim();
    const senha = String(f.get("senha") || "");
    setMsg(null);
    if (senha.length < 8) return setMsg({ erro: true, texto: "A senha precisa de pelo menos 8 caracteres." });
    setOcupado(true);
    const supabase = supabaseNavegador();
    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      setOcupado(false);
      if (error) return setMsg({ erro: true, texto: ERROS[error.message] || "Não foi possível entrar agora. Tente de novo." });
      router.push("/painel");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: { nome: String(f.get("nome") || "").trim() }, emailRedirectTo: window.location.origin + "/auth/confirmar" }
      });
      setOcupado(false);
      if (error) return setMsg({ erro: true, texto: ERROS[error.message] || "Não foi possível criar a conta agora. Tente de novo." });
      if (data.session) { router.push("/painel"); router.refresh(); return; }
      setMsg({ erro: false, texto: "Conta criada. Enviamos um link de confirmação para " + email + ". Depois de confirmar, é só entrar." });
      setModo("entrar");
    }
  }

  return (
    <div className="publica" style={{ maxWidth: 440, paddingTop: 64 }}>
      <div className="stack" style={{ gap: 4 }}>
        <h1 style={{ fontSize: "1.4rem" }}>Hayah Talent Intelligence</h1>
        <p className="muted small">Perfil, compatibilidade e alocação de talentos</p>
      </div>
      <form className="card stack" onSubmit={enviar}>
        <h2>{modo === "entrar" ? "Entrar" : "Criar conta de gestor"}</h2>
        {modo === "criar" && (
          <label className="field">Seu nome<input type="text" name="nome" autoComplete="name" required /></label>
        )}
        <label className="field">E-mail<input type="email" name="email" autoComplete="email" required /></label>
        <label className="field">Senha<input type="password" name="senha" autoComplete={modo === "entrar" ? "current-password" : "new-password"} required minLength={8} /></label>
        {msg && <div className={"alert" + (msg.erro ? " bad" : " good")} role="status">{msg.texto}</div>}
        <button className="btn primary" disabled={ocupado}>{ocupado ? "Aguarde…" : modo === "entrar" ? "Entrar" : "Criar conta"}</button>
        <button type="button" className="btn" onClick={() => { setMsg(null); setModo(modo === "entrar" ? "criar" : "entrar"); }}>
          {modo === "entrar" ? "Ainda não tenho conta" : "Já tenho conta"}
        </button>
      </form>
      <p className="muted small">{AVISO_LEGAL}</p>
    </div>
  );
}
