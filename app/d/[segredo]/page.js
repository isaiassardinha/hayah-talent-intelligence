import { notFound } from "next/navigation";
import { supabasePublico } from "@/lib/supabase/server";
import Devolutiva from "@/components/Devolutiva";
import { AVISO_LEGAL } from "@/lib/formato";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sua devolutiva", robots: { index: false } };

export default async function PaginaDevolutiva({ params }) {
  const { segredo } = await params;
  const { data } = await supabasePublico().rpc("devolutiva_publica", { p_segredo: segredo });
  const d = data && data[0];
  if (!d) notFound();
  return (
    <div className="publica">
      <h1>Sua devolutiva</h1>
      <div className="card stack">
        {d.devolutiva ? (
          <>
            <h2>{d.nome}</h2>
            <Devolutiva fb={d.devolutiva} />
          </>
        ) : (
          <>
            <h2>Olá, {d.nome.split(" ")[0]}</h2>
            <p>Suas respostas chegaram. A devolutiva aparece aqui assim que for liberada. Volte a este link mais tarde.</p>
          </>
        )}
      </div>
      <p className="small muted">{AVISO_LEGAL}</p>
    </div>
  );
}
