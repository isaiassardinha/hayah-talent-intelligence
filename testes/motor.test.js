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
  assert.ok(a.top[0].best >= a.bottom[0].avg);
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
