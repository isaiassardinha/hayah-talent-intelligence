export const f1 = v => (v == null || Number.isNaN(v) ? "–" : Number(v).toFixed(1).replace(".", ","));
export const fData = ts => (ts ? new Date(ts).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "");
export const corBarra = p => (p >= 70 ? "g" : p >= 50 ? "" : p >= 35 ? "w" : "b");
export const TIPO = { avulso: "Pessoa avulsa", funcionario: "Participante" };
export const ORG = { empresa: "Empresa", entidade: "Entidade", treinamento: "Treinamento" };
export const LIKERT = ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"];
export const AVISO_LEGAL =
  "Protótipo para uso pessoal e testes. Não é avaliação psicológica nem teste psicológico, e não deve ser usado para decidir contratações, demissões ou promoções.";
