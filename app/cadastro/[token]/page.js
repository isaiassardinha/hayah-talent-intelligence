import { supabasePublico } from "@/lib/supabase/server";
import { AVISO_LEGAL } from "@/lib/formato";
import Cadastro from "./Cadastro";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cadastro de gestor", robots: { index: false } };

export default async function PaginaCadastro({ params }) {
  const { token } = await params;
  const { data } = await supabasePublico().rpc("convite_gestor_publico", { p_token: token });
  const c = data && data[0];
  return (
    <div className="publica" style={{ maxWidth: 440, paddingTop: 64 }}>
      <div className="stack" style={{ gap: 4 }}>
        <h1 style={{ fontSize: "1.4rem" }}>Hayah Talent Intelligence</h1>
        <p className="muted small">Cadastro de gestor</p>
      </div>
      {!c ? (
        <div className="card stack"><h2>Convite não encontrado</h2><p>Confira se o link está completo ou peça um novo convite ao administrador.</p></div>
      ) : !c.valido ? (
        <div className="card stack"><h2>Este convite não vale mais</h2><p>Ele já foi usado, foi cancelado ou passou do prazo. Se você já criou a conta, é só <a href="/entrar">entrar</a>. Se não, peça um novo convite ao administrador.</p></div>
      ) : (
        <Cadastro token={token} email={c.email} nome={c.nome || ""} />
      )}
      <p className="muted small">{AVISO_LEGAL}</p>
    </div>
  );
}
