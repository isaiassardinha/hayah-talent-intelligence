/* Motor de cálculo extraído de prototipo/index.html (primeiro <script>). Gerado por npm run extrair: não edite este arquivo à mão. */

/* Hayah Talent Intelligence — motor de cálculo (etapa 1)
   Fonte: documento "Sistema de Perfil e Alocação de Talentos", seções 2, 3, 3A, 3B e 3C. */

const TRAITS = ["H", "E", "X", "A", "C", "O"];
const TRAIT_NAMES = {
  H: "Honestidade-humildade", E: "Emocionalidade", X: "Extroversão",
  A: "Amabilidade", C: "Conscienciosidade", O: "Abertura a experiências"
};

/* 3C — 60 afirmações: [texto, traço, faceta, sentido] */
const ITEMS = [
  ["Não finjo ser mais do que sou.", "H", "Sinceridade", 1],
  ["Uso elogios para me dar bem.", "H", "Sinceridade", -1],
  ["Digo às pessoas o que elas querem ouvir para que façam o que eu quero.", "H", "Sinceridade", -1],
  ["Eu nunca pegaria algo que não é meu.", "H", "Justiça", 1],
  ["Devolvo o troco quando o caixa me dá a mais por engano.", "H", "Justiça", 1],
  ["Trapaceio para levar vantagem.", "H", "Justiça", -1],
  ["Não gostaria de ser uma celebridade famosa.", "H", "Desapego material", 1],
  ["Adoro luxo.", "H", "Desapego material", -1],
  ["Não me acho melhor do que as outras pessoas.", "H", "Modéstia", 1],
  ["Costumo me exibir quando tenho chance.", "H", "Modéstia", -1],
  ["Começo a entrar em pânico quando há perigo.", "E", "Medo", 1],
  ["Enfrento o perigo com confiança.", "E", "Medo", -1],
  ["Aceito correr riscos.", "E", "Medo", -1],
  ["Costumo me preocupar com as coisas.", "E", "Ansiedade", 1],
  ["Me estresso com facilidade.", "E", "Ansiedade", 1],
  ["Mantenho a calma sob pressão.", "E", "Ansiedade", -1],
  ["Preciso da aprovação dos outros.", "E", "Dependência", 1],
  ["Busco apoio nas outras pessoas.", "E", "Dependência", 1],
  ["Sinto as emoções dos outros.", "E", "Sentimentalismo", 1],
  ["Raramente me emociono.", "E", "Sentimentalismo", -1],
  ["Tenho capacidade de liderança.", "X", "Ousadia social", 1],
  ["Me saio bem quando preciso falar de improviso.", "X", "Ousadia social", 1],
  ["Prefiro ficar em segundo plano.", "X", "Ousadia social", -1],
  ["Faço amizade com facilidade.", "X", "Sociabilidade", 1],
  ["Não gostaria de um trabalho com muito contato com pessoas.", "X", "Sociabilidade", -1],
  ["Mantenho as pessoas à distância.", "X", "Sociabilidade", -1],
  ["Falo bastante.", "X", "Expressividade", 1],
  ["Não gosto de chamar atenção para mim.", "X", "Expressividade", -1],
  ["Geralmente tenho muita energia e disposição.", "X", "Vitalidade", 1],
  ["Me canso rápido.", "X", "Vitalidade", -1],
  ["Tenho facilidade para perdoar.", "A", "Perdão", 1],
  ["Guardo rancor.", "A", "Perdão", -1],
  ["Aceito as pessoas como elas são.", "A", "Gentileza", 1],
  ["Julgo os outros rapidamente.", "A", "Gentileza", -1],
  ["Me adapto com facilidade.", "A", "Flexibilidade", 1],
  ["Sei aceitar conselhos.", "A", "Flexibilidade", 1],
  ["Não suporto que me contrariem.", "A", "Flexibilidade", -1],
  ["Geralmente sou uma pessoa paciente.", "A", "Paciência", 1],
  ["Me irrito com facilidade.", "A", "Paciência", -1],
  ["Perco o controle quando fico com raiva.", "A", "Paciência", -1],
  ["Gosto de ordem.", "C", "Organização", 1],
  ["Deixo minhas coisas espalhadas.", "C", "Organização", -1],
  ["Me dedico muito ao que faço.", "C", "Diligência", 1],
  ["Começo logo as tarefas, sem enrolar.", "C", "Diligência", 1],
  ["Faço só o mínimo necessário.", "C", "Diligência", -1],
  ["Presto atenção aos detalhes.", "C", "Perfeccionismo", 1],
  ["Presto pouca atenção aos detalhes.", "C", "Perfeccionismo", -1],
  ["Faço planos e cumpro.", "C", "Prudência", 1],
  ["Tomo decisões precipitadas.", "C", "Prudência", -1],
  ["Cometo erros por descuido.", "C", "Prudência", -1],
  ["Vejo beleza em coisas que os outros não percebem.", "O", "Apreciação estética", 1],
  ["Não gosto de arte.", "O", "Apreciação estética", -1],
  ["Me interesso por ciência.", "O", "Curiosidade intelectual", 1],
  ["Gosto de ler textos desafiadores.", "O", "Curiosidade intelectual", 1],
  ["Não costumo me aprofundar nos assuntos.", "O", "Curiosidade intelectual", -1],
  ["Adoro pensar em novas formas de fazer as coisas.", "O", "Criatividade", 1],
  ["Tenho muitas ideias.", "O", "Criatividade", 1],
  ["Tenho dificuldade de imaginar coisas.", "O", "Criatividade", -1],
  ["Sei que minhas ideias às vezes surpreendem as pessoas.", "O", "Não convencionalidade", 1],
  ["Prefiro que me vejam como alguém convencional.", "O", "Não convencionalidade", -1]
].map(([t, trait, facet, dir]) => ({ t, trait, facet, dir }));

/* Ordem na tela: rodízio entre os traços (1, 11, 21, 31, 41, 51, 2, 12...) */
const ITEM_ORDER = [];
for (let i = 0; i < 10; i++) for (let t = 0; t < 6; t++) ITEM_ORDER.push(t * 10 + i);

/* Pares de coerência (números 1 a 60) */
const COHERENCE_PAIRS = [[11, 12], [15, 16], [33, 34], [46, 47], [56, 58]];

/* 3A — competências calculadas a partir dos traços.
   Ea = estabilidade: facetas Ansiedade e Medo da Emocionalidade, invertidas (6 − média).
   Sentimentalismo e Dependência ficam de fora: sentir as emoções dos outros não é instabilidade. */
const COMPS = {
  resiliencia:     { label: "Resiliência", w: { Ea: .6, C: .4 } },
  estabilidade:    { label: "Estabilidade emocional", w: { Ea: 1 } },
  disciplina:      { label: "Disciplina", w: { C: 1 } },
  organizacao:     { label: "Organização / planejamento", w: { C: .8, O: .2 } },
  detalhes:        { label: "Atenção a detalhes / segurança", w: { C: 1 } },
  pontualidade:    { label: "Pontualidade", w: { C: 1 } },
  integridade:     { label: "Integridade / discrição", w: { H: .8, C: .2 } },
  comunicacao:     { label: "Comunicação", w: { X: .6, O: .4 } },
  escrita:         { label: "Comunicação escrita", w: { O: .6, C: .4 } },
  extroversao:     { label: "Extroversão", w: { X: 1 } },
  persuasao:       { label: "Persuasão / negociação", w: { X: .5, Ea: .3, O: .2 } },
  relacionamento:  { label: "Relacionamento", w: { X: .5, A: .5 } },
  cordialidade:    { label: "Cordialidade / paciência", w: { A: .8, Ea: .2 } },
  empatia:         { label: "Escuta e empatia", w: { A: .6, E: .2, O: .2 } },
  conflitos:       { label: "Mediação de conflitos", w: { A: .5, Ea: .3, H: .2 } },
  lideranca:       { label: "Liderança", w: { X: .4, C: .3, Ea: .3 } },
  desenvolvimento: { label: "Desenvolvimento de pessoas", w: { A: .4, X: .3, O: .3 } },
  autoconfianca:   { label: "Autoconfiança / firmeza", w: { X: .5, Ea: .5 } },
  autonomia:       { label: "Autonomia / proatividade", w: { C: .5, X: .3, O: .2 } },
  criatividade:    { label: "Criatividade", w: { O: 1 } },
  curiosidade:     { label: "Curiosidade / aprendizado contínuo", w: { O: .8, C: .2 } },
  estrategia:      { label: "Visão estratégica", w: { O: .6, C: .4 } },
  analitica:       { label: "Visão analítica / raciocínio", w: { O: .4, C: .6 } },
  problemas:       { label: "Resolução de problemas", w: { O: .5, C: .3, Ea: .2 } },
  resultado:       { label: "Foco em resultado", w: { C: .7, X: .3 } },
  crise:           { label: "Gestão de crise / tomada de decisão", w: { Ea: .5, C: .3, X: .2 } },
  feedback:        { label: "Abertura a feedback / humildade", w: { H: .5, A: .3, O: .2 } },
  equipe:          { label: "Trabalho em equipe", w: { A: .6, H: .2, X: .2 } },
  tecnico:         { label: "Conhecimento técnico / do produto", w: null } // não vem de personalidade
};

/* Nomes usados na biblioteca → competência da 3A */
const ALIAS = {
  "resiliência": "resiliencia", "disciplina": "disciplina", "comunicação": "comunicacao",
  "extroversão": "extroversao", "curiosidade": "curiosidade", "organização": "organizacao",
  "persuasão e negociação": "persuasao", "escuta e empatia": "empatia", "autoconfiança": "autoconfianca",
  "foco em resultado": "resultado", "conhecimento do produto": "tecnico", "liderança": "lideranca",
  "desenvolvimento de pessoas": "desenvolvimento", "visão analítica": "analitica",
  "estabilidade emocional": "estabilidade", "planejamento": "organizacao", "criatividade": "criatividade",
  "comunicação escrita": "escrita", "abertura a feedback": "feedback", "visão de público": "empatia",
  "atenção a detalhes": "detalhes", "raciocínio lógico": "analitica", "visão estratégica": "estrategia",
  "raciocínio numérico": "analitica", "integridade": "integridade", "discrição": "integridade",
  "cordialidade": "cordialidade", "julgamento de pessoas": "empatia", "mediação de conflitos": "conflitos",
  "atenção a segurança e detalhes": "detalhes", "resistência física e de rotina": "disciplina",
  "trabalho em equipe": "equipe", "pontualidade": "pontualidade", "liderança de equipe": "lideranca",
  "resolução de problemas": "problemas", "melhoria contínua": "problemas", "paciência": "cordialidade",
  "aprendizado contínuo": "curiosidade", "foco e concentração": "disciplina",
  "gestão de prioridades": "organizacao", "proatividade": "autonomia", "raciocínio analítico": "analitica",
  "argumentação": "persuasao", "negociação": "persuasao", "atenção a segurança": "detalhes",
  "resistência de rotina": "disciplina", "relacionamento": "relacionamento", "visão de usuário": "empatia",
  "gestão de riscos": "crise", "gestão de crise": "crise", "habilidade manual": "tecnico",
  "conhecimento técnico": "tecnico", "gestão de custos": "analitica", "firmeza": "autoconfianca",
  "tomada de decisão": "crise", "autonomia": "autonomia", "persuasão": "persuasao",
  "didática": "desenvolvimento", "escuta": "empatia", "pesquisa de mercado": "analitica",
  "comunicação visual": "criatividade", "visão de negócio": "estrategia",
  "raciocínio estatístico": "analitica", "cuidado e empatia": "empatia", "empatia": "empatia"
};

