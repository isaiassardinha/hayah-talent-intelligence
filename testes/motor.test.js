// Testes do motor de cálculo. Rodar com: npm test
const test = require("node:test");
const assert = require("node:assert/strict");
const M = require("../prototipo/motor.js");

// Respostas simuladas: nível de cada traço (1 a 5), com pequenas variações
const respostas = niveis => M.ITEMS.map((it, i) => {
  const v = Math.max(1, Math.min(5, niveis[it.trait] + ((i * 7) % 3 === 0 ? (i % 2 ? 1 : -1) : 0)));
  return it.dir > 0 ? v : 6 - v;
});
const bruno = respostas({ H: 4, E: 3, X: 2, A: 3, C: 5, O: 4 });
const notasBruno = [3, 5, 2, 3, 5, 4, 2, 5, 4, 5];

test("o teste tem 60 afirmações, 10 por traço", () => {
  assert.equal(M.ITEMS.length, 60);
  for (const t of M.TRAITS) assert.equal(M.ITEMS.filter(i => i.trait === t).length, 10);
});

test("a biblioteca tem 25 departamentos com 3 funções e pesos somando 100", () => {
  assert.equal(M.LIBRARY.length, 25);
  for (const d of M.LIBRARY) {
    assert.ok(d.funcs.length >= 3, d.dept);
    for (const f of d.funcs) {
      const soma = f.comps.reduce((a, c) => a + c.w, 0);
      assert.equal(soma, 100, d.dept + " / " + f.name);
    }
  }
});

test("traços ficam entre 1 e 5", () => {
  const t = M.scoreTraits(bruno);
  for (const k of M.TRAITS) assert.ok(t[k] >= 1 && t[k] <= 5, k);
});

test("análise devolve 3 áreas recomendadas e 3 não indicadas, sem repetir", () => {
  const a = M.analyze(bruno, notasBruno);
  assert.equal(a.top.length, 3);
  assert.equal(a.bottom.length, 3);
  const nomes = new Set([...a.top, ...a.bottom].map(d => d.dept));
  assert.equal(nomes.size, 6);
  assert.ok(a.top[0].area >= a.bottom[0].area);
});

test("perfil organizado e pouco extrovertido vai melhor em Financeiro do que em Vendas", () => {
  const a = M.analyze(bruno, notasBruno);
  const fin = a.depts.find(d => d.dept === "Financeiro").best;
  const ven = a.depts.find(d => d.dept === "Vendas").best;
  assert.ok(fin > ven, `Financeiro ${fin} x Vendas ${ven}`);
});

test("respostas todas iguais geram alerta", () => {
  const a = M.analyze(Array(60).fill(3), Array(10).fill(null));
  assert.ok(a.alerts.some(x => x.code === "uniforme"));
});

test("pré-requisito não atendido elimina e desejáveis somam até 9 pontos", () => {
  const lib = M.buildLibrary({});
  const f = lib.find(d => d.id === "b-financeiro").funcs.find(x => x.name === "Analista financeiro");
  const vaga = { id: "v1", titulo: "Analista financeiro", perfil: f.comps, prereqs: ["a"], desejaveis: ["x", "y", "z", "w"] };
  vaga.perguntas = M.generateQuestions(vaga.perfil, "Analista financeiro");
  assert.ok(vaga.perguntas.length >= 5 && vaga.perguntas.length <= 6);
  const elim = M.scoreVaga(vaga, bruno, notasBruno, { prereq: [false], desej: [], notas: [] });
  assert.equal(elim.eliminado, true);
  const bonus = M.scoreVaga(vaga, bruno, notasBruno, { prereq: [true], desej: [true, true, true, true], notas: [] });
  assert.equal(bonus.bonus, 9);
});

test("risco de saída soma os fatores e classifica", () => {
  const r = M.riskOfLeaving({ cur: 42, bestPct: 95, bestDept: "Contabilidade", sinais: { satisfacao: 2, mesesPromocao: 30, desempenho: 4 } });
  assert.equal(r.score, 75);
  assert.equal(r.level, "alto");
  assert.equal(r.prioridade, true);
});

