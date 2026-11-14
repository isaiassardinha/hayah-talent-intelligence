import M from "@/lib/motor";

// Análise completa de uma avaliação, com os alertas extras de respostas pouco confiáveis.
export function analisar(av) {
  const notas = Array.isArray(av.notas) ? av.notas : Array(10).fill(null);
  // respostas_extra: interesses, motivação para liderar e histórico (versão 0.3; avaliações antigas não têm)
  const a = M.analyze(av.respostas || [], notas, null, av.respostas_extra || null);
  return { ...a, alerts: a.alerts.concat(M.extraAlerts(a, av.duracao_seg)) };
}

export const ALERTAS_GRAVES = ["inconsistencia", "uniforme", "desejavel", "rapido"];