/* 3 — Biblioteca: 25 departamentos × 3 funções. "nome peso C" separados por ";" (C = crítica). */
const LIBRARY_RAW = [
  ["Vendas", [
    ["SDR", "resiliência 25 C; disciplina 20 C; comunicação 20; extroversão 15; curiosidade 10; organização 10"],
    ["Closer", "persuasão e negociação 25 C; escuta e empatia 20 C; autoconfiança 15; resiliência 15; foco em resultado 15; conhecimento do produto 10"],
    ["Gerente de vendas", "liderança 25 C; desenvolvimento de pessoas 20 C; visão analítica 20; estabilidade emocional 15; planejamento 10; comunicação 10"]]],
  ["Marketing", [
    ["Analista de conteúdo", "criatividade 25 C; comunicação escrita 25 C; curiosidade 15; organização 15; abertura a feedback 10; visão de público 10"],
    ["Analista de performance", "visão analítica 30 C; atenção a detalhes 20 C; raciocínio lógico 20; curiosidade 10; foco em resultado 10; organização 10"],
    ["Gerente de marketing", "visão estratégica 25 C; liderança 20 C; visão analítica 15; criatividade 15; comunicação 15; planejamento 10"]]],
  ["Financeiro", [
    ["Assistente financeiro", "atenção a detalhes 30 C; organização 25 C; disciplina 20; integridade 15; raciocínio numérico 10"],
    ["Analista financeiro", "raciocínio numérico 30 C; visão analítica 25 C; atenção a detalhes 15; integridade 15; comunicação 15"],
    ["Controller / gerente financeiro", "visão estratégica 25 C; integridade 20 C; visão analítica 20; liderança 15; estabilidade emocional 10; comunicação 10"]]],
  ["Recursos Humanos", [
    ["Assistente de RH / DP", "organização 25 C; atenção a detalhes 25 C; discrição 20; cordialidade 15; disciplina 15"],
    ["Analista de recrutamento e desenvolvimento", "escuta e empatia 25 C; julgamento de pessoas 25 C; comunicação 20; organização 15; discrição 15"],
    ["Gerente de RH", "liderança 20 C; mediação de conflitos 20 C; visão estratégica 20; integridade 15; estabilidade emocional 15; comunicação 10"]]],
  ["Operações", [
    ["Operador / auxiliar", "disciplina 25 C; atenção a segurança e detalhes 25 C; resistência física e de rotina 20; trabalho em equipe 15; pontualidade 15"],
    ["Supervisor de operações", "organização 25 C; liderança de equipe 25 C; resolução de problemas 20; estabilidade emocional 15; comunicação 15"],
    ["Gerente de operações", "planejamento 25 C; visão analítica 20 C; liderança 20; melhoria contínua 20; estabilidade emocional 15"]]],
  ["Tecnologia", [
    ["Suporte técnico / helpdesk", "paciência 25 C; resolução de problemas 25 C; comunicação 20; organização 15; aprendizado contínuo 15"],
    ["Desenvolvedor / analista", "raciocínio lógico 30 C; atenção a detalhes 20 C; aprendizado contínuo 20; foco e concentração 15; trabalho em equipe 15"],
    ["Gerente de tecnologia", "visão estratégica 25 C; liderança 20 C; raciocínio lógico 20; gestão de prioridades 20; comunicação 15"]]],
  ["Atendimento ao cliente", [
    ["Atendente", "paciência 25 C; cordialidade 25 C; comunicação 20; estabilidade emocional 15; organização 15"],
    ["Analista de sucesso do cliente", "escuta e empatia 25 C; resolução de problemas 20 C; proatividade 20; comunicação 20; visão analítica 15"],
    ["Supervisor de atendimento", "liderança 25 C; estabilidade emocional 25 C; visão analítica 20; desenvolvimento de pessoas 15; mediação de conflitos 15"]]],
  ["Jurídico", [
    ["Assistente jurídico", "atenção a detalhes 30 C; organização 25 C; discrição 20; disciplina 15; comunicação escrita 10"],
    ["Advogado / analista jurídico", "raciocínio analítico 25 C; comunicação escrita 25 C; integridade 20; argumentação 15; estabilidade emocional 15"],
    ["Gerente jurídico", "visão estratégica 25 C; integridade 25 C; liderança 20; negociação 15; comunicação 15"]]],
  ["Compras e suprimentos", [
    ["Assistente de compras", "organização 25 C; atenção a detalhes 25 C; comunicação 20; disciplina 15; integridade 15"],
    ["Comprador", "negociação 30 C; integridade 20 C; visão analítica 20; comunicação 15; organização 15"],
    ["Gerente de suprimentos", "planejamento 25 C; visão estratégica 20 C; negociação 20; liderança 20; visão analítica 15"]]],
  ["Logística", [
    ["Auxiliar de logística", "disciplina 25 C; atenção a detalhes 25 C; resistência física e de rotina 20; pontualidade 15; trabalho em equipe 15"],
    ["Analista de logística", "planejamento 25 C; visão analítica 25 C; resolução de problemas 20; organização 15; comunicação 15"],
    ["Gerente de logística", "liderança 25 C; planejamento 25 C; estabilidade emocional 20; negociação 15; visão estratégica 15"]]],
  ["Produção / Indústria", [
    ["Operador de produção", "disciplina 25 C; atenção a segurança 25 C; resistência de rotina 20; trabalho em equipe 15; pontualidade 15"],
    ["Líder de produção", "liderança de equipe 25 C; organização 25 C; resolução de problemas 20; estabilidade emocional 15; comunicação 15"],
    ["Gerente industrial", "planejamento 25 C; melhoria contínua 20 C; visão analítica 20; liderança 20; visão estratégica 15"]]],
  ["Qualidade", [
    ["Inspetor de qualidade", "atenção a detalhes 30 C; disciplina 25 C; integridade 20; organização 15; comunicação 10"],
    ["Analista de qualidade", "visão analítica 25 C; resolução de problemas 25 C; atenção a detalhes 20; comunicação 15; melhoria contínua 15"],
    ["Gerente de qualidade", "integridade 25 C; visão estratégica 20 C; liderança 20; melhoria contínua 20; comunicação 15"]]],
  ["Administrativo", [
    ["Recepcionista / auxiliar administrativo", "cordialidade 25 C; organização 25 C; comunicação 20; discrição 15; pontualidade 15"],
    ["Assistente administrativo", "organização 30 C; atenção a detalhes 20 C; proatividade 20; comunicação 15; disciplina 15"],
    ["Gerente administrativo", "planejamento 25 C; liderança 20 C; visão analítica 20; integridade 20; comunicação 15"]]],
  ["Contabilidade", [
    ["Auxiliar contábil", "atenção a detalhes 30 C; organização 25 C; disciplina 20; integridade 15; raciocínio numérico 10"],
    ["Analista contábil / fiscal", "raciocínio numérico 25 C; atenção a detalhes 25 C; integridade 20; aprendizado contínuo 15; visão analítica 15"],
    ["Contador / gerente contábil", "integridade 25 C; visão analítica 25 C; liderança 20; comunicação 15; planejamento 15"]]],
  ["Comunicação e relações públicas", [
    ["Assistente de comunicação", "comunicação escrita 25 C; criatividade 20 C; organização 20; curiosidade 20; abertura a feedback 15"],
    ["Analista de comunicação", "comunicação 25 C; criatividade 20 C; relacionamento 20; visão de público 20; organização 15"],
    ["Gerente de comunicação / RP", "gestão de crise 25 C; visão estratégica 20 C; relacionamento 20; liderança 20; estabilidade emocional 15"]]],
  ["Pesquisa e desenvolvimento / Produto", [
    ["Assistente de pesquisa", "curiosidade 25 C; atenção a detalhes 25 C; organização 20; aprendizado contínuo 15; disciplina 15"],
    ["Analista de produto / P&D", "criatividade 25 C; raciocínio analítico 25 C; visão de usuário 20; comunicação 15; abertura a feedback 15"],
    ["Gerente de produto / P&D", "visão estratégica 25 C; liderança 20 C; gestão de prioridades 20; criatividade 20; comunicação 15"]]],
  ["Projetos / PMO", [
    ["Assistente de projetos", "organização 30 C; disciplina 20 C; comunicação 20; atenção a detalhes 15; proatividade 15"],
    ["Analista / coordenador de projetos", "planejamento 25 C; comunicação 25 C; gestão de riscos 20; resolução de problemas 15; mediação de conflitos 15"],
    ["Gerente de projetos / PMO", "liderança 25 C; visão estratégica 20 C; gestão de prioridades 20; estabilidade emocional 20; negociação 15"]]],
  ["Manutenção e facilities", [
    ["Auxiliar de manutenção / serviços gerais", "disciplina 25 C; atenção a segurança 25 C; habilidade manual 20; pontualidade 15; cordialidade 15"],
    ["Técnico de manutenção", "resolução de problemas 30 C; conhecimento técnico 25 C; atenção a segurança 20; organização 15; aprendizado contínuo 10"],
    ["Gerente de manutenção / facilities", "planejamento 25 C; liderança 25 C; gestão de custos 20; estabilidade emocional 15; negociação 15"]]],
  ["Segurança do trabalho e meio ambiente", [
    ["Técnico de segurança do trabalho", "atenção a segurança 30 C; firmeza 20 C; comunicação 20; disciplina 15; integridade 15"],
    ["Analista de meio ambiente / SSMA", "visão analítica 25 C; integridade 25 C; organização 20; comunicação 15; aprendizado contínuo 15"],
    ["Gerente de SSMA", "liderança 25 C; integridade 25 C; visão estratégica 20; comunicação 15; estabilidade emocional 15"]]],
  ["Diretoria e gestão estratégica", [
    ["Assistente executivo / secretariado", "organização 25 C; discrição 25 C; proatividade 20; comunicação 15; cordialidade 15"],
    ["Analista de planejamento estratégico", "visão analítica 30 C; visão estratégica 25 C; comunicação 15; curiosidade 15; raciocínio numérico 15"],
    ["Diretor / gestor geral", "visão estratégica 25 C; liderança 25 C; tomada de decisão 20; estabilidade emocional 15; integridade 15"]]],
  ["Comercial externo e representação", [
    ["Vendedor externo", "resiliência 25 C; relacionamento 25 C; autonomia 20; organização 15; persuasão 15"],
    ["Representante comercial", "autonomia 25 C; negociação 25 C; disciplina 20; relacionamento 15; conhecimento do produto 15"],
    ["Gerente regional", "liderança 25 C; visão estratégica 20 C; negociação 20; visão analítica 20; estabilidade emocional 15"]]],
  ["Treinamento e educação corporativa", [
    ["Instrutor / facilitador", "comunicação 30 C; didática 25 C; paciência 15; extroversão 15; organização 15"],
    ["Analista de treinamento", "organização 25 C; visão analítica 20 C; comunicação 20; criatividade 20; escuta 15"],
    ["Gerente de educação corporativa", "visão estratégica 25 C; desenvolvimento de pessoas 25 C; liderança 20; planejamento 15; comunicação 15"]]],
  ["Expansão e franquias", [
    ["Analista de expansão", "visão analítica 25 C; pesquisa de mercado 25 C; organização 20; comunicação 15; negociação 15"],
    ["Consultor de campo / franquias", "relacionamento 25 C; firmeza 20 C; comunicação 20; resolução de problemas 20; autonomia 15"],
    ["Gerente de expansão", "visão estratégica 25 C; negociação 25 C; liderança 20; gestão de riscos 15; planejamento 15"]]],
  ["Dados e BI", [
    ["Analista de dados", "raciocínio lógico 30 C; atenção a detalhes 20 C; curiosidade 20; comunicação 15; aprendizado contínuo 15"],
    ["Analista de BI", "visão analítica 25 C; comunicação visual 20 C; visão de negócio 20; organização 20; raciocínio lógico 15"],
    ["Cientista de dados / gerente de dados", "raciocínio estatístico 25 C; visão estratégica 20 C; aprendizado contínuo 20; liderança 20; comunicação 15"]]],
  ["Saúde ocupacional e bem-estar", [
    ["Técnico de enfermagem do trabalho", "cuidado e empatia 25 C; atenção a detalhes 25 C; discrição 20; estabilidade emocional 15; organização 15"],
    ["Analista de qualidade de vida", "empatia 25 C; comunicação 20 C; criatividade 20; organização 20; visão analítica 15"],
    ["Gerente de saúde ocupacional", "integridade 25 C; liderança 20 C; visão estratégica 20; discrição 20; comunicação 15"]]]
];

