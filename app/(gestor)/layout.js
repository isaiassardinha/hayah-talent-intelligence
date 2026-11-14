import { redirect } from "next/navigation";
import NavLateral from "@/components/NavLateral";
import { usuarioAtual } from "@/lib/supabase/server";
import { AVISO_LEGAL } from "@/lib/formato";

export default async function LayoutGestor({ children }) {
  const { supabase, user } = await usuarioAtual();
  if (!user) redirect("/entrar");
  const { data: gestor } = await supabase.from("gestores").select("nome, papel").eq("id", user.id).maybeSingle();
  const admin = gestor?.papel === "admin";
  return (
    <div className="app">
      <aside className="lateral">
        <div className="marca">
          <h1>Hayah Talent Intelligence</h1>
          <small>Perfil, compatibilidade e alocação de talentos</small>
        </div>
        <NavLateral admin={admin} />
        <div className="pe">
          <span className="muted" style={{ overflowWrap: "anywhere" }}>
            {gestor?.nome ? <><strong style={{ color: "var(--ink)" }}>{gestor.nome}</strong><br /></> : null}
            {user.email}{admin && <><br /><span className="chip">Administrador</span></>}
          </span>
          <form action="/auth/sair" method="post"><button className="btn small">Sair</button></form>
        </div>
      </aside>
      <div>
        <main className="conteudo">{children}</main>
        <footer className="aviso">{AVISO_LEGAL}</footer>
      </div>
    </div>
  );
}
