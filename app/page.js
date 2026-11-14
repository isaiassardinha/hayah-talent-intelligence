import { redirect } from "next/navigation";
import { usuarioAtual } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const { user } = await usuarioAtual();
  redirect(user ? "/painel" : "/entrar");
}
