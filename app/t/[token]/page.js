import { supabasePublico } from "@/lib/supabase/server";
import { AVISO_LEGAL } from "@/lib/formato";
import Teste from "./Teste";

export const dynamic = "force-dynamic";
export const metadata = { title: "Teste de perfil profissional", robots: { index: false } };

export default async function PaginaTeste({ params }) {
  const { token } = await params;
  const { data } = await supabasePublico().rpc("convite_publico", { p_token: token });
  const c = data && data[0];
  return (
    <div className="publica">
      <div className="stack" style={{ gap: 2 }}>
        <h1>Teste de perfil profissional</h1>
        <p className="small muted">{c && c.empresa ? c.empresa : "Hayah Talent Intelligence"}</p>
      </div>
      {!c ? (
        <div className="card stack"><h2>Convite não encontrado</h2><p>Confira se o link está completo ou peça um novo link a quem enviou.</p></div>
      ) : !c.aberto ? (
        <div className="card stack"><h2>Este convite foi encerrado</h2><p>Ele não recebe mais respostas. Fale com quem enviou o link.</p></div>
      ) : (
        <Teste token={token} />
      )}
      <p className="small muted">{AVISO_LEGAL}</p>
    </div>
  );
}