function parseLibrary(raw) {
  return raw.map(([dept, funcs]) => ({
    dept,
    funcs: funcs.map(([name, spec]) => ({
      name,
      comps: spec.split(";").map(s => {
        const m = s.trim().match(/^(.*?)\s+(\d+)(\s+C)?$/);
        if (!m) throw new Error("Competência mal formada: " + s + " (" + name + ")");
        const key = ALIAS[m[1].trim()];
        if (!key) throw new Error("Competência sem ligação na 3A: " + m[1] + " (" + name + ")");
        return { name: m[1].trim(), key, w: +m[2], crit: !!m[3] };
      })
    }))
  }));
}
const LIBRARY = parseLibrary(LIBRARY_RAW);

/* 3B — entrevista geral: pergunta e competências que alimenta */
const INTERVIEW = [
  ["Conte uma situação em que você enfrentou muita pressão ou várias recusas seguidas. O que fez?", ["resiliencia", "estabilidade"]],
  ["Conte uma tarefa longa ou repetitiva que você levou até o fim. Como manteve o ritmo?", ["disciplina", "organizacao"]],
  ["Conte quando precisou convencer alguém de uma ideia. Como fez?", ["comunicacao", "persuasao"]],
  ["Conte um conflito com alguém e como ele terminou.", ["conflitos", "relacionamento"]],
  ["Conte um problema que ninguém sabia resolver e como você chegou à solução.", ["problemas", "analitica"]],
  ["Conte uma ideia nova que você teve e colocou em prática.", ["criatividade", "autonomia"]],
  ["Conte quando você liderou ou ajudou um grupo a alcançar algo.", ["lideranca", "desenvolvimento"]],
  ["Conte quando percebeu um erro, seu ou de outra pessoa, que ninguém tinha visto. O que fez?", ["detalhes", "integridade"]],
  ["Conte quando recebeu uma crítica dura. Como reagiu e o que mudou?", ["feedback"]],
  ["Conte algo que você aprendeu sozinho porque quis. Como aprendeu?", ["curiosidade"]]
].map(([q, comps]) => ({ q, comps }));

