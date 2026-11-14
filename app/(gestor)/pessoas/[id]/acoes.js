"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServidor } from "@/lib/supabase/server";
import { avaliarRespostas, claudeDisponivel } from "@/lib/claude";
import { analisar } from "@/lib/analise";
import M from "@/lib/motor";

const pagina = id => "/pessoas/" + id;
const voltar = (id, msg, erro) => redirect(pagina(id) + "?" + (erro ? "erro=" : "ok=") + encodeURIComponent(msg));

export async function salvarNotas(id, formData) {
  const notas = Array.from({ length: 10 }, (_, i) => {
    const v = Number(formData.get("n" + i));
    return v >= 1 && v <= 5 ? v : null;
  });
  const supabase = await supabaseServidor();
  const { error } = await supabase.from("avaliacoes")
    .update({ notas, motivos: null, avaliado_por: "gestor", avaliado_em: new Date().toISOString() })
    .eq("id", id);
  if (error) voltar(id, "Não foi possível salvar as notas agora.", true);
  revalidatePath(pagina(id));
  voltar(id, "Notas da entrevista salvas.");
}

export async function avaliarComClaude(id) {
  if (!claudeDisponivel()) voltar(id, "A avaliação pelo Claude não está configurada.", true);
  const supabase = await supabaseServidor();
  const { data: av } = await supabase.from("avaliacoes").select("entrevista").eq("id", id).single();
  if (!av) voltar(id, "Avaliação não encontrada.", true);
  let r = null;
  try {
    r = await avaliarRespostas(M.INTERVIEW.map(q => q.q), av.entrevista || []);
  } catch (e) {
    voltar(id, "Não foi possível avaliar agora. Tente de novo ou dê as notas à mão.", true);
  }
  await supabase.from("avaliacoes")
    .update({ notas: r.notas, motivos: r.motivos, avaliado_por: "ia", avaliado_em: new Date().toISOString() })
    .eq("id", id);
  revalidatePath(pagina(id));
  voltar(id, "Entrevista avaliada pelo Claude. Confira as notas e ajuste o que precisar.");
}

export async function liberarDevolutiva(id) {
  const supabase = await supabaseServidor();
  const { data: av } = await supabase.from("avaliacoes").select("respostas, notas, tipo, duracao_seg").eq("id", id).single();
  if (!av) voltar(id, "Avaliação não encontrada.", true);
  const fb = M.buildFeedback(analisar(av), av.tipo);
  const { error } = await supabase.from("avaliacoes")
    .update({ devolutiva: fb, devolutiva_liberada_em: new Date().toISOString() })
    .eq("id", id);
  if (error) voltar(id, "Não foi possível liberar agora.", true);
  revalidatePath(pagina(id));
  voltar(id, "Devolutiva liberada. Envie o link para a pessoa.");
}

export async function excluirAvaliacao(id) {
  const supabase = await supabaseServidor();
  await supabase.from("avaliacoes").delete().eq("id", id);
  revalidatePath("/painel");
  redirect("/painel");
}