// ------------------------------------------------------------ versão 0.3
// Bloco 2 simulado: interesses por tipo RIASEC, motivação para liderar e histórico (1 a 5)
const extra = (int, mtl, hist) => M.EXTRA_ITEMS.map(it => it.bloco === "interesse" ? int[it.chave] : it.bloco === "motivacao" ? (it.dir > 0 ? mtl : 6 - mtl) : hist);
// Respostas que reproduzem a média de cada traço (perfil do teste real que apontou logística)
const porMedia = alvo => {
  const ans = Array(60).fill(null);
  for (const t of M.TRAITS) {
    const idx = M.ITEMS.map((it, i) => it.trait === t ? i : -1).filter(i => i >= 0);
    const total = Math.round(alvo[t] * idx.length), base = Math.floor(total / idx.length), resto = total - base * idx.length;
    idx.forEach((i, j) => { const v = base + (j < resto ? 1 : 0); ans[i] = M.ITEMS[i].dir > 0 ? v : 6 - v; });
  }
  return ans;
};
const lider = porMedia({ H: 3.8, E: 2.9, X: 3.8, A: 3.9, C: 3.7, O: 3.2 });

test("o bloco 2 tem 33 itens: 24 de interesses (4 por tipo), 6 de motivação e 3 de histórico", () => {
  assert.equal(M.EXTRA_N, 33);
  for (const t of M.RIASEC) assert.equal(M.EXTRA_ITEMS.filter(i => i.bloco === "interesse" && i.chave === t).length, 4, t);
  assert.equal(M.EXTRA_ITEMS.filter(i => i.bloco === "motivacao").length, 6);
  assert.equal(M.EXTRA_ITEMS.filter(i => i.bloco === "historico").length, 3);
});

test("todo departamento da biblioteca tem código RIASEC válido", () => {
  for (const d of M.LIBRARY) {
    const c = M.DEPT_RIASEC[d.dept];
    assert.ok(c && c.length === 2 && M.RIASEC.includes(c[0]) && M.RIASEC.includes(c[1]), d.dept);
  }
});

test("caso real: perfil de liderança deixa de cair em logística e recebe função de liderança", () => {
  const antes = M.analyze(lider, Array(10).fill(null));
  assert.ok(!antes.extra.respondido && antes.lideranca.medido === false);
  const a = M.analyze(lider, Array(10).fill(null), null, extra({ R: 1, I: 3, A: 3, S: 4, E: 5, C: 3 }, 5, 5));
  const nomes = a.top.map(d => d.dept);
  for (const x of ["Logística", "Produção / Indústria", "Manutenção e facilities"]) assert.ok(!nomes.includes(x), nomes.join(", "));
  assert.equal(a.lideranca.nivel, "alto");
  for (const d of a.top) assert.equal(d.exemplo, d.lider, d.dept);
  const fb = M.buildFeedback(a, "avulso");
  assert.equal(fb.lideranca.nivel, "alto");
  assert.ok(fb.interesses[0].includes("liderar"));
});

test("perfil prático com interesse realista vai para áreas operacionais, sem função de liderança", () => {
  const op = porMedia({ H: 3.6, E: 2.8, X: 2.6, A: 3.6, C: 4.2, O: 2.6 });
  const a = M.analyze(op, Array(10).fill(null), null, extra({ R: 5, I: 2, A: 1, S: 2, E: 2, C: 4 }, 2, 1));
  assert.ok(a.top.some(d => ["Produção / Indústria", "Operações", "Logística", "Manutenção e facilities"].includes(d.dept)), a.top.map(d => d.dept).join(", "));
  assert.equal(a.lideranca.nivel, "baixo");
  for (const d of a.top) assert.notEqual(d.exemplo, d.lider, d.dept);
});

test("respostas sem diferença entre áreas marcam o resultado como inconclusivo", () => {
  const a = M.analyze(Array(60).fill(3), Array(10).fill(null), null, Array(33).fill(3));
  assert.equal(a.inconclusivo, true);
  assert.ok(M.buildFeedback(a, "avulso").aviso);
});

test("estabilidade emocional usa só ansiedade e medo: sentir as emoções dos outros não reduz a nota", () => {
  const base = porMedia({ H: 3, E: 3, X: 3, A: 3, C: 3, O: 3 });
  const sensivel = [...base];
  M.ITEMS.forEach((it, i) => { if (it.facet === "Sentimentalismo") sensivel[i] = it.dir > 0 ? 5 : 1; });
  const e1 = M.analyze(base, Array(10).fill(null)).comps.estabilidade.value;
  const e2 = M.analyze(sensivel, Array(10).fill(null)).comps.estabilidade.value;
  assert.equal(e1, e2);
});
