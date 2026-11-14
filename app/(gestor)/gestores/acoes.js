"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServidor } from "@/lib/supabase/server";

const voltar = (erro, ok) => redirect("/gestores" + (erro ? "?erro=" + encodeURIComponent(erro) : ok ? "?ok=" + encodeURIComponent(ok) : ""));

// O banco só aceita estas ações do administrador (regras de acesso por linha).
export async function convidarGestor(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const nome = String(formData.get("nome") || "").trim().slice(0, 120) || null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) voltar("Escreva um e-mail válido.");
  const supabase = await supabaseServidor();
  const { error } = await supabase.from("convites_gestor").insert({ email, nome });
  if (error) voltar("Não foi possível criar o convite. Só o administrador pode convidar gestores.");
  revalidatePath("/gestores");
  voltar(null, "Convite criado para " + email + ". Copie o link abaixo e envie para a pessoa.");
}

export async function cancelarConviteGestor(id) {
  const supabase = await supabaseServidor();
  await supabase.from("convites_gestor").update({ cancelado_em: new Date().toISOString() }).eq("id", id);
  revalidatePath("/gestores");
}

export async function renovarConviteGestor(id) {
  const supabase = await supabaseServidor();
  const novo = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
  await supabase.from("convites_gestor").update({ cancelado_em: null, expira_em: novo }).eq("id", id);
  revalidatePath("/gestores");
}
