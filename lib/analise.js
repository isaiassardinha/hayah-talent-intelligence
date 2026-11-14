import M from "@/lib/motor";

// Análise completa de uma avaliação, com os alertas extras de respostas pouco confiáveis.
export function analisar(av) {
  const notas = Array.isArray(av.notas) ? av.notas : Array(10).fill(null);
  const a = M.analyze(av.respostas || [], notas);
  return { ...a, alerts: a.alerts.concat(M.extraAlerts(a, av.duracao_seg)) };
}

export const ALERTAS_GRAVES = ["inconsistencia", "uniforme", "desejavel", "rapido"];
