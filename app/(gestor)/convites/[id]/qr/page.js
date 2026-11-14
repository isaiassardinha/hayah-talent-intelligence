import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { supabaseServidor } from "@/lib/supabase/server";
import { origem } from "@/lib/origem";
import { fData } from "@/lib/formato";
import CopiarBotao from "@/components/CopiarBotao";

export const dynamic = "force-dynamic";

// QR code do convite, para mostrar no projetor ou imprimir. Só o dono do convite vê (regras do banco).
export default async function QrDoConvite({ params }) {
  const { id } = await params;
  const supabase = await supabaseServidor();
  const { data: c } = await supabase.from("convites").select("token, rotulo, limite, expira_em, ativo, empresas(nome)").eq("id", id).maybeSingle();
  if (!c) notFound();
  const link = (await origem()) + "/t/" + c.token;
  const svg = await QRCode.toString(link, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#15233b", light: "#ffffff" } });

  return (
    <>
      <p className="small"><Link href="/convites">← Testes e convites</Link></p>
      <section className="card stack" style={{ alignItems: "center", textAlign: "center" }}>
        <h2>{c.rotulo || "Teste de perfil profissional"}</h2>
        {c.empresas && <p className="muted">{c.empresas.nome}</p>}
        <p>Aponte a câmera do celular para o código e faça o teste.</p>
        <div className="qr" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="num" style={{ overflowWrap: "anywhere", fontSize: "1.05rem" }}>{link}</p>
        <p className="small muted">
          Até {c.limite} {c.limite === 1 ? "pessoa" : "pessoas"} · {c.expira_em ? "vale até " + fData(c.expira_em) : "sem prazo"}{!c.ativo && " · encerrado"}
        </p>
        <CopiarBotao texto={link} rotulo="Copiar o link" className="btn" />
      </section>
    </>
  );
}
