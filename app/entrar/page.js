"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseNavegador } from "@/lib/supabase/navegador";
import { AVISO_LEGAL } from "@/lib/formato";

const ERROS = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "Email not confirmed": "Confirme o seu e-mail pelo link que enviamos antes de entrar."
};

export default function Entrar() {
  const router = useRouter();
  const [msg, setMsg] = useState(null);
  const [ocupado, setOcupado] = useState(false);

  async function enviar(ev) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const email = String(f.get("email") || "").trim();
    const senha = String(f.get("senha") || "");
    setMsg(null);
    setOcupado(true);
    const { error } = await supabaseNavegador().auth.signInWithPassword({ email, password: senha });
    setOcupado(false);
    if (error) return setMsg(ERROS[error.message] || "Não foi possível entrar agora. Tente de novo.");
    router.push("/painel");
    router.refresh();
  }

  return (
    <div className="publica" style={{ maxWidth: 440, paddingTop: 64 }}>
      <div className="stack" style={{ gap: 4 }}>
        <h1 style={{ fontSize: "1.4rem" }}>Hayah Talent Intelligence</h1>
        <p className="muted small">Perfil, compatibilidade e alocação de talentos</p>
      </div>
      <form className="card stack" onSubmit={enviar}>
        <h2>Entrar</h2>
        <label className="field">E-mail<input type="email" name="email" autoComplete="email" required /></label>
        <label className="field">Senha<input type="password" name="senha" autoComplete="current-password" required /></label>
        {msg && <div className="alert bad" role="status">{msg}</div>}
        <button className="btn primary" disabled={ocupado}>{ocupado ? "Aguarde…" : "Entrar"}</button>
        <p className="small muted">Ainda não tem conta? O acesso é só por convite. Peça um ao administrador do sistema.</p>
      </form>
      <p className="muted small">{AVISO_LEGAL}</p>
    </div>
  );
}
