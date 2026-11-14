"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServidor } from "@/lib/supabase/server";

const voltar = (erro, ok) => redirect("/convites" + (erro ? "?erro=" + encodeURIComponent(erro) : ok ? "?ok=" + encodeURIComponent(ok) : ""));

export async function criarEmpresa(formData) {
  const nome = String(formData.get("nome") || "").trim();
  const tipo = ["empresa", "entidade", "treinamento"].includes(formData.get("tipo")) ? formData.get("tipo") : "empresa";
  if (nome.length < 2) voltar("Escreva o nome.");
  const supabase = await supabaseServidor();
  const { error } = await supabase.from("empresas").insert({ nome: nome.slice(0, 120), tipo });
  if (error) voltar("Não foi possível cadastrar agora.");
  revalidatePath("/convites");
  voltar(null, nome + " cadastrado.");
}

export async function criarConvite(formData) {
  const empresa_id = String(formData.get("empresa_id") || "") || null;
  const tipo = formData.get("tipo") === "funcionario" ? "funcionario" : "avulso";
  const rotulo = String(formData.get("rotulo") || "").trim().slice(0, 160) || null;
  const menores = formData.get("menores") === "on";
  const autorizo = formData.get("autorizo") === "on";
  if (tipo === "funcionario" && !empresa_id) voltar("Para convidar participantes, escolha a empresa, entidade ou treinamento.");
  if (menores && !autorizo) voltar("Para um grupo com menores, confirme que você tem a autorização dos pais ou responsáveis.");
  const supabase = await supabaseServidor();
  const { error } = await supabase.from("convites").insert({
    empresa_id, tipo, rotulo, menores, autorizacao_em: menores ? new Date().toISOString() : null
  });
  if (error) voltar("Não foi possível criar o convite agora.");
  revalidatePath("/convites");
  voltar(null, "Convite criado. Copie o link e envie para as pessoas.");
}

export async function alternarConvite(id, ativo) {
  const supabase = await supabaseServidor();
  await supabase.from("convites").update({ ativo: !ativo }).eq("id", id);
  revalidatePath("/convites");
}
