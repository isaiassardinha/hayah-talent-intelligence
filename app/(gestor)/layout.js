import { redirect } from "next/navigation";
import NavLateral from "@/components/NavLateral";
import { usuarioAtual } from "@/lib/supabase/server";
import { AVISO_LEGAL } from "@/lib/formato";

export default async function LayoutGestor({ children }) {
  const { user } = await usuarioAtual();
  if (!user) redirect("/entrar");
  return (
    <div className="app">
      <aside className="lateral">
        <div className="marca">
          <h1>Hayah Talent Intelligence</h1>
          <small>Perfil, compatibilidade e alocação de talentos</small>
        </div>
        <NavLateral />
        <div className="pe">
          <span className="muted" style={{ overflowWrap: "anywhere" }}>{user.email}</span>
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