/* Regras de cálculo (seção 2, decisões da etapa 1) */
const RULES = {
  wTraitsWithInterview: 0.6,   // sem amostra de trabalho: 60% traços + 40% entrevista
  wInterview: 0.4,
  criticalMin: 3,              // competência crítica abaixo de 3 → penalidade
  criticalPenalty: 10,         // pontos percentuais por competência crítica abaixo do mínimo
  ideal: 5,                    // perfil ideal = 5 em todas as competências da função
  /* Áreas (top 3 / 3 não indicadas) — versão 0.3 */
  stdSpread: 0.8,              // perfil padronizado: cada desvio-padrão da pessoa vale 0,8 ponto
  stdMinSd: 0.3,               // desvio mínimo usado na padronização (evita esticar ruído)
  wAreaPerfil: 0.5,            // nota da área = 50% perfil padronizado + 50% interesses
  wAreaInteresse: 0.5,
  interesseSpread: 20,         // interesse: cada desvio-padrão da pessoa vale 20 pontos
  inconclusivo: 8,             // média das 3 primeiras áreas menos a mediana de todas abaixo disso = sem preferência clara
  /* Liderança — versão 0.3 */
  wLidMotivacao: 0.4,          // índice de liderança = 40% motivação para liderar
  wLidHistorico: 0.3,          //   + 30% histórico de liderança
  wLidTracos: 0.3,             //   + 30% competência liderança (traços)
  lidAlto: 3.8, lidMedio: 3.0  // faixas do índice (1 a 5)
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const round1 = v => Math.round(v * 10) / 10;

/* Notas dos traços (1 a 5) a partir das 60 respostas (1 a 5; null = sem resposta) */
function scoreTraits(answers) {
  const sum = {}, n = {};
  TRAITS.forEach(t => { sum[t] = 0; n[t] = 0; });
  ITEMS.forEach((it, i) => {
    const a = answers[i];
    if (a == null || !(a >= 1 && a <= 5)) return;
    sum[it.trait] += it.dir > 0 ? a : 6 - a;
    n[it.trait]++;
  });
  const out = {};
  TRAITS.forEach(t => { out[t] = n[t] ? sum[t] / n[t] : null; });
  // Ea: estabilidade emocional só pelas facetas Ansiedade e Medo (invertidas)
  let se = 0, ne = 0;
  ITEMS.forEach((it, i) => {
    const a = answers[i];
    if (it.trait !== "E" || (it.facet !== "Ansiedade" && it.facet !== "Medo") || a == null || !(a >= 1 && a <= 5)) return;
    se += it.dir > 0 ? a : 6 - a; ne++;
  });
  out.Ea = ne ? 6 - se / ne : (out.E == null ? null : 6 - out.E);
  return out;
}

function traitValue(traits, k) {
  if (k === "Ea") return traits.Ea != null ? traits.Ea : 6 - traits.E;
  return k === "Ei" ? 6 - traits.E : traits[k];
}

/* ================= Bloco 2 (versão 0.3): interesses, motivação para liderar e histórico ================= */
/* Itens próprios, escritos para este sistema. Interesses seguem o modelo RIASEC de Holland (teoria pública);
   a motivação para liderar segue a ideia da literatura, sem copiar escalas publicadas. */
const RIASEC = ["R", "I", "A", "S", "E", "C"];
const RIASEC_NAMES = { R: "Realista", I: "Investigativo", A: "Artístico", S: "Social", E: "Empreendedor", C: "Convencional" };
const RIASEC_TEXT = {
  R: "trabalhar com as mãos, máquinas e atividades práticas",
  I: "investigar, analisar e entender como as coisas funcionam",
  A: "criar, imaginar e se expressar",
  S: "ensinar, ajudar e cuidar de pessoas",
  E: "liderar, convencer e tomar a frente",
  C: "organizar, conferir e seguir procedimentos"
};
const ESCALAS = {
  concordo: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"],
  interesse: ["Não gostaria nada", "Gostaria pouco", "Indiferente", "Gostaria", "Gostaria muito"],
  vezes: ["Nunca", "1 vez", "2 ou 3 vezes", "4 a 6 vezes", "Mais de 6 vezes"]
};
/* 33 itens: [texto, bloco, chave, sentido]. bloco: interesse (chave = tipo RIASEC), motivacao, historico (chave = lid ou dev). */
const EXTRA_ITEMS = [
  ["Montar, consertar ou fazer manutenção em máquinas e equipamentos.", "interesse", "R", 1],
  ["Investigar a causa de um problema até entender como ele funciona.", "interesse", "I", 1],
  ["Criar textos, imagens, vídeos ou músicas.", "interesse", "A", 1],
  ["Ensinar ou treinar outras pessoas.", "interesse", "S", 1],
  ["Liderar uma equipe para alcançar uma meta.", "interesse", "E", 1],
  ["Organizar arquivos, planilhas e documentos.", "interesse", "C", 1],
  ["Trabalhar com as mãos, construindo ou instalando coisas.", "interesse", "R", 1],
  ["Fazer testes ou experimentos para descobrir algo.", "interesse", "I", 1],
  ["Desenhar, decorar ou planejar o visual de alguma coisa.", "interesse", "A", 1],
  ["Ajudar pessoas a resolver problemas pessoais ou profissionais.", "interesse", "S", 1],
  ["Convencer pessoas a apoiar uma ideia ou comprar um produto.", "interesse", "E", 1],
  ["Conferir números, notas ou relatórios para achar erros.", "interesse", "C", 1],
  ["Operar veículos, ferramentas ou máquinas.", "interesse", "R", 1],
  ["Analisar números e dados para tirar conclusões.", "interesse", "I", 1],
  ["Inventar ideias para uma campanha ou um produto novo.", "interesse", "A", 1],
  ["Cuidar da saúde ou do bem-estar de outras pessoas.", "interesse", "S", 1],
  ["Abrir e administrar o próprio negócio.", "interesse", "E", 1],
  ["Seguir procedimentos e normas com precisão.", "interesse", "C", 1],
  ["Trabalhar em campo, numa obra, fazenda, oficina ou armazém.", "interesse", "R", 1],
  ["Estudar a fundo um assunto técnico ou científico.", "interesse", "I", 1],
  ["Escrever histórias, roteiros ou conteúdos para redes sociais.", "interesse", "A", 1],
  ["Atender pessoas e orientar sobre o que elas precisam.", "interesse", "S", 1],
  ["Negociar acordos, preços ou contratos.", "interesse", "E", 1],
  ["Controlar estoque, pagamentos ou cadastros.", "interesse", "C", 1],
  ["Gosto de tomar a frente quando um grupo precisa de direção.", "motivacao", "mtl", 1],
  ["Sinto satisfação em coordenar o trabalho de outras pessoas.", "motivacao", "mtl", 1],
  ["Prefiro ser liderado a liderar.", "motivacao", "mtl", -1],
  ["Quando o grupo precisa decidir algo difícil, costumo me oferecer para conduzir.", "motivacao", "mtl", 1],
  ["Me vejo, no futuro, à frente de uma equipe.", "motivacao", "mtl", 1],
  ["Quando ninguém assume a liderança, sinto que devo assumir.", "motivacao", "mtl", 1],
  ["Quantas vezes você coordenou um grupo, uma equipe ou um projeto (no trabalho, na escola, na igreja, no esporte ou em trabalho voluntário)?", "historico", "lid", 1],
  ["Quantas vezes outras pessoas escolheram você para representar ou liderar um grupo?", "historico", "lid", 1],
  ["Quantas vezes você ensinou, treinou ou orientou alguém por algumas semanas ou mais?", "historico", "dev", 1]
].map(([t, bloco, chave, dir]) => ({ t, bloco, chave, dir, escala: bloco === "interesse" ? "interesse" : bloco === "historico" ? "vezes" : "concordo" }));
const EXTRA_N = EXTRA_ITEMS.length;
const EXTRA_INTRO = {
  interesse: "O quanto você gostaria de fazer cada atividade no trabalho? Pense no que te atrai, não no que você já sabe fazer.",
  motivacao: "O quanto cada afirmação descreve você?",
  historico: "Conte quantas vezes isso já aconteceu na sua vida, em qualquer lugar: trabalho, escola, família, igreja, esporte ou voluntariado."
};

/* Notas do bloco 2 (1 a 5). Sem respostas: null em tudo (avaliações antigas). */
function scoreExtra(extra) {
  const out = { interesses: null, mtl: null, histLid: null, histDev: null, respondido: false };
  if (!Array.isArray(extra) || !extra.some(a => a >= 1 && a <= 5)) return out;
  const acc = {};
  EXTRA_ITEMS.forEach((it, i) => {
    const a = extra[i];
    if (a == null || !(a >= 1 && a <= 5)) return;
    const k = it.bloco === "historico" ? "hist" + it.chave : it.chave;
    const v = it.dir > 0 ? a : 6 - a;
    (acc[k] = acc[k] || []).push(v);
  });
  const avg = k => acc[k] && acc[k].length ? acc[k].reduce((x, y) => x + y, 0) / acc[k].length : null;
  const ints = {};
  RIASEC.forEach(t => { ints[t] = avg(t); });
  out.interesses = RIASEC.some(t => ints[t] != null) ? ints : null;
  out.mtl = avg("mtl");
  out.histLid = avg("histlid");
  out.histDev = avg("histdev");
  out.respondido = true;
  return out;
}

/* Notas de entrevista por competência: geral (10 perguntas) + específica da vaga (5 a 6 perguntas) */
function interviewMap(generalNotes, specificQs, specificNotes) {
  const m = {};
  const add = (k, s) => { if (s >= 1 && s <= 5) (m[k] = m[k] || []).push(s); };
  if (generalNotes) INTERVIEW.forEach((q, i) => q.comps.forEach(c => add(c, generalNotes[i])));
  if (specificQs && specificNotes) specificQs.forEach((q, i) => add(q.key, specificNotes[i]));
  return m;
}

/* Notas das competências (1 a 5): traços + entrevista quando avaliada.
   Conhecimento técnico não vem da personalidade: só entra quando a entrevista específica o avalia. */
function scoreCompetenciesFromMap(traits, ivMap, ex) {
  const out = {};
  Object.entries(COMPS).forEach(([key, c]) => {
    const list = ivMap[key];
    const iv = list && list.length ? list.reduce((a, b) => a + b, 0) / list.length : null;
    if (!c.w) { out[key] = { value: iv, traits: null, interview: iv }; return; }
    let t = 0;
    Object.entries(c.w).forEach(([k, w]) => { t += w * traitValue(traits, k); });
    // versão 0.3: liderança e desenvolvimento de pessoas também usam o bloco 2 (mais perguntas por competência)
    if (ex && key === "lideranca" && ex.mtl != null) t = 0.5 * t + 0.3 * ex.mtl + 0.2 * (ex.histLid != null ? ex.histLid : ex.mtl);
    if (ex && key === "desenvolvimento" && ex.histDev != null) t = 0.7 * t + 0.3 * ex.histDev;
    const value = iv == null ? t : RULES.wTraitsWithInterview * t + RULES.wInterview * iv;
    out[key] = { value, traits: t, interview: iv };
  });
  return out;
}
function scoreCompetencies(traits, interviewScores, ex) {
  return scoreCompetenciesFromMap(traits, interviewMap(interviewScores), ex);
}

/* Compatibilidade de uma função: 100% − distância ponderada até o ideal (5), com penalidade de crítica */
function scoreFunction(func, comps) {
  const byKey = {};
  func.comps.forEach(c => {
    const v = comps[c.key] && comps[c.key].value;
    if (v == null) return; // conhecimento técnico: não avaliado na etapa 1
    const e = byKey[c.key] || (byKey[c.key] = { key: c.key, names: [], w: 0, crit: false, value: v });
    e.names.push(c.name); e.w += c.w; e.crit = e.crit || c.crit;
  });
  const entries = Object.values(byKey);
  const wSum = entries.reduce((a, e) => a + e.w, 0);
  if (!wSum) return { pct: null, gaps: [], notEvaluated: true };
  const dist = entries.reduce((a, e) => a + e.w * (RULES.ideal - e.value), 0) / (wSum * (RULES.ideal - 1));
  const gaps = entries.filter(e => e.crit && e.value < RULES.criticalMin);
  const pct = clamp(100 * (1 - dist) - RULES.criticalPenalty * gaps.length, 0, 100);
  const skipped = func.comps.filter(c => comps[c.key] && comps[c.key].value == null).map(c => c.name);
  return { pct: Math.round(pct), gaps, entries, skipped };
}

const RISK_GROUPS = [
  ["risco de estresse", ["estabilidade", "resiliencia", "crise", "autoconfianca"]],
  ["risco de erro", ["detalhes", "disciplina", "organizacao", "pontualidade", "integridade", "analitica"]],
  ["risco de desgaste", ["extroversao", "relacionamento", "comunicacao", "persuasao", "cordialidade", "empatia", "conflitos", "equipe"]]
];
function riskLabel(key) {
  const g = RISK_GROUPS.find(([, keys]) => keys.includes(key));
  return g ? g[0] : "baixa aderência";
}

/* Código RIASEC de cada departamento da biblioteca: tipo principal e secundário. */
const DEPT_RIASEC = {
  "Vendas": "ES", "Marketing": "AE", "Financeiro": "CI", "Recursos Humanos": "SE", "Operações": "RC",
  "Tecnologia": "IC", "Atendimento ao cliente": "SC", "Jurídico": "EI", "Compras e suprimentos": "CE",
  "Logística": "CR", "Produção / Indústria": "RC", "Qualidade": "CI", "Administrativo": "CS", "Contabilidade": "CI",
  "Comunicação e relações públicas": "AS", "Pesquisa e desenvolvimento / Produto": "IA", "Projetos / PMO": "EC",
  "Manutenção e facilities": "RI", "Segurança do trabalho e meio ambiente": "IR", "Diretoria e gestão estratégica": "EC",
  "Comercial externo e representação": "ES", "Treinamento e educação corporativa": "SA", "Expansão e franquias": "EI",
  "Dados e BI": "IC", "Saúde ocupacional e bem-estar": "SI"
};

const media = v => v.reduce((a, b) => a + b, 0) / v.length;
const desvio = v => { const m = media(v); return Math.sqrt(media(v.map(x => (x - m) * (x - m)))); };
const mediana = v => { const o = [...v].sort((a, b) => a - b); const k = Math.floor(o.length / 2); return o.length % 2 ? o[k] : (o[k - 1] + o[k]) / 2; };

/* Perfil padronizado: o que se destaca na própria pessoa. Média da pessoa = 3; cada desvio-padrão vale 0,8 ponto. */
function standardize(comps) {
  const vals = Object.values(comps).map(c => c.value).filter(v => v != null);
  const m = vals.length ? media(vals) : 3;
  const sd = Math.max(vals.length ? desvio(vals) : 0, RULES.stdMinSd);
  const out = {};
  Object.entries(comps).forEach(([k, c]) => { out[k] = c.value == null ? null : clamp(3 + (c.value - m) / sd * RULES.stdSpread, 1, 5); });
  return { values: out, mean: m, sd: desvio(vals.length ? vals : [3]) };
}
/* Aderência relativa de uma função (0 a 100): média ponderada do perfil padronizado, sem penalidade. */
function relativeFit(func, std) {
  let s = 0, w = 0;
  func.comps.forEach(c => { const v = std[c.key]; if (v == null) return; s += c.w * v; w += c.w; });
  return w ? (s / w - 1) / 4 * 100 : null;
}
/* Interesses padronizados (z da pessoa) por tipo RIASEC */
function interestZ(ints) {
  if (!ints) return null;
  const vals = RIASEC.map(t => ints[t]).filter(v => v != null);
  if (vals.length < 6) return null;
  const m = media(vals), sd = Math.max(desvio(vals), RULES.stdMinSd);
  const z = {};
  RIASEC.forEach(t => { z[t] = (ints[t] - m) / sd; });
  return z;
}
/* Função que lidera no departamento: a de maior peso em liderança */
function leaderFunc(d) {
  let best = null, bw = 0;
  d.funcs.forEach(f => { const w = f.comps.filter(c => c.key === "lideranca").reduce((a, c) => a + c.w, 0); if (w > bw) { bw = w; best = f.name; } });
  return best;
}

/* Departamentos (versão 0.3).
   area = 50% perfil padronizado (média das funções, sem deixar o cargo de entrada decidir) + 50% interesses.
   best (maior nota) e avg (média) continuam calculados com as notas absolutas, para vagas e comparações. */
function scoreDepartments(comps, lib, ex) {
  const std = standardize(comps).values;
  const z = interestZ(ex && ex.interesses);
  return (lib || LIBRARY).map(d => {
    const funcs = d.funcs.map(f => ({ name: f.name, ...scoreFunction(f, comps), rel: relativeFit(f, std) }));
    const vals = funcs.map(f => f.pct).filter(v => v != null);
    const best = Math.max(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const rels = funcs.map(f => f.rel).filter(v => v != null);
    const perfil = rels.length ? media(rels) : null;
    const code = DEPT_RIASEC[d.dept] || null;
    const interesse = z && code ? clamp(50 + RULES.interesseSpread * (2 * z[code[0]] + z[code[1]]) / 3, 0, 100) : null;
    const area = perfil == null ? null : interesse == null ? perfil : RULES.wAreaPerfil * perfil + RULES.wAreaInteresse * interesse;
    // motivo do desencaixe: competências críticas mais fracas do departamento
    const crit = {};
    d.funcs.forEach(f => f.comps.forEach(c => {
      if (!c.crit) return;
      const v = comps[c.key] && comps[c.key].value;
      if (v == null) return;
      crit[c.key] = { key: c.key, label: COMPS[c.key].label, value: v };
    }));
    const weakest = Object.values(crit).sort((a, b) => a.value - b.value).slice(0, 2);
    const reasons = weakest.map(w => ({ ...w, risk: riskLabel(w.key) }));
    const interesseBaixo = interesse != null && interesse < 40 ? RIASEC_TEXT[code[0]] : null;
    return {
      dept: d.dept, id: d.id, funcs, best: Math.round(best), avg: Math.round(avg), reasons,
      perfil: perfil == null ? null : Math.round(perfil), interesse: interesse == null ? null : Math.round(interesse),
      area: area == null ? null : Math.round(area), riasec: code, lider: leaderFunc(d), interesseBaixo
    };
  });
}

/* Índice de liderança (1 a 5): motivação para liderar + histórico + traços. Sem o bloco 2, só os traços. */
function leadershipIndex(traits, ex) {
  let tr = 0;
  Object.entries(COMPS.lideranca.w).forEach(([k, w]) => { tr += w * traitValue(traits, k); });
  const medido = !!(ex && ex.mtl != null);
  const value = medido
    ? RULES.wLidMotivacao * ex.mtl + RULES.wLidHistorico * (ex.histLid != null ? ex.histLid : ex.mtl) + RULES.wLidTracos * tr
    : tr;
  const nivel = value >= RULES.lidAlto ? "alto" : value >= RULES.lidMedio ? "medio" : "baixo";
  return { value, nivel, medido, motivacao: medido ? ex.mtl : null, historico: medido ? ex.histLid : null, tracos: tr };
}

/* Alertas de qualidade das respostas */
function answerAlerts(answers) {
  const alerts = [];
  const contradictions = COHERENCE_PAIRS.filter(([a, b]) => answers[a - 1] >= 4 && answers[b - 1] >= 4);
  if (contradictions.length >= 2) {
    alerts.push({ code: "inconsistencia", text: "Concordou com os dois lados de " + contradictions.length + " pares de afirmações opostas (" + contradictions.map(p => p.join(" × ")).join(", ") + "). As respostas podem não refletir o perfil real." });
  }
  const answered = answers.filter(a => a >= 1 && a <= 5);
  if (answered.length) {
    const counts = [1, 2, 3, 4, 5].map(v => answered.filter(a => a === v).length);
    const top = Math.max(...counts);
    if (top / answered.length >= 0.7) {
      alerts.push({ code: "uniforme", text: "Usou a mesma resposta em " + Math.round(100 * top / answered.length) + "% das afirmações. Pode ter respondido sem ler." });
    }
    const extremes = answered.filter(a => a === 1 || a === 5).length;
    if (extremes / answered.length >= 0.85 && top / answered.length < 0.7) {
      alerts.push({ code: "extremos", text: "Respondeu quase tudo nos extremos (1 ou 5). Vale confirmar o perfil na entrevista." });
    }
  }
  if (answered.length < 60) alerts.push({ code: "incompleto", text: (60 - answered.length) + " afirmações ficaram sem resposta." });
  return alerts;
}

/* Análise completa de uma pessoa */
function analyze(answers, interviewScores, lib, extra) {
  const traits = scoreTraits(answers);
  const ex = scoreExtra(extra);
  const comps = scoreCompetencies(traits, interviewScores, ex);
  const depts = scoreDepartments(comps, lib, ex).filter(d => d.area != null);
  const top = [...depts].sort((a, b) => b.area - a.area || b.best - a.best).slice(0, 3);
  const topNames = new Set(top.map(d => d.dept));
  const bottom = [...depts].filter(d => !topNames.has(d.dept)).sort((a, b) => a.area - b.area || a.avg - b.avg).slice(0, 3);
  const lideranca = leadershipIndex(traits, ex);
  // diferença pequena entre as áreas = sem preferência clara
  const gap = depts.length > 3 ? media(top.map(d => d.area)) - mediana(depts.map(d => d.area)) : null;
  const inconclusivo = gap != null && gap < RULES.inconclusivo;
  // função de exemplo em cada área: a que lidera, quando o índice de liderança é alto; senão a de maior nota
  top.forEach(d => {
    const porNota = [...d.funcs].filter(f => f.pct != null).sort((a, b) => b.pct - a.pct);
    const naoLider = porNota.filter(f => f.name !== d.lider);
    d.exemplo = lideranca.nivel === "alto" && d.lider ? d.lider : (naoLider[0] || porNota[0]).name;
  });
  const compList = Object.entries(comps)
    .filter(([, c]) => c.value != null)
    .map(([key, c]) => ({ key, label: COMPS[key].label, ...c }))
    .sort((a, b) => b.value - a.value);
  const interviewDone = !!(interviewScores && interviewScores.some(s => s >= 1 && s <= 5));
  return { traits, comps, compList, depts, top, bottom, alerts: answerAlerts(answers), interviewDone,
    extra: ex, interesses: ex.interesses, lideranca, inconclusivo, gap: gap == null ? null : Math.round(gap) };
}

/* Textos da devolutiva (linguagem para a pessoa avaliada) */
const TRAIT_TEXT = {
  H: ["Você é pragmático e se sente à vontade em ambientes competitivos e de negociação.", "Você equilibra franqueza com senso prático.", "Você age com franqueza, valoriza regras justas e não se move por status."],
  E: ["Você mantém a calma sob pressão e lida bem com riscos e imprevistos.", "Você equilibra sensibilidade e firmeza diante de situações difíceis.", "Você é sensível ao clima das pessoas e percebe o que os outros sentem."],
  X: ["Você é reservado e rende bem em trabalhos que pedem foco e concentração.", "Você transita bem entre momentos de interação e de trabalho individual.", "Você é comunicativo, gosta de interagir e tem energia para se expor."],
  A: ["Você é direto e exigente e defende seus pontos com firmeza.", "Você combina paciência com firmeza quando precisa.", "Você é paciente, tolerante e fácil de conviver."],
  C: ["Você é flexível e espontâneo e prefere ambientes com menos rotina.", "Você combina organização com flexibilidade.", "Você é organizado, disciplinado e cuidadoso com os detalhes."],
  O: ["Você é prático e concreto e prefere métodos já testados.", "Você equilibra ideias novas com soluções já conhecidas.", "Você é curioso e criativo e gosta de ideias e caminhos novos."]
};
function traitBand(v) { return v < 2.6 ? 0 : v <= 3.4 ? 1 : 2; }

/* ================= Fase 4: caminhos de formação ================= */
const CAREERS = {
  "Vendas": ["Curso técnico em Vendas ou Marketing", "Graduação em Administração ou tecnólogo em Gestão Comercial"],
  "Marketing": ["Graduação em Marketing, Publicidade ou Comunicação", "Cursos livres de marketing digital e análise de métricas"],
  "Financeiro": ["Técnico em Finanças ou Administração", "Graduação em Administração, Economia ou Ciências Contábeis"],
  "Recursos Humanos": ["Técnico em Recursos Humanos", "Graduação em Gestão de RH, Psicologia ou Administração"],
  "Operações": ["Técnico em Administração ou Logística", "Tecnólogo em Processos Gerenciais"],
  "Tecnologia": ["Técnico em Informática ou Desenvolvimento de Sistemas", "Graduação em Sistemas de Informação, Ciência da Computação ou ADS"],
  "Atendimento ao cliente": ["Cursos livres de atendimento e experiência do cliente", "Tecnólogo em Gestão Comercial"],
  "Jurídico": ["Técnico em Serviços Jurídicos", "Graduação em Direito"],
  "Compras e suprimentos": ["Técnico em Logística ou Administração", "Tecnólogo em Logística ou graduação em Administração"],
  "Logística": ["Técnico em Logística", "Tecnólogo em Logística"],
  "Produção / Indústria": ["Curso técnico industrial, como Mecânica, Eletrotécnica ou Química", "Tecnólogo em Produção Industrial ou Engenharia de Produção"],
  "Qualidade": ["Técnico em Qualidade", "Tecnólogo em Gestão da Qualidade ou Engenharia"],
  "Administrativo": ["Técnico em Administração ou Secretariado", "Tecnólogo em Processos Gerenciais"],
  "Contabilidade": ["Técnico em Contabilidade", "Graduação em Ciências Contábeis"],
  "Comunicação e relações públicas": ["Graduação em Jornalismo, Relações Públicas ou Publicidade", "Cursos livres de redação e comunicação corporativa"],
  "Pesquisa e desenvolvimento / Produto": ["Graduação em Engenharia, Design ou na área técnica do produto", "Especialização em gestão de produto"],
  "Projetos / PMO": ["Tecnólogo em Gestão de Projetos ou graduação em Administração ou Engenharia", "Cursos de gestão de projetos e métodos ágeis"],
  "Manutenção e facilities": ["Técnico em Manutenção, Eletrotécnica ou Mecânica", "Cursos de normas de segurança, como a NR-10"],
  "Segurança do trabalho e meio ambiente": ["Técnico em Segurança do Trabalho ou em Meio Ambiente", "Engenharia de Segurança do Trabalho ou Ambiental"],
  "Diretoria e gestão estratégica": ["Graduação em Administração ou Secretariado Executivo", "MBA em gestão"],
  "Comercial externo e representação": ["Curso técnico em Vendas", "Tecnólogo em Gestão Comercial"],
  "Treinamento e educação corporativa": ["Graduação em Pedagogia, Psicologia ou licenciatura", "Especialização em educação corporativa"],
  "Expansão e franquias": ["Graduação em Administração", "Cursos de franchising e análise de mercado"],
  "Dados e BI": ["Graduação em Estatística, Computação, Economia ou Engenharia", "Cursos de SQL, Excel avançado e visualização de dados"],
  "Saúde ocupacional e bem-estar": ["Técnico em Enfermagem com foco em saúde do trabalho", "Graduação em Enfermagem, Psicologia ou Educação Física"]
};
const CURSO_COMP = {
  resiliencia: "gestão do estresse e inteligência emocional", estabilidade: "inteligência emocional", disciplina: "gestão do tempo e produtividade",
  organizacao: "planejamento e gestão do tempo", detalhes: "revisão e controle de qualidade", pontualidade: "gestão do tempo",
  integridade: "ética profissional e compliance", comunicacao: "oratória e apresentações", escrita: "redação profissional",
  extroversao: "oratória e networking", persuasao: "negociação e persuasão", relacionamento: "relacionamento interpessoal",
  cordialidade: "atendimento e comunicação não violenta", empatia: "escuta ativa e comunicação não violenta", conflitos: "mediação de conflitos",
  lideranca: "formação de líderes", desenvolvimento: "como ensinar e dar feedback", autoconfianca: "comunicação assertiva",
  autonomia: "resolução de problemas e tomada de iniciativa", criatividade: "criatividade e inovação", curiosidade: "aprender a aprender",
  estrategia: "planejamento estratégico", analitica: "análise de dados e Excel", problemas: "resolução de problemas e análise de causa",
  resultado: "gestão por metas", crise: "tomada de decisão sob pressão", feedback: "como receber e usar feedback", equipe: "trabalho em equipe"
};

function buildFeedback(result, tipo) {
  const perfil = TRAITS.map(t => TRAIT_TEXT[t][traitBand(result.traits[t])]);
  const fortes = result.compList.slice(0, 4).map(c => c.label);
  const desenvolver = result.compList.slice(-2).reverse().map(c => c.label);
  const areas = result.top.map(d => {
    const bestF = [...d.funcs].filter(f => f.pct != null).sort((a, b) => b.pct - a.pct)[0];
    return { dept: d.dept, funcao: d.exemplo || bestF.name, pct: d.area != null ? d.area : d.best, formacao: CAREERS[d.dept] || [] };
  });
  const cursos = result.compList.slice(-2).reverse().map(c => CURSO_COMP[c.key]).filter(Boolean);
  const intro = tipo === "funcionario"
    ? "Esta devolutiva mostra seus pontos fortes e onde você pode crescer na empresa."
    : "Esta devolutiva mostra seu jeito de trabalhar e as áreas em que seu perfil tende a render mais.";
  // versão 0.3: interesses, liderança e aviso de resultado sem preferência clara
  let interesses = null;
  if (result.interesses) {
    const ord = RIASEC.filter(t => result.interesses[t] != null).sort((a, b) => result.interesses[b] - result.interesses[a]);
    interesses = ord.slice(0, 2).map(t => RIASEC_TEXT[t]);
  }
  const L = result.lideranca;
  const lideranca = L && L.medido ? {
    nivel: L.nivel,
    texto: L.nivel === "alto"
      ? "Seu perfil mostra gosto e experiência em coordenar pessoas. Funções de liderança tendem a combinar com você."
      : L.nivel === "medio"
        ? "Você tem base para coordenar pessoas em alguns contextos. Liderar projetos curtos ajuda a descobrir se esse caminho combina com você."
        : "Seu perfil tende a render mais com foco na própria entrega do que na coordenação de pessoas, ao menos por enquanto."
  } : null;
  const aviso = result.inconclusivo
    ? "Seu resultado não mostrou uma preferência forte por uma área. As áreas abaixo ficaram só um pouco à frente das outras: use-as como ponto de partida para conversar, não como conclusão."
    : null;
  return { tipo, intro, perfil, fortes, desenvolver, areas, cursos, interesses, lideranca, aviso };
}

/* ================= Etapa 2: biblioteca editável, vagas, entrevista específica, reorganização ================= */

const RULES2 = {
  desejavelBonus: 3,   // cada ponto desejável atendido soma 3 pontos
  desejavelMax: 9,     // até 9 pontos no total
  specificComps: 5,    // entrevista específica: 5 competências mais importantes da vaga + 1 de conhecimento técnico
  moveMin: 60,         // reorganização: só sugere vaga com 60% ou mais
  moveGain: 10,        // e com pelo menos 10 pontos acima da função atual
  lowFit: 50           // abaixo de 50% na função atual gera alerta
};

/* Banco de perguntas da entrevista específica: uma por competência */
const QBANK = {
  resiliencia: "Conte uma fase em que as coisas deram errado várias vezes seguidas. Como você seguiu em frente?",
  estabilidade: "Conte uma situação de muita tensão no trabalho ou nos estudos. Como controlou suas reações?",
  disciplina: "Conte uma rotina que você manteve por muito tempo, mesmo sem vontade. Como fez para não parar?",
  organizacao: "Conte quando você tinha muitas tarefas ao mesmo tempo. Como decidiu a ordem e o que aconteceu?",
  detalhes: "Conte um trabalho em que um pequeno erro teria um custo alto. Como garantiu que estava certo?",
  pontualidade: "Conte quando um prazo ou horário quase escapou. O que você fez para cumprir?",
  integridade: "Conte quando teve acesso a uma informação confidencial ou a uma chance de levar vantagem. O que fez?",
  comunicacao: "Conte quando precisou explicar algo difícil a alguém que não conhecia o assunto. Como fez?",
  escrita: "Conte um texto importante que você escreveu, como um relatório ou e-mail. Como garantiu que ficasse claro?",
  extroversao: "Conte quando precisou puxar conversa ou se apresentar a pessoas desconhecidas. Como foi?",
  persuasao: "Conte uma negociação em que o outro lado começou dizendo não. Como terminou?",
  relacionamento: "Conte como você construiu uma boa relação com alguém difícil de agradar.",
  cordialidade: "Conte quando atendeu alguém irritado ou impaciente. O que você disse e fez?",
  empatia: "Conte quando percebeu que alguém precisava de ajuda antes que a pessoa pedisse. O que fez?",
  conflitos: "Conte quando duas pessoas à sua volta estavam em conflito. Qual foi o seu papel?",
  lideranca: "Conte quando precisou cobrar um resultado de alguém do grupo. Como fez?",
  desenvolvimento: "Conte quando você ensinou algo a alguém. Como soube que a pessoa aprendeu?",
  autoconfianca: "Conte quando você defendeu uma posição mesmo com outras pessoas contra. O que aconteceu?",
  autonomia: "Conte algo que você resolveu sem ninguém pedir. Por que decidiu agir?",
  criatividade: "Conte quando os recursos eram poucos e você precisou inventar uma solução.",
  curiosidade: "Conte o último assunto novo da sua área que você estudou. Como colocou em prática?",
  estrategia: "Conte quando você pensou além da tarefa do dia e propôs um plano de médio ou longo prazo.",
  analitica: "Conte quando usou números ou dados para tomar uma decisão. Que dados olhou e o que concluiu?",
  problemas: "Conte um problema que se repetia e como você descobriu a causa.",
  resultado: "Conte uma meta difícil que você precisou bater. O que fez de diferente?",
  crise: "Conte quando precisou tomar uma decisão rápida sem ter todas as informações. Como decidiu?",
  feedback: "Conte quando você errou em algo importante. Como assumiu o erro e o que mudou depois?",
  equipe: "Conte quando o sucesso dependia do grupo todo. O que você fez para o grupo funcionar?"
};
const techQuestion = funcName => "Conte sua experiência com as tarefas de " + funcName + ": o que já fez, com quais ferramentas ou métodos e com que resultado.";

/* 5 competências da vaga (críticas primeiro, depois peso) + conhecimento técnico */
function generateQuestions(profile, funcName) {
  const byKey = {};
  profile.forEach(c => {
    if (c.key === "tecnico" || !QBANK[c.key]) return;
    const e = byKey[c.key] || (byKey[c.key] = { key: c.key, w: 0, crit: false });
    e.w += +c.w || 0; e.crit = e.crit || !!c.crit;
  });
  const keys = Object.values(byKey).sort((a, b) => (b.crit - a.crit) || (b.w - a.w)).slice(0, RULES2.specificComps).map(e => e.key);
  // perfil com poucas competências: completa até 5 com competências gerais de trabalho
  ["feedback", "equipe", "organizacao", "comunicacao", "curiosidade"].forEach(k => { if (keys.length < 4 && !keys.includes(k)) keys.push(k); });
  return keys.map(k => ({ q: QBANK[k], key: k })).concat([{ q: techQuestion(funcName || "a função"), key: "tecnico" }]);
}

const compName = c => c.name || (COMPS[c.key] ? COMPS[c.key].label : c.key);

/* Biblioteca efetiva: a base com as edições do gestor + departamentos novos */
function slugify(s) {
  return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function deptFromDoc(d) {
  return { dept: d.dept, funcs: (d.funcs || []).map(f => ({ name: f.name, comps: (f.comps || []).filter(c => COMPS[c.key]).map(c => ({ key: c.key, w: +c.w, crit: !!c.crit, name: compName(c) })) })) };
}
function buildLibrary(docs) {
  docs = docs || {};
  const base = LIBRARY.map(d => {
    const id = "b-" + slugify(d.dept);
    return docs[id] ? { ...deptFromDoc(docs[id]), id, base: true, edited: true } : { ...d, id, base: true };
  });
  const custom = Object.keys(docs).filter(id => id.indexOf("c-") === 0)
    .sort((a, b) => (docs[a].criadoEm || 0) - (docs[b].criadoEm || 0))
    .map(id => ({ ...deptFromDoc(docs[id]), id, custom: true }));
  return base.concat(custom);
}
function findFunc(lib, deptId, funcName) {
  const d = lib.find(x => x.id === deptId);
  const f = d && d.funcs.find(x => x.name === funcName);
  return f ? { dept: d, func: f } : null;
}

/* Validação de um perfil de função e de um departamento */
function validateProfile(comps, label) {
  const e = [];
  if (comps.length < 3) e.push(label + ": use pelo menos 3 competências.");
  if (comps.some(c => !(+c.w > 0))) e.push(label + ": todo peso precisa ser maior que zero.");
  const sum = comps.reduce((a, c) => a + (+c.w || 0), 0);
  if (sum !== 100) e.push(label + ": os pesos somam " + sum + "%, e precisam somar 100%.");
  if (!comps.some(c => c.crit)) e.push(label + ": marque pelo menos uma competência como crítica.");
  if (!comps.some(c => c.key !== "tecnico")) e.push(label + ": inclua competências de comportamento, não só conhecimento técnico.");
  return e;
}
function validateDept(d, lib) {
  const e = [];
  const nome = (d.dept || "").trim();
  if (nome.length < 2) e.push("Dê um nome ao departamento.");
  if (lib && lib.some(x => x.id !== d.id && x.dept.toLowerCase() === nome.toLowerCase())) e.push("Já existe um departamento com esse nome.");
  if (d.funcs.length < 3) e.push("O departamento precisa de pelo menos 3 funções.");
  const names = new Set();
  d.funcs.forEach((f, i) => {
    const n = (f.name || "").trim();
    if (!n) e.push("A função " + (i + 1) + " está sem nome.");
    else if (names.has(n.toLowerCase())) e.push("Há duas funções chamadas " + n + ".");
    names.add(n.toLowerCase());
    e.push(...validateProfile(f.comps, n || "Função " + (i + 1)));
  });
  return e;
}

/* Compatibilidade de uma pessoa com uma vaga */
function scoreVaga(vaga, answers, generalNotes, cand, extra) {
  const traits = scoreTraits(answers || []);
  const comps = scoreCompetenciesFromMap(traits, interviewMap(generalNotes, vaga.perguntas, cand && cand.notas), scoreExtra(extra));
  const fit = scoreFunction({ name: vaga.titulo, comps: (vaga.perfil || []).map(c => ({ ...c, w: +c.w, name: compName(c) })) }, comps);
  const pre = (vaga.prereqs || []).map((t, i) => cand && Array.isArray(cand.prereq) && cand.prereq[i] != null ? cand.prereq[i] : null);
  const des = (vaga.desejaveis || []).map((t, i) => !!(cand && Array.isArray(cand.desej) && cand.desej[i]));
  const bonus = Math.min(RULES2.desejavelMax, des.filter(Boolean).length * RULES2.desejavelBonus);
  const base = fit.pct;
  const final = base == null ? null : Math.round(clamp(base + bonus, 0, 100));
  const specificDone = !!(cand && Array.isArray(cand.notas) && cand.notas.some(n => n >= 1 && n <= 5));
  return {
    base, bonus, final, fit, comps, pre, des, specificDone,
    eliminado: pre.some(v => v === false),
    pendentes: pre.filter(v => v == null).length,
    gaps: fit.gaps || []
  };
}

/* Sugestão de reorganização de uma empresa.
   emps: [{ key, nome, answers, notas, atual: {deptId, func} | null, cands: {vagaId: candidatura} }] */
function reorganize(emps, vagas, lib) {
  const rows = emps.map(e => {
    const analysis = analyze(e.answers, e.notas, lib, e.extra);
    const ff = e.atual ? findFunc(lib, e.atual.deptId, e.atual.func) : null;
    const cur = ff ? scoreFunction(ff.func, analysis.comps).pct : null;
    const vs = vagas.map(v => ({ vaga: v, s: scoreVaga(v, e.answers, e.notas, e.cands && e.cands[v.id], e.extra) }));
    return { e, analysis, atual: ff, atualInvalida: !!e.atual && !ff, cur, vs, move: null };
  });
  const pairs = [];
  rows.forEach((r, ri) => r.vs.forEach((x, vi) => {
    if (x.s.eliminado || x.s.final == null || x.s.final < RULES2.moveMin) return;
    if (r.cur != null && x.s.final < r.cur + RULES2.moveGain) return;
    pairs.push({ ri, vi, gain: x.s.final - (r.cur == null ? RULES2.moveMin : r.cur), score: x.s.final });
  }));
  pairs.sort((a, b) => b.gain - a.gain || b.score - a.score);
  const usedR = new Set(), usedV = new Set();
  pairs.forEach(p => {
    if (usedR.has(p.ri) || usedV.has(p.vi)) return;
    usedR.add(p.ri); usedV.add(p.vi);
    const x = rows[p.ri].vs[p.vi];
    rows[p.ri].move = { vaga: x.vaga, score: p.score, gain: rows[p.ri].cur == null ? null : p.score - rows[p.ri].cur, pendentes: x.s.pendentes };
  });
  rows.forEach(r => {
    r.status = r.move ? "realocar" : r.cur == null ? "sem-funcao" : r.cur < RULES2.lowFit ? "atencao" : "manter";
  });
  const vagasRows = vagas.map(v => {
    const r = rows.find(x => x.move && x.move.vaga === v);
    const best = rows.map(x => ({ r: x, s: x.vs.find(y => y.vaga === v).s })).filter(x => !x.s.eliminado && x.s.final != null)
      .sort((a, b) => b.s.final - a.s.final)[0] || null;
    return { vaga: v, interno: r || null, melhor: best };
  });
  return { rows, vagasRows };
}

/* ================= Fase 2: guia de gestão por pessoa (para o gestor da área) ================= */
/* Por traço e faixa (0 = baixo, 2 = alto). Faixa média não gera orientação específica. */
const GUIDE = {
  H: {
    2: { comunicar: "Seja transparente e explique o porquê das decisões; jogos de bastidor afastam essa pessoa.",
         motivar: "Reconhecimento justo e discreto motiva mais que status ou prêmios chamativos.",
         cobrar: "Regras claras e iguais para todos funcionam bem.",
         atencao: "Pode se incomodar com metas que incentivem atalhos ou com negociações agressivas." },
    0: { comunicar: "Seja objetivo sobre ganhos e resultados; argumentos de vantagem funcionam.",
         motivar: "Metas com recompensa visível, reconhecimento público e status motivam.",
         cobrar: "Deixe limites éticos explícitos e acompanhe processos sensíveis, como descontos, dinheiro e dados.",
         atencao: "Evite autonomia total em tarefas com risco de conflito de interesse sem algum controle." }
  },
  E: {
    2: { comunicar: "Antecipe mudanças e explique o impacto para a pessoa; surpresas geram ansiedade.",
         motivar: "Segurança, pertencimento e apoio do líder motivam.",
         feedback: "Dê o feedback em particular, comece pelo que está bom e termine com um plano concreto.",
         atencao: "Sob pressão contínua tende ao estresse. Observe sinais de preocupação excessiva e redistribua a carga." },
    0: { comunicar: "Pode ser direto; lida bem com notícias difíceis.",
         motivar: "Desafios, riscos calculados e situações de pressão motivam.",
         feedback: "Feedback direto funciona. Ajude a pessoa a perceber o efeito emocional que causa nos outros.",
         atencao: "Pode subestimar riscos e a sensibilidade da equipe; em decisões grandes, peça a análise de riscos por escrito." }
  },
  X: {
    2: { comunicar: "Prefere conversas ao vivo, rápidas e frequentes.",
         motivar: "Visibilidade, contato com pessoas e papéis de representação motivam.",
         cobrar: "Combine prazos e registros por escrito; o entusiasmo pode passar à frente do acompanhamento.",
         atencao: "Tarefas longas e isoladas, sem interação, drenam a energia." },
    0: { comunicar: "Prefere mensagens escritas e reuniões com pauta; avise antes de pedir que fale em público.",
         motivar: "Tempo de foco, autonomia e reconhecimento individual, sem palco, motivam.",
         cobrar: "Peça a opinião antes das reuniões; a pessoa contribui mais quando tem tempo para pensar.",
         atencao: "Excesso de reuniões, atendimento e exposição gera desgaste." }
  },
  A: {
    2: { comunicar: "Use um tom cordial e colaborativo.",
         motivar: "Bom clima, equipe unida e a chance de ajudar os outros motivam.",
         feedback: "Aceita bem críticas. Incentive a pessoa a discordar quando for preciso.",
         cobrar: "Pode ceder demais em negociações e evitar cobrar colegas; dê respaldo e critérios objetivos.",
         atencao: "Tende a assumir tarefas dos outros para evitar conflito." },
    0: { comunicar: "Vá direto ao ponto, com dados; a pessoa questiona e debate.",
         motivar: "Padrões altos e espaço para defender ideias motivam.",
         feedback: "Use fatos e exemplos concretos; crítica vaga vira discussão.",
         cobrar: "Combine regras de convivência e de como discordar; acompanhe o clima com colegas e clientes.",
         atencao: "Em atendimento ou em conflitos pode reagir com irritação; não exponha a pessoa sem preparo." }
  },
  C: {
    2: { comunicar: "Seja preciso: prazos, critérios e prioridades claros.",
         motivar: "Metas claras, processos organizados e reconhecimento pela qualidade motivam.",
         cobrar: "Delegue com autonomia e prazo; a pessoa cumpre. Cobre o resultado, não cada detalhe.",
         atencao: "Mudanças de última hora frustram, e o perfeccionismo pode atrasar entregas." },
    0: { comunicar: "Confirme os combinados por escrito, em etapas curtas.",
         motivar: "Variedade, flexibilidade e desafios novos motivam.",
         cobrar: "Divida as entregas em marcos curtos, com checagens frequentes e listas de verificação.",
         atencao: "Em tarefas de rotina e de detalhe, há mais risco de erro e atraso." }
  },
  O: {
    2: { comunicar: "Explique o contexto e o porquê; a pessoa gosta de discutir ideias e alternativas.",
         motivar: "Aprendizado, projetos novos e liberdade para propor melhorias motivam.",
         cobrar: "Peça que cada ideia vire um plano com prazo; a pessoa pode se dispersar em muitas frentes.",
         atencao: "Rotina sem novidade desmotiva." },
    0: { comunicar: "Seja concreto e prático, com exemplos e passo a passo.",
         motivar: "Estabilidade, métodos testados e domínio do próprio trabalho motivam.",
         cobrar: "Ao mudar algo, explique a utilidade prática e dê tempo de adaptação.",
         atencao: "Mudanças frequentes de processo e tarefas abstratas geram resistência." }
  }
};
/* Uma ação de desenvolvimento por competência */
const DEV = {
  resiliencia: "Combine metas curtas e celebre avanços; depois de um revés, faça uma conversa rápida sobre o que aprender.",
  estabilidade: "Antecipe períodos de pico e ensine uma rotina de pausa e priorização para dias de pressão.",
  disciplina: "Use rotina fixa com checklist diário e acompanhamento semanal curto.",
  organizacao: "Ensine a planejar a semana com prioridades e revise o plano junto nas primeiras semanas.",
  detalhes: "Crie uma lista de conferência para as entregas críticas e uma revisão por outra pessoa.",
  pontualidade: "Combine prazos com folga, lembretes e uma checagem no meio do caminho.",
  integridade: "Deixe regras e limites por escrito e faça conferências periódicas em processos sensíveis.",
  comunicacao: "Dê oportunidades curtas de apresentar resultados para o time, com preparo antes.",
  escrita: "Peça resumos curtos por escrito e devolva com exemplos de como ficaria mais claro.",
  extroversao: "Comece com contatos em dupla e com roteiro, antes de exposição maior.",
  persuasao: "Treine negociações em simulação, com roteiro de objeções comuns.",
  relacionamento: "Coloque a pessoa em projetos com outras áreas, com um padrinho para apresentá-la.",
  cordialidade: "Treine atendimento a pessoas difíceis com roteiros e simulações.",
  empatia: "Peça que resuma o ponto de vista do outro antes de responder, em reuniões e atendimentos.",
  conflitos: "Ensine um passo a passo de conversa difícil e acompanhe a primeira vez.",
  lideranca: "Dê a liderança de um projeto pequeno, com mentoria de um líder experiente.",
  desenvolvimento: "Peça que treine um colega novo numa tarefa que domina.",
  autoconfianca: "Dê tarefas com chance alta de acerto e aumente o desafio aos poucos; reconheça cada conquista.",
  autonomia: "Delegue um problema inteiro, não só a tarefa, e combine pontos de checagem.",
  criatividade: "Inclua a pessoa em sessões de ideias com uma regra simples: trazer duas propostas.",
  curiosidade: "Combine um curso curto ou uma leitura por mês ligada ao trabalho e uma conversa sobre o que aprendeu.",
  estrategia: "Leve a pessoa às reuniões de planejamento e peça uma proposta de melhoria para a área.",
  analitica: "Peça decisões baseadas em números simples, como uma planilha de antes e depois.",
  problemas: "Ensine a investigar a causa de um problema recorrente com perguntas do tipo 'por quê?'.",
  resultado: "Combine metas claras e visíveis, com acompanhamento semanal.",
  crise: "Faça simulações de imprevistos e combine quem decide o quê numa emergência.",
  feedback: "Crie conversas de feedback curtas e frequentes, com um ponto de melhoria por vez.",
  equipe: "Coloque metas compartilhadas com o time e reconheça as entregas coletivas."
};
const GUIDE_SECTIONS = [
  ["comunicar", "Como se comunicar", "Comunicação clara e objetiva, ajustada ao assunto, funciona bem."],
  ["motivar", "O que motiva", "O perfil não aponta um motivador dominante. Pergunte à pessoa o que ela valoriza."],
  ["feedback", "Como dar feedback", "Feedback frequente, específico e com exemplos funciona bem."],
  ["cobrar", "Como delegar e acompanhar", "Combine o prazo e o resultado esperado e faça uma checagem no meio do caminho."],
  ["atencao", "Pontos de atenção", "Nenhum ponto de atenção forte no perfil."]
];
function buildGuide(result) {
  const sec = {};
  GUIDE_SECTIONS.forEach(([k]) => { sec[k] = []; });
  TRAITS.forEach(t => {
    const v = result.traits[t]; if (v == null) return;
    const g = GUIDE[t][traitBand(v)]; if (!g) return;
    GUIDE_SECTIONS.forEach(([k]) => { if (g[k]) sec[k].push(g[k]); });
  });
  const sections = GUIDE_SECTIONS.map(([k, title, fallback]) => ({ key: k, title, items: sec[k].length ? sec[k] : [fallback] }));
  const fortes = result.compList.slice(0, 3).map(c => c.label);
  const dev = result.compList.slice(-3).reverse().map(c => ({ label: c.label, value: c.value, acao: DEV[c.key] || "" }));
  return { sections, fortes, dev };
}

/* ================= Fase 3: inteligência ================= */
const RULES3 = {
  riskHigh: 55, riskMed: 30,          // risco de saída: alto a partir de 55, médio a partir de 30
  potHigh: 3.8, potMid: 3.0,          // potencial (1 a 5)
  readyNow: 75, readySoon: 60,        // sucessão: pronto agora / em 1 a 2 anos
  fastSec: 240,                       // 60 afirmações em menos de 4 minutos = rápido demais
  reavalMeses: 12                     // reavaliação padrão
};
const POT_COMPS = ["curiosidade", "autonomia", "problemas", "resiliencia", "feedback", "estrategia", "lideranca"];
function potencialOf(result) {
  const v = POT_COMPS.map(k => result.comps[k] && result.comps[k].value).filter(x => x != null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}

/* Sinais extras de respostas pouco confiáveis */
function extraAlerts(result, duracaoSeg) {
  const out = [];
  const t = result.traits;
  const fav = (t.H >= 4.3) + (t.E <= 1.7) + (t.X >= 4.3) + (t.A >= 4.3) + (t.C >= 4.3) + (t.O >= 4.3);
  if (fav >= 5) out.push({ code: "desejavel", text: "Perfil favorável demais em " + fav + " dos 6 traços. Pode ser tentativa de parecer o candidato ideal. Peça exemplos concretos na entrevista." });
  const div = result.compList.filter(c => c.traits != null && c.interview != null && Math.abs(c.traits - c.interview) >= 2);
  if (div.length >= 3) out.push({ code: "divergencia", text: "Teste e entrevista divergem muito em " + div.length + " competências (" + div.slice(0, 4).map(c => c.label.toLowerCase()).join(", ") + "). Vale aprofundar." });
  if (duracaoSeg != null && duracaoSeg > 0 && duracaoSeg < RULES3.fastSec) out.push({ code: "rapido", text: "Respondeu as 60 afirmações em " + Math.max(1, Math.round(duracaoSeg / 60)) + " min. É rápido demais para ler com atenção." });
  return out;
}

/* Risco de saída: fatores explicáveis, com uma ação de retenção para cada um */
function riskOfLeaving(o) {
  const f = [], s = o.sinais || {};
  const num = v => v === "" || v == null || isNaN(+v) ? null : +v;
  if (o.cur != null) {
    if (o.cur < 50) f.push({ pts: 30, text: "Baixa aderência à função atual (" + o.cur + "%).", acao: "Conversar sobre realocação para uma função mais compatível." });
    else if (o.cur < 60) f.push({ pts: 15, text: "Aderência mediana à função atual (" + o.cur + "%).", acao: "Ajustar atribuições para usar mais os pontos fortes." });
  }
  if (o.cur != null && o.bestPct != null && o.bestPct >= o.cur + 20) f.push({ pts: 10, text: "O perfil rende mais em " + o.bestDept + " (" + o.bestPct + "%).", acao: "Avaliar projetos ou movimentação para essa área." });
  const sat = num(s.satisfacao);
  if (sat != null && sat <= 2) f.push({ pts: 25, text: "Satisfação baixa (" + sat + " de 5).", acao: "Conversa individual para entender as causas, em até duas semanas." });
  else if (sat === 3) f.push({ pts: 10, text: "Satisfação mediana (3 de 5).", acao: "Perguntar o que melhoraria o dia a dia e combinar uma mudança concreta." });
  if (s.sinalSaida) f.push({ pts: 25, text: "Demonstrou intenção de sair ou recebeu proposta.", acao: "Conversa de retenção em até uma semana." });
  const casa = num(s.mesesCasa);
  if (casa != null && casa < 12) f.push({ pts: 10, text: "Menos de 1 ano de casa, a fase de maior rotatividade.", acao: "Conversas mensais de integração com o gestor." });
  const prom = num(s.mesesPromocao);
  if (prom != null && prom >= 24) f.push({ pts: 10, text: "Sem promoção ou aumento há 2 anos ou mais.", acao: "Rever plano de carreira e remuneração." });
  const score = Math.min(100, f.reduce((a, x) => a + x.pts, 0));
  const level = score >= RULES3.riskHigh ? "alto" : score >= RULES3.riskMed ? "medio" : "baixo";
  const temSinais = sat != null || !!s.sinalSaida || casa != null || prom != null;
  const desemp = num(s.desempenho);
  return { score, level, factors: f, temSinais, prioridade: level !== "baixo" && desemp != null && desemp >= 4 };
}

/* Mapa de talentos (9 caixas): desempenho informado pelo gestor × potencial calculado */
const NINEBOX = [
  [{ nome: "Atenção", acao: "Plano de melhoria com metas claras e prazo; avaliar se a função é a certa." },
   { nome: "Eficaz", acao: "Manter na função e reconhecer a entrega; desenvolvimento pontual." },
   { nome: "Especialista confiável", acao: "Valorizar como referência técnica; carreira de especialista." }],
  [{ nome: "Em desenvolvimento", acao: "Entender o que trava a entrega: função, gestão ou contexto." },
   { nome: "Profissional sólido", acao: "Desafios graduais e um plano de desenvolvimento." },
   { nome: "Forte desempenho", acao: "Ampliar responsabilidades e preparar para o próximo passo." }],
  [{ nome: "Enigma", acao: "Potencial alto com entrega baixa: rever função, gestor ou motivação." },
   { nome: "Alto potencial", acao: "Projetos desafiadores e mentoria; acelerar o desenvolvimento." },
   { nome: "Estrela", acao: "Reter e preparar para sucessão; reconhecimento e carreira claros." }]
];
function nineBox(desempenho, pot) {
  if (desempenho == null || desempenho === "" || pot == null) return null;
  const d = +desempenho;
  const perf = d <= 2 ? 0 : d === 3 ? 1 : 2;
  const pl = pot >= RULES3.potHigh ? 2 : pot >= RULES3.potMid ? 1 : 0;
  return { pot: pl, perf, ...NINEBOX[pl][perf] };
}

if (typeof module !== "undefined") {
  module.exports = { TRAITS, TRAIT_NAMES, ITEMS, ITEM_ORDER, COHERENCE_PAIRS, COMPS, ALIAS, LIBRARY, INTERVIEW, RULES, RULES2, QBANK,
    scoreTraits, scoreCompetencies, scoreCompetenciesFromMap, interviewMap, scoreFunction, scoreDepartments, answerAlerts, analyze, buildFeedback,
    RIASEC, RIASEC_NAMES, RIASEC_TEXT, ESCALAS, EXTRA_ITEMS, EXTRA_N, EXTRA_INTRO, DEPT_RIASEC, scoreExtra, standardize, leadershipIndex,
    generateQuestions, buildLibrary, findFunc, buildGuide, GUIDE, DEV, CAREERS, CURSO_COMP, RULES3, potencialOf, extraAlerts, riskOfLeaving, nineBox, validateProfile, validateDept, scoreVaga, reorganize, slugify };
}

