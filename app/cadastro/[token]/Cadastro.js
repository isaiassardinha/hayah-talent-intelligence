"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseNavegador } from "@/lib/supabase/navegador";

const ERROS = {
  "User already registered": "Já existe uma conta com este e-mail. Use a página Entrar.",
  "Database error saving new user": "Este convite não vale mais. Peça um novo ao administrador."
};

export default function Cadastro({ token, email, nome }) {
  const router = useRouter();
  const [msg, setMsg] = useState(null);
  const [ocupado, setOcupado] = useState(false);
  const [feito, setFeito] = useState(false);

  async function enviar(ev) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const seuNome = String(f.get("nome") || "").trim();
    const senha = String(f.get("senha") || "");
    setMsg(null);
    if (seuNome.length < 2) return setMsg("Escreva o seu nome.");
    if (senha.length < 8) return setMsg("A senha precisa de pelo menos 8 caracteres.");
    if (senha !== String(f.get("senha2") || "")) return setMsg("As duas senhas estão diferentes.");
    setOcupado(true);
    const { data, error } = await supabaseNavegador().auth.signUp({
      email,
      password: senha,
      options: { data: { nome: seuNome, convite: token }, emailRedirectTo: window.location.origin + "/auth/confirmar" }
    });
    setOcupado(false);
    if (error) return setMsg(ERROS[error.message] || "Não foi possível criar a conta agora. Tente de novo.");
    if (data.session) { router.push("/painel"); router.refresh(); return; }
    // Sem sessão: o Supabase ainda está pedindo confirmação por e-mail (opção "Confirm email" ligada).
    setFeito(true);
  }

  if (feito) {
    return (
      <div className="card stack">
        <h2>Conta criada</h2>
        <p>O sistema ainda está configurado para confirmar o e-mail. Procure a mensagem enviada para <strong>{email}</strong> (veja também no spam) ou peça ao administrador para desligar a confirmação por e-mail no Supabase.</p>
      </div>
    );
  }

  return (
    <form className="card stack" onSubmit={enviar}>
      <h2>Criar sua conta</h2>
      <p className="small muted">Você foi convidado para usar o sistema como gestor.</p>
      <label className="field">E-mail<input type="email" value={email} readOnly disabled /></label>
      <label className="field">Seu nome<input type="text" name="nome" defaultValue={nome} autoComplete="name" required maxLength={120} /></label>
      <label className="field">Crie uma senha<input type="password" name="senha" autoComplete="new-password" required minLength={8} /></label>
      <label className="field">Repita a senha<input type="password" name="senha2" autoComplete="new-password" required minLength={8} /></label>
      {msg && <div className="alert bad" role="alert">{msg}</div>}
      <button className="btn primary" disabled={ocupado}>{ocupado ? "Aguarde…" : "Criar conta"}</button>
    </form>
  );
}
