# Sistema de Análise de Perfil e Alocação de Talentos

## 1. Visão geral

Objetivo: colocar a pessoa certa, com o perfil certo, na vaga certa, para contratação e para realocação de funcionários. Público: gestores de RH que prestam serviço a várias empresas. Sistema multi-gestor, com dados isolados por gestor.

Perfis de acesso: administrador (vê tudo, alertas, aprova departamentos), financeiro (só financeiro), gestor do sistema (operacional, sem dados de pessoas), gestor geral (todas as suas empresas e devolutivas), subgestor (tudo de uma empresa), funcionário e pessoa avulsa (só a própria devolutiva). O relatório técnico do gestor nunca aparece para a pessoa avaliada.

Metodologia: entrevista estruturada (ao vivo ou automática, escrita ou vídeo, avaliando só o conteúdo), teste de personalidade validado (HEXACO ou Big Five) e amostra de trabalho.

## 2. Regras de cálculo

- Cada competência recebe nota de 1 a 5, para a pessoa e para o perfil ideal da função.
- Compatibilidade da função = 100% menos a distância ponderada pelos pesos.
- Competência crítica com nota abaixo de 3 gera penalidade extra.
- Recomendação (3 melhores) e alerta (3 piores): desde a versão 0.3, pela nota da área (50% perfil padronizado + 50% interesses). Ver "Versão 0.3" no fim deste documento. Antes: maior nota entre as funções para recomendar e média das funções para alertar.
- O motivo do desencaixe continua: competências críticas mais fracas (estresse, desgaste, risco de erro) e, quando houver, pouco interesse no tipo de atividade da área.

## 3. Biblioteca de departamentos

Formato: competência, peso, (C) = crítica. Cada função traz uma pergunta de entrevista de exemplo.

### 3.1 Vendas

- **SDR:** resiliência 25% (C), disciplina 20% (C), comunicação 20%, extroversão 15%, curiosidade 10%, organização 10%. Pergunta: "Conte uma semana em que ouviu muitos nãos seguidos. O que fez?"
- **Closer:** persuasão e negociação 25% (C), escuta e empatia 20% (C), autoconfiança 15%, resiliência 15%, foco em resultado 15%, conhecimento do produto 10%. Pergunta: "Conte uma venda perdida que você reverteu."
- **Gerente de vendas:** liderança 25% (C), desenvolvimento de pessoas 20% (C), visão analítica 20%, estabilidade emocional 15%, planejamento 10%, comunicação 10%. Pergunta: "Conte quando alguém da equipe estava abaixo da meta. O que fez?"

### 3.2 Marketing

- **Analista de conteúdo:** criatividade 25% (C), comunicação escrita 25% (C), curiosidade 15%, organização 15%, abertura a feedback 10%, visão de público 10%. Pergunta: "Conte um conteúdo seu que deu muito resultado e por quê."
- **Analista de performance:** visão analítica 30% (C), atenção a detalhes 20% (C), raciocínio lógico 20%, curiosidade 10%, foco em resultado 10%, organização 10%. Pergunta: "Conte uma campanha que você otimizou com base em dados."
- **Gerente de marketing:** visão estratégica 25% (C), liderança 20% (C), visão analítica 15%, criatividade 15%, comunicação 15%, planejamento 10%. Pergunta: "Conte uma estratégia que você definiu e como mediu o resultado."

### 3.3 Financeiro

- **Assistente financeiro:** atenção a detalhes 30% (C), organização 25% (C), disciplina 20%, integridade 15%, raciocínio numérico 10%. Pergunta: "Conte um erro que você encontrou num lançamento e o que fez."
- **Analista financeiro:** raciocínio numérico 30% (C), visão analítica 25% (C), atenção a detalhes 15%, integridade 15%, comunicação 15%. Pergunta: "Conte uma análise sua que mudou uma decisão."
- **Controller / gerente financeiro:** visão estratégica 25% (C), integridade 20% (C), visão analítica 20%, liderança 15%, estabilidade emocional 10%, comunicação 10%. Pergunta: "Conte uma situação de caixa apertado e como você conduziu."

### 3.4 Recursos Humanos

- **Assistente de RH / DP:** organização 25% (C), atenção a detalhes 25% (C), discrição 20%, cordialidade 15%, disciplina 15%. Pergunta: "Conte quando lidou com uma informação confidencial."
- **Analista de recrutamento e desenvolvimento:** escuta e empatia 25% (C), julgamento de pessoas 25% (C), comunicação 20%, organização 15%, discrição 15%. Pergunta: "Conte uma contratação difícil que você acertou."
- **Gerente de RH:** liderança 20% (C), mediação de conflitos 20% (C), visão estratégica 20%, integridade 15%, estabilidade emocional 15%, comunicação 10%. Pergunta: "Conte um conflito sério entre pessoas que você resolveu."

### 3.5 Operações

- **Operador / auxiliar:** disciplina 25% (C), atenção a segurança e detalhes 25% (C), resistência física e de rotina 20%, trabalho em equipe 15%, pontualidade 15%. Pergunta: "Conte quando seguiu um procedimento mesmo sob pressão para ir mais rápido."
- **Supervisor de operações:** organização 25% (C), liderança de equipe 25% (C), resolução de problemas 20%, estabilidade emocional 15%, comunicação 15%. Pergunta: "Conte uma parada inesperada e como você reorganizou a equipe."
- **Gerente de operações:** planejamento 25% (C), visão analítica 20% (C), liderança 20%, melhoria contínua 20%, estabilidade emocional 15%. Pergunta: "Conte um processo que você melhorou e o ganho obtido."

### 3.6 Tecnologia

- **Suporte técnico / helpdesk:** paciência 25% (C), resolução de problemas 25% (C), comunicação 20%, organização 15%, aprendizado contínuo 15%. Pergunta: "Conte quando ajudou um usuário muito irritado a resolver um problema."
- **Desenvolvedor / analista:** raciocínio lógico 30% (C), atenção a detalhes 20% (C), aprendizado contínuo 20%, foco e concentração 15%, trabalho em equipe 15%. Pergunta: "Conte um problema técnico difícil que você resolveu e como chegou à solução."
- **Gerente de tecnologia:** visão estratégica 25% (C), liderança 20% (C), raciocínio lógico 20%, gestão de prioridades 20%, comunicação 15%. Pergunta: "Conte quando precisou escolher entre duas demandas urgentes."

### 3.7 Atendimento ao cliente

- **Atendente:** paciência 25% (C), cordialidade 25% (C), comunicação 20%, estabilidade emocional 15%, organização 15%. Pergunta: "Conte um atendimento difícil que terminou bem."
- **Analista de sucesso do cliente:** escuta e empatia 25% (C), resolução de problemas 20% (C), proatividade 20%, comunicação 20%, visão analítica 15%. Pergunta: "Conte quando evitou que um cliente cancelasse."
- **Supervisor de atendimento:** liderança 25% (C), estabilidade emocional 25% (C), visão analítica 20%, desenvolvimento de pessoas 15%, mediação de conflitos 15%. Pergunta: "Conte como lidou com um pico de reclamações."

### 3.8 Jurídico

- **Assistente jurídico:** atenção a detalhes 30% (C), organização 25% (C), discrição 20%, disciplina 15%, comunicação escrita 10%. Pergunta: "Conte como controlava prazos importantes."
- **Advogado / analista jurídico:** raciocínio analítico 25% (C), comunicação escrita 25% (C), integridade 20%, argumentação 15%, estabilidade emocional 15%. Pergunta: "Conte um caso em que sua análise evitou um risco para a empresa."
- **Gerente jurídico:** visão estratégica 25% (C), integridade 25% (C), liderança 20%, negociação 15%, comunicação 15%. Pergunta: "Conte uma negociação jurídica delicada que você conduziu."

### 3.9 Compras e suprimentos

- **Assistente de compras:** organização 25% (C), atenção a detalhes 25% (C), comunicação 20%, disciplina 15%, integridade 15%. Pergunta: "Conte quando encontrou uma divergência num pedido."
- **Comprador:** negociação 30% (C), integridade 20% (C), visão analítica 20%, comunicação 15%, organização 15%. Pergunta: "Conte a melhor negociação que você fez com um fornecedor."
- **Gerente de suprimentos:** planejamento 25% (C), visão estratégica 20% (C), negociação 20%, liderança 20%, visão analítica 15%. Pergunta: "Conte como lidou com a falta de um insumo crítico."

### 3.10 Logística

- **Auxiliar de logística:** disciplina 25% (C), atenção a detalhes 25% (C), resistência física e de rotina 20%, pontualidade 15%, trabalho em equipe 15%. Pergunta: "Conte quando evitou um erro de expedição."
- **Analista de logística:** planejamento 25% (C), visão analítica 25% (C), resolução de problemas 20%, organização 15%, comunicação 15%. Pergunta: "Conte uma rota ou processo que você otimizou."
- **Gerente de logística:** liderança 25% (C), planejamento 25% (C), estabilidade emocional 20%, negociação 15%, visão estratégica 15%. Pergunta: "Conte uma crise de entrega e como você resolveu."

### 3.11 Produção / Indústria

- **Operador de produção:** disciplina 25% (C), atenção a segurança 25% (C), resistência de rotina 20%, trabalho em equipe 15%, pontualidade 15%. Pergunta: "Conte quando percebeu um risco de segurança e o que fez."
- **Líder de produção:** liderança de equipe 25% (C), organização 25% (C), resolução de problemas 20%, estabilidade emocional 15%, comunicação 15%. Pergunta: "Conte como bateu uma meta de produção com a equipe desfalcada."
- **Gerente industrial:** planejamento 25% (C), melhoria contínua 20% (C), visão analítica 20%, liderança 20%, visão estratégica 15%. Pergunta: "Conte como reduziu desperdício ou custo na produção."

### 3.12 Qualidade

- **Inspetor de qualidade:** atenção a detalhes 30% (C), disciplina 25% (C), integridade 20%, organização 15%, comunicação 10%. Pergunta: "Conte quando reprovou um lote mesmo sob pressão."
- **Analista de qualidade:** visão analítica 25% (C), resolução de problemas 25% (C), atenção a detalhes 20%, comunicação 15%, melhoria contínua 15%. Pergunta: "Conte uma não conformidade que você investigou até a causa."
- **Gerente de qualidade:** integridade 25% (C), visão estratégica 20% (C), liderança 20%, melhoria contínua 20%, comunicação 15%. Pergunta: "Conte como implantou ou manteve uma certificação."

### 3.13 Administrativo

- **Recepcionista / auxiliar administrativo:** cordialidade 25% (C), organização 25% (C), comunicação 20%, discrição 15%, pontualidade 15%. Pergunta: "Conte como organizava várias demandas ao mesmo tempo."
- **Assistente administrativo:** organização 30% (C), atenção a detalhes 20% (C), proatividade 20%, comunicação 15%, disciplina 15%. Pergunta: "Conte um processo administrativo que você simplificou."
- **Gerente administrativo:** planejamento 25% (C), liderança 20% (C), visão analítica 20%, integridade 20%, comunicação 15%. Pergunta: "Conte como cortou custos sem prejudicar a operação."

### 3.14 Contabilidade

- **Auxiliar contábil:** atenção a detalhes 30% (C), organização 25% (C), disciplina 20%, integridade 15%, raciocínio numérico 10%. Pergunta: "Conte como garantia que os lançamentos estavam corretos."
- **Analista contábil / fiscal:** raciocínio numérico 25% (C), atenção a detalhes 25% (C), integridade 20%, aprendizado contínuo 15%, visão analítica 15%. Pergunta: "Conte como se manteve atualizado com uma mudança na legislação."
- **Contador / gerente contábil:** integridade 25% (C), visão analítica 25% (C), liderança 20%, comunicação 15%, planejamento 15%. Pergunta: "Conte um fechamento difícil que você conduziu."

### 3.15 Comunicação e relações públicas

- **Assistente de comunicação:** comunicação escrita 25% (C), criatividade 20% (C), organização 20%, curiosidade 20%, abertura a feedback 15%. Pergunta: "Conte um texto seu que gerou boa repercussão."
- **Analista de comunicação:** comunicação 25% (C), criatividade 20% (C), relacionamento 20%, visão de público 20%, organização 15%. Pergunta: "Conte uma campanha interna ou externa que você conduziu."
- **Gerente de comunicação / RP:** gestão de crise 25% (C), visão estratégica 20% (C), relacionamento 20%, liderança 20%, estabilidade emocional 15%. Pergunta: "Conte como lidou com uma crise de imagem."

### 3.16 Pesquisa e desenvolvimento / Produto

- **Assistente de pesquisa:** curiosidade 25% (C), atenção a detalhes 25% (C), organização 20%, aprendizado contínuo 15%, disciplina 15%. Pergunta: "Conte uma pesquisa que você conduziu do começo ao fim."
- **Analista de produto / P&D:** criatividade 25% (C), raciocínio analítico 25% (C), visão de usuário 20%, comunicação 15%, abertura a feedback 15%. Pergunta: "Conte uma melhoria de produto que nasceu de uma ideia sua."
- **Gerente de produto / P&D:** visão estratégica 25% (C), liderança 20% (C), gestão de prioridades 20%, criatividade 20%, comunicação 15%. Pergunta: "Conte como decidiu o que não seria feito no produto."

### 3.17 Projetos / PMO

- **Assistente de projetos:** organização 30% (C), disciplina 20% (C), comunicação 20%, atenção a detalhes 15%, proatividade 15%. Pergunta: "Conte como acompanhava prazos de várias pessoas."
- **Analista / coordenador de projetos:** planejamento 25% (C), comunicação 25% (C), gestão de riscos 20%, resolução de problemas 15%, mediação de conflitos 15%. Pergunta: "Conte um projeto que ia atrasar e como você recuperou."
- **Gerente de projetos / PMO:** liderança 25% (C), visão estratégica 20% (C), gestão de prioridades 20%, estabilidade emocional 20%, negociação 15%. Pergunta: "Conte como negociou escopo com um cliente ou diretor."

### 3.18 Manutenção e facilities

- **Auxiliar de manutenção / serviços gerais:** disciplina 25% (C), atenção a segurança 25% (C), habilidade manual 20%, pontualidade 15%, cordialidade 15%. Pergunta: "Conte um reparo que você resolveu sozinho."
- **Técnico de manutenção:** resolução de problemas 30% (C), conhecimento técnico 25% (C), atenção a segurança 20%, organização 15%, aprendizado contínuo 10%. Pergunta: "Conte uma falha difícil de diagnosticar e como você achou a causa."
- **Gerente de manutenção / facilities:** planejamento 25% (C), liderança 25% (C), gestão de custos 20%, estabilidade emocional 15%, negociação 15%. Pergunta: "Conte como montou um plano de manutenção preventiva."

### 3.19 Segurança do trabalho e meio ambiente

- **Técnico de segurança do trabalho:** atenção a segurança 30% (C), firmeza 20% (C), comunicação 20%, disciplina 15%, integridade 15%. Pergunta: "Conte quando parou uma atividade por risco, mesmo com pressão para seguir."
- **Analista de meio ambiente / SSMA:** visão analítica 25% (C), integridade 25% (C), organização 20%, comunicação 15%, aprendizado contínuo 15%. Pergunta: "Conte um programa ambiental ou de segurança que você implantou."
- **Gerente de SSMA:** liderança 25% (C), integridade 25% (C), visão estratégica 20%, comunicação 15%, estabilidade emocional 15%. Pergunta: "Conte como mudou a cultura de segurança de uma equipe."

### 3.20 Diretoria e gestão estratégica

- **Assistente executivo / secretariado:** organização 25% (C), discrição 25% (C), proatividade 20%, comunicação 15%, cordialidade 15%. Pergunta: "Conte como antecipou uma necessidade do seu executivo."
- **Analista de planejamento estratégico:** visão analítica 30% (C), visão estratégica 25% (C), comunicação 15%, curiosidade 15%, raciocínio numérico 15%. Pergunta: "Conte uma análise de mercado que orientou uma decisão."
- **Diretor / gestor geral:** visão estratégica 25% (C), liderança 25% (C), tomada de decisão 20%, estabilidade emocional 15%, integridade 15%. Pergunta: "Conte a decisão mais difícil que você tomou e o resultado."

### 3.21 Comercial externo e representação

- **Vendedor externo:** resiliência 25% (C), relacionamento 25% (C), autonomia 20%, organização 15%, persuasão 15%. Pergunta: "Conte como conquistou um cliente difícil em visita."
- **Representante comercial:** autonomia 25% (C), negociação 25% (C), disciplina 20%, relacionamento 15%, conhecimento do produto 15%. Pergunta: "Conte como organizava sua carteira e sua rota sem supervisão."
- **Gerente regional:** liderança 25% (C), visão estratégica 20% (C), negociação 20%, visão analítica 20%, estabilidade emocional 15%. Pergunta: "Conte como recuperou uma região com resultado baixo."

### 3.22 Treinamento e educação corporativa

- **Instrutor / facilitador:** comunicação 30% (C), didática 25% (C), paciência 15%, extroversão 15%, organização 15%. Pergunta: "Conte um treinamento em que a turma não estava engajada e o que você fez."
- **Analista de treinamento:** organização 25% (C), visão analítica 20% (C), comunicação 20%, criatividade 20%, escuta 15%. Pergunta: "Conte como mediu se um treinamento deu resultado."
- **Gerente de educação corporativa:** visão estratégica 25% (C), desenvolvimento de pessoas 25% (C), liderança 20%, planejamento 15%, comunicação 15%. Pergunta: "Conte um programa de desenvolvimento que você criou."

### 3.23 Expansão e franquias

- **Analista de expansão:** visão analítica 25% (C), pesquisa de mercado 25% (C), organização 20%, comunicação 15%, negociação 15%. Pergunta: "Conte como avaliou se uma cidade valia uma nova unidade."
- **Consultor de campo / franquias:** relacionamento 25% (C), firmeza 20% (C), comunicação 20%, resolução de problemas 20%, autonomia 15%. Pergunta: "Conte como fez um franqueado seguir um padrão que ele resistia."
- **Gerente de expansão:** visão estratégica 25% (C), negociação 25% (C), liderança 20%, gestão de riscos 15%, planejamento 15%. Pergunta: "Conte uma expansão que você conduziu e o que aprendeu."

### 3.24 Dados e BI

- **Analista de dados:** raciocínio lógico 30% (C), atenção a detalhes 20% (C), curiosidade 20%, comunicação 15%, aprendizado contínuo 15%. Pergunta: "Conte quando os dados mostraram algo que ninguém esperava."
- **Analista de BI:** visão analítica 25% (C), comunicação visual 20% (C), visão de negócio 20%, organização 20%, raciocínio lógico 15%. Pergunta: "Conte um painel seu que mudou uma decisão."
- **Cientista de dados / gerente de dados:** raciocínio estatístico 25% (C), visão estratégica 20% (C), aprendizado contínuo 20%, liderança 20%, comunicação 15%. Pergunta: "Conte um modelo ou análise preditiva que gerou valor."

### 3.25 Saúde ocupacional e bem-estar

- **Técnico de enfermagem do trabalho:** cuidado e empatia 25% (C), atenção a detalhes 25% (C), discrição 20%, estabilidade emocional 15%, organização 15%. Pergunta: "Conte um atendimento de urgência que você conduziu."
- **Analista de qualidade de vida:** empatia 25% (C), comunicação 20% (C), criatividade 20%, organização 20%, visão analítica 15%. Pergunta: "Conte uma ação de bem-estar que teve boa adesão."
- **Gerente de saúde ocupacional:** integridade 25% (C), liderança 20% (C), visão estratégica 20%, discrição 20%, comunicação 15%. Pergunta: "Conte como reduziu afastamentos numa empresa."

## 3A. Ligação entre traços (HEXACO) e competências

Cada competência é calculada a partir dos traços de personalidade e completada pela entrevista e pela amostra de trabalho. Regra geral: nota da competência = 50% traços + 35% entrevista + 15% amostra de trabalho (quando houver; sem amostra, 60% traços + 40% entrevista). Traços: H = honestidade-humildade, E = emocionalidade (invertida = estabilidade emocional), X = extroversão, A = amabilidade, C = conscienciosidade, O = abertura.

| Competência | Traços e pesos | Validação principal |
| --- | --- | --- |
| Resiliência | E invertida 60%, C 40% | Entrevista |
| Estabilidade emocional | E invertida 100% | Entrevista |
| Disciplina | C 100% | Entrevista |
| Organização / planejamento | C 80%, O 20% | Amostra de trabalho |
| Atenção a detalhes / segurança | C 100% | Amostra de trabalho |
| Pontualidade | C 100% | Entrevista |
| Integridade / discrição | H 80%, C 20% | Entrevista |
| Comunicação | X 60%, O 40% | Entrevista |
| Comunicação escrita | O 60%, C 40% | Amostra de trabalho |
| Extroversão | X 100% | Entrevista |
| Persuasão / negociação | X 50%, E invertida 30%, O 20% | Amostra de trabalho |
| Relacionamento | X 50%, A 50% | Entrevista |
| Cordialidade / paciência | A 80%, E invertida 20% | Entrevista |
| Escuta e empatia | A 60%, E 20%, O 20% | Entrevista |
| Mediação de conflitos | A 50%, E invertida 30%, H 20% | Entrevista |
| Liderança | X 40%, C 30%, E invertida 30% | Entrevista |
| Desenvolvimento de pessoas | A 40%, X 30%, O 30% | Entrevista |
| Autoconfiança / firmeza | X 50%, E invertida 50% | Entrevista |
| Autonomia / proatividade | C 50%, X 30%, O 20% | Entrevista |
| Criatividade | O 100% | Amostra de trabalho |
| Curiosidade / aprendizado contínuo | O 80%, C 20% | Entrevista |
| Visão estratégica | O 60%, C 40% | Entrevista |
| Visão analítica / raciocínio lógico e numérico | O 40%, C 60% (+ teste cognitivo, quando houver) | Amostra de trabalho |
| Resolução de problemas | O 50%, C 30%, E invertida 20% | Amostra de trabalho |
| Foco em resultado | C 70%, X 30% | Entrevista |
| Gestão de crise / tomada de decisão | E invertida 50%, C 30%, X 20% | Entrevista |
| Abertura a feedback / humildade | H 50%, A 30%, O 20% | Entrevista |
| Trabalho em equipe | A 60%, H 20%, X 20% | Entrevista |
| Conhecimento técnico / do produto / habilidade manual | (não vem de personalidade) | Teste de conhecimento ou amostra |

Observações: pesos iniciais, a validar com psicólogo responsável e a ajustar com o desempenho real (fase 4). Perguntas do teste: usar instrumento de domínio público (ex.: IPIP-HEXACO) ou licenciado, escolhido pelo psicólogo responsável.

## 3B. Entrevista geral (para todas as pessoas)

Dez perguntas comportamentais usadas na análise geral, junto com o teste de personalidade. Régua de 1 a 5 em cada uma: 1 = sem exemplo real ou reação negativa; 3 = exemplo concreto com ação adequada; 5 = exemplo concreto, ação própria, resultado claro e aprendizado. A pessoa não avaliada como funcionária (ex.: estudante) pode usar exemplos da escola, de projetos ou da vida pessoal.

| # | Pergunta | Competências medidas |
| --- | --- | --- |
| 1 | Conte uma situação em que você enfrentou muita pressão ou várias recusas seguidas. O que fez? | Resiliência, estabilidade emocional |
| 2 | Conte uma tarefa longa ou repetitiva que você levou até o fim. Como manteve o ritmo? | Disciplina, organização |
| 3 | Conte quando precisou convencer alguém de uma ideia. Como fez? | Comunicação, persuasão |
| 4 | Conte um conflito com alguém e como ele terminou. | Mediação de conflitos, relacionamento |
| 5 | Conte um problema que ninguém sabia resolver e como você chegou à solução. | Resolução de problemas, visão analítica |
| 6 | Conte uma ideia nova que você teve e colocou em prática. | Criatividade, proatividade |
| 7 | Conte quando você liderou ou ajudou um grupo a alcançar algo. | Liderança, desenvolvimento de pessoas |
| 8 | Conte quando percebeu um erro, seu ou de outra pessoa, que ninguém tinha visto. O que fez? | Atenção a detalhes, integridade |
| 9 | Conte quando recebeu uma crítica dura. Como reagiu e o que mudou? | Abertura a feedback, humildade |
| 10 | Conte algo que você aprendeu sozinho porque quis. Como aprendeu? | Curiosidade, aprendizado contínuo |

Uso no cálculo: cada nota alimenta a parte "entrevista" das competências listadas (seção 3A). Competências sem pergunta aqui ficam só com os traços até haver entrevista específica de vaga.

## 3C. Teste de personalidade: as 60 afirmações (rascunho)

São 60 afirmações, 10 por traço do HEXACO, selecionadas do [IPIP-HEXACO](https://ipip.ori.org/newHEXACO_PI_key.htm). Esse banco de itens é de domínio público e [pode ser copiado, traduzido e usado para qualquer fim](https://ipip.ori.org/), inclusive comercial. Cada traço cobre suas 4 facetas, com metade das afirmações em sentido direto e metade invertido sempre que possível. Ficaram de fora itens sobre política, tristeza ou depressão e rebeldia, por serem inadequados num processo seletivo.

**Como a pessoa responde:** 1 = discordo totalmente, 2 = discordo, 3 = neutro, 4 = concordo, 5 = concordo totalmente.

**Como o sistema calcula:**

- Afirmação com sentido “−”: nota = 6 − resposta.
- Nota do traço = média das suas 10 afirmações, de 1 a 5. Onde a seção 3A diz “E invertida”, usa-se 6 − nota de E.
- Na tela, as afirmações aparecem misturadas, em rodízio entre os traços (1, 11, 21, 31, 41, 51, 2, 12…), para a pessoa não perceber o que está sendo medido.
- Pares de coerência para a detecção de respostas falsas: 11 × 12, 15 × 16, 33 × 34, 46 × 47 e 56 × 58. Concordar com os dois lados de dois ou mais pares gera um alerta de inconsistência no relatório do gestor.

| # | Afirmação | Traço · faceta | Sentido |
| --- | --- | --- | --- |
| 1 | Não finjo ser mais do que sou. | H · Sinceridade | + |
| 2 | Uso elogios para me dar bem. | H · Sinceridade | − |
| 3 | Digo às pessoas o que elas querem ouvir para que façam o que eu quero. | H · Sinceridade | − |
| 4 | Eu nunca pegaria algo que não é meu. | H · Justiça | + |
| 5 | Devolvo o troco quando o caixa me dá a mais por engano. | H · Justiça | + |
| 6 | Trapaceio para levar vantagem. | H · Justiça | − |
| 7 | Não gostaria de ser uma celebridade famosa. | H · Desapego material | + |
| 8 | Adoro luxo. | H · Desapego material | − |
| 9 | Não me acho melhor do que as outras pessoas. | H · Modéstia | + |
| 10 | Costumo me exibir quando tenho chance. | H · Modéstia | − |
| 11 | Começo a entrar em pânico quando há perigo. | E · Medo | + |
| 12 | Enfrento o perigo com confiança. | E · Medo | − |
| 13 | Aceito correr riscos. | E · Medo | − |
| 14 | Costumo me preocupar com as coisas. | E · Ansiedade | + |
| 15 | Me estresso com facilidade. | E · Ansiedade | + |
| 16 | Mantenho a calma sob pressão. | E · Ansiedade | − |
| 17 | Preciso da aprovação dos outros. | E · Dependência | + |
| 18 | Busco apoio nas outras pessoas. | E · Dependência | + |
| 19 | Sinto as emoções dos outros. | E · Sentimentalismo | + |
| 20 | Raramente me emociono. | E · Sentimentalismo | − |
| 21 | Tenho capacidade de liderança. | X · Ousadia social | + |
| 22 | Me saio bem quando preciso falar de improviso. | X · Ousadia social | + |
| 23 | Prefiro ficar em segundo plano. | X · Ousadia social | − |
| 24 | Faço amizade com facilidade. | X · Sociabilidade | + |
| 25 | Não gostaria de um trabalho com muito contato com pessoas. | X · Sociabilidade | − |
| 26 | Mantenho as pessoas à distância. | X · Sociabilidade | − |
| 27 | Falo bastante. | X · Expressividade | + |
| 28 | Não gosto de chamar atenção para mim. | X · Expressividade | − |
| 29 | Geralmente tenho muita energia e disposição. | X · Vitalidade | + |
| 30 | Me canso rápido. | X · Vitalidade | − |
| 31 | Tenho facilidade para perdoar. | A · Perdão | + |
| 32 | Guardo rancor. | A · Perdão | − |
| 33 | Aceito as pessoas como elas são. | A · Gentileza | + |
| 34 | Julgo os outros rapidamente. | A · Gentileza | − |
| 35 | Me adapto com facilidade. | A · Flexibilidade | + |
| 36 | Sei aceitar conselhos. | A · Flexibilidade | + |
| 37 | Não suporto que me contrariem. | A · Flexibilidade | − |
| 38 | Geralmente sou uma pessoa paciente. | A · Paciência | + |
| 39 | Me irrito com facilidade. | A · Paciência | − |
| 40 | Perco o controle quando fico com raiva. | A · Paciência | − |
| 41 | Gosto de ordem. | C · Organização | + |
| 42 | Deixo minhas coisas espalhadas. | C · Organização | − |
| 43 | Me dedico muito ao que faço. | C · Diligência | + |
| 44 | Começo logo as tarefas, sem enrolar. | C · Diligência | + |
| 45 | Faço só o mínimo necessário. | C · Diligência | − |
| 46 | Presto atenção aos detalhes. | C · Perfeccionismo | + |
| 47 | Presto pouca atenção aos detalhes. | C · Perfeccionismo | − |
| 48 | Faço planos e cumpro. | C · Prudência | + |
| 49 | Tomo decisões precipitadas. | C · Prudência | − |
| 50 | Cometo erros por descuido. | C · Prudência | − |
| 51 | Vejo beleza em coisas que os outros não percebem. | O · Apreciação estética | + |
| 52 | Não gosto de arte. | O · Apreciação estética | − |
| 53 | Me interesso por ciência. | O · Curiosidade intelectual | + |
| 54 | Gosto de ler textos desafiadores. | O · Curiosidade intelectual | + |
| 55 | Não costumo me aprofundar nos assuntos. | O · Curiosidade intelectual | − |
| 56 | Adoro pensar em novas formas de fazer as coisas. | O · Criatividade | + |
| 57 | Tenho muitas ideias. | O · Criatividade | + |
| 58 | Tenho dificuldade de imaginar coisas. | O · Criatividade | − |
| 59 | Sei que minhas ideias às vezes surpreendem as pessoas. | O · Não convencionalidade | + |
| 60 | Prefiro que me vejam como alguém convencional. | O · Não convencionalidade | − |

**Antes de usar em decisões reais:** esta é uma seleção nossa, não uma versão curta já validada, e a tradução é livre. O psicólogo responsável deve revisar a tradução, de preferência com retrotradução. Também deve conduzir um piloto com algumas centenas de pessoas para checar a confiabilidade de cada traço e verificar a situação do teste junto ao CFP (SATEPSI). Fonte dos itens: Ashton, Lee e Goldberg (2007), [IPIP-HEXACO](https://ipip.ori.org/newHEXACO_PI_key.htm).

## 4. Observações

- Pesos e competências são o ponto de partida. O gestor pode ajustá-los por empresa.
- Os pesos devem ser validados por um psicólogo e refinados com o desempenho real (fase 4).

## 5. Protótipo: etapa 1 (núcleo)

A etapa 1 foi publicada em 13/11/2026 como página no Claude: [Hayah Talent Intelligence](https://claude.ai/artifact/EuQqg54ZdYMC9bwBHAUWHL). Ela aplica o teste, calcula a compatibilidade com os 25 departamentos e gera o relatório do gestor e a devolutiva da pessoa.

**O que já funciona**

- **Gestor:** cadastro de empresas e convites por código (avulso, funcionário, grupo, com a confirmação de autorização para menores) e lista de pessoas avaliadas.
- **Aplicar teste:** a pessoa responde na tela do gestor (modo presencial).
- **Teste:** consentimento LGPD, 60 afirmações em 6 partes, em rodízio entre os traços, e 10 perguntas abertas.
- **Relatório do gestor:** 3 áreas recomendadas e 3 não indicadas, com % por função e motivo; também mostra os traços, as competências e os alertas de inconsistência, de respostas iguais e de grupo com menores.
- **Entrevista:** notas pela régua, dadas pelo gestor ou sugeridas pelo Claude, que avalia só o conteúdo; o gestor confere e ajusta.
- **Devolutiva:** versão da pessoa sem as áreas não indicadas nem as notas, liberada pelo gestor ou copiada como texto.

**Decisões de cálculo tomadas na construção (a validar)**

- Perfil ideal = 5 em todas as competências. A compatibilidade da função é a média ponderada das notas (nota 1 = 0%, nota 5 = 100%).
- Competência crítica abaixo de 3 tira 10 pontos.
- Sem amostra de trabalho: 60% teste + 40% entrevista. Competência sem pergunta na entrevista geral usa só o teste.
- Conhecimento técnico, do produto e habilidade manual ficam fora do cálculo até haver teste de conhecimento.
- Motivo do alerta: as 2 competências críticas mais fracas do departamento, como risco de estresse, de erro ou de desgaste.
- Alertas de resposta: concordar com os dois lados de 2 ou mais pares; a mesma resposta em 70% ou mais; 85% ou mais nos extremos.
- Competências da biblioteca sem linha própria na seção 3A foram ligadas à mais próxima:
  - organização: planejamento, gestão de prioridades
  - visão analítica: raciocínio lógico, numérico e estatístico, gestão de custos, pesquisa de mercado
  - persuasão: negociação, argumentação
  - integridade: discrição
  - cordialidade: paciência
  - resolução de problemas: melhoria contínua
  - gestão de crise: gestão de riscos, tomada de decisão
  - autoconfiança: firmeza
  - autonomia: proatividade
  - desenvolvimento de pessoas: didática
  - escuta e empatia: visão de público, visão de usuário, julgamento de pessoas, escuta
  - criatividade: comunicação visual
  - visão estratégica: visão de negócio
  - disciplina: resistência física e de rotina, foco e concentração

**Limites do protótipo:** o código de convite só funciona para pessoas da organização no Claude com acesso de Contribuidor. Pessoas de fora fazem o teste no modo presencial. Há um único gestor. Convite por link para qualquer pessoa, vários gestores isolados, subgestor e cobrança dependem da hospedagem profissional.

**Etapa 2:** publicada em 13/11/2026 (ver a seção seguinte).

## Protótipo: etapa 2 (vagas e reorganização)

A etapa 2 foi publicada em 13/11/2026 na mesma página, a [Hayah Talent Intelligence](https://claude.ai/artifact/EuQqg54ZdYMC9bwBHAUWHL). Ela soma três abas novas ao que já existia.

**O que já funciona**

- **Vagas:** cadastro com título, empresa e uma função da biblioteca como base. O perfil da vaga começa igual ao da função e pode ser ajustado. A vaga tem pré-requisitos, pontos desejáveis e uma entrevista específica, que o sistema monta sozinho e o gestor pode editar.
- **Candidatos:** o gestor adiciona pessoas avaliadas à vaga, a partir de uma lista das mais compatíveis. Para cada candidato, ele marca os pré-requisitos (atende, não atende, a conferir) e os pontos desejáveis, e faz a entrevista específica. A entrevista pode ser ao vivo, com um resumo e a nota, ou escrita pela pessoa e avaliada pelo Claude.
- **Ranking da vaga:** os candidatos aparecem em ordem de compatibilidade final, com as competências críticas abaixo de 3, a situação dos pré-requisitos e a entrevista.
- **Reorganização:** por empresa, compara cada funcionário com a função atual e com as vagas abertas. O sistema sugere manter, realocar ou dar atenção, e diz quais vagas dá para preencher com gente de dentro.
- **Função atual:** o gestor define a função de cada funcionário na aba Reorganização ou no relatório da pessoa.
- **Biblioteca editável:** o gestor edita os pesos e as competências críticas de qualquer departamento, cria departamentos novos e pode voltar ao padrão do sistema. As mudanças valem na hora para todos os relatórios.
- **Relatório da pessoa:** agora mostra a compatibilidade com as vagas abertas e, para funcionários, a aderência à função atual.

**Decisões de cálculo tomadas na construção (a validar)**

- **Pré-requisitos** são eliminatórios. Quem não atende a um deles sai da disputa, e os não conferidos aparecem como pendência.
- **Pontos desejáveis:** cada um atendido soma 3 pontos à compatibilidade, até 9 pontos.
- **Entrevista específica:** usa as 5 competências mais importantes da vaga, as críticas primeiro e depois por peso, mais uma pergunta de conhecimento técnico. Se o perfil tiver poucas competências, o sistema completa com competências gerais, como abertura a feedback e trabalho em equipe. Cada competência tem uma pergunta própria num banco de perguntas.
- **Notas de entrevista:** a nota de uma competência na entrevista é a média das notas da entrevista geral e da específica. Continua valendo 60% teste e 40% entrevista.
- **Conhecimento técnico:** passa a contar quando a vaga tem essa competência no perfil e a pergunta técnica foi avaliada. A nota vem só da entrevista.
- **Reorganização:** sugere a troca quando a vaga dá 60% ou mais e pelo menos 10 pontos acima da função atual. Cada vaga recebe uma pessoa, começando pelo maior ganho. Abaixo de 50% na função atual, o sistema avisa e mostra as áreas mais indicadas.
- **Biblioteca:** cada departamento precisa de pelo menos 3 funções. Cada função precisa de pelo menos 3 competências, pesos somando 100% e uma competência crítica.

**Limites do protótipo:** os departamentos criados valem só para este gestor; o compartilhamento com outros gestores e a revisão do administrador são da fase 4. A entrevista específica é preenchida na tela do gestor. Os demais limites da etapa 1 continuam.

## Protótipo: fase 2 (gestão de equipes)

Publicada em 13/11/2026 na mesma página. A aba Reorganização virou **Equipes**, com duas visões: o mapa da equipe e a reorganização.

**O que já funciona**

- **Guia de gestão por pessoa:** fica no relatório de cada pessoa e é só para o gestor da área. Ele diz como se comunicar com a pessoa, o que a motiva, como dar feedback, como delegar e acompanhar e quais são os pontos de atenção. Mostra também os pontos fortes a aproveitar e um plano de desenvolvimento com uma ação para cada uma das 3 competências mais fracas. O texto pode ser copiado.
- **Mapa da equipe:** é feito por empresa e pode ser filtrado por área. Traz as forças e as lacunas do time, as competências que dependem de uma pessoa só, um mapa de calor das competências, a distribuição dos traços HEXACO e o resumo dos guias de cada pessoa.
- **Comparação de candidatos:** na vaga, até 4 candidatos aparecem lado a lado. A comparação mostra a compatibilidade, os pré-requisitos, os desejáveis, a entrevista, cada competência da vaga, os alertas das respostas e os pontos fortes.

**Regras definidas na construção (a validar)**

- **Guia:** as orientações vêm só dos traços nas faixas baixa (abaixo de 2,6) e alta (acima de 3,4). Na faixa média, aparece uma orientação geral.
- **Cores do mapa:** verde a partir de 3,8, amarelo abaixo de 3,4 e vermelho abaixo de 3.
- **Lacuna:** é uma competência em que ninguém da equipe chega a 3,4.
- **Dependência:** acontece quando só uma pessoa chega a 3,8 numa competência e a média da equipe fica abaixo de 3,4.

**Fechamento da fase 2:** publicado em 13/11/2026 (ver a seção seguinte).

## Protótipo: fechamento da fase 2 (painel e marca)

A página passou a ter 7 abas: Painel, Pessoas avaliadas, Vagas, Equipes, Aplicar teste, Empresas e convites e Configurações. A Biblioteca agora fica dentro de Configurações.

**O que já funciona**

- **Painel multiempresa:** é a primeira tela. Mostra os totais (empresas, pessoas, vagas, candidatos e alertas de prioridade alta), uma tabela por empresa com a aderência média à função atual e a lista de alertas. Cada alerta tem um botão que leva direto ao que precisa ser feito. A lista pode ser filtrada por empresa.
- **Alertas de prioridade alta:** respostas contraditórias, iguais ou só nos extremos; funcionário com aderência abaixo de 50% na função atual.
- **Alertas de atenção:** entrevista geral não avaliada; função atual não definida; vaga sem candidatos; pré-requisitos a conferir; entrevista específica pendente.
- **Alertas de informação:** devolutiva não liberada; vaga que dá para preencher com alguém de dentro; vaga sem candidato interno com 60%; vaga aberta há 30 dias ou mais; equipe que depende de uma pessoa só numa competência.
- **Marca da consultoria:** em Configurações, o gestor cadastra o nome da consultoria, o responsável técnico, o contato, o texto do rodapé, a cor e o logo. O sistema reduz o logo para até 480 × 160 pixels.
- **Relatórios com a marca:** três arquivos para baixar: o relatório técnico da pessoa, a devolutiva e o relatório da equipe. Cada arquivo abre no navegador e tem um botão para imprimir ou salvar em PDF.
- **Devolutiva com a marca:** quando o gestor libera a devolutiva, ela aparece para a pessoa com o logo e o nome da consultoria.

**Decisões tomadas na construção (a validar)**

- Os arquivos são em HTML, porque esta página não pode gerar PDF nem imprimir direto. O PDF sai pelo navegador, com o botão do próprio arquivo.
- O rodapé mostra “Tecnologia Hayah Talent Intelligence” por padrão. O gestor pode desligar.
- O relatório técnico e o da equipe saem marcados como confidenciais, de uso exclusivo do gestor.
- A vaga é considerada parada a partir de 30 dias aberta.

**Limites do protótipo:** a marca é uma só por gestor; a marca por empresa cliente fica para a hospedagem profissional. Os downloads só funcionam com a página aberta pelo Claude.

**Fase 3:** publicada em 13/11/2026 (ver a seção seguinte).

## Protótipo: fase 3 (inteligência)

A aba Equipes agora tem cinco visões: Mapa da equipe, Talentos e risco, Sucessão, Reorganização e Retorno. O relatório de cada funcionário ganhou três seções: risco de saída, plano de desenvolvimento e reavaliação.

**O que já funciona**

- **Sinais do dia a dia:** no relatório, o gestor informa o desempenho (1 a 5), a satisfação (1 a 5), os meses de casa, os meses desde a última promoção ou aumento e se a pessoa demonstrou intenção de sair.
- **Risco de saída:** é uma pontuação de 0 a 100. Cada fator aparece com os seus pontos e uma ação de retenção. A pessoa de alto desempenho em risco é marcada como prioridade.
- **Mapa de talentos:** a matriz de 9 caixas cruza o desempenho informado pelo gestor com o potencial calculado. Cada caixa tem uma ação sugerida.
- **Plano de sucessão:** para cada função ocupada, o sistema lista até 3 possíveis sucessores da equipe, com a prontidão de cada um. Ele avisa quando uma função não tem sucessor e o titular tem risco de saída.
- **Indicador de retorno:** estima a economia e o retorno do investimento por empresa, com premissas editáveis.
- **Plano de desenvolvimento:** o plano nasce do guia de gestão, com 3 ações e prazo de 90 dias. Cada ação tem situação (a fazer, em andamento, concluída), e as atrasadas aparecem no painel.
- **Reavaliação periódica:** cada empresa tem um intervalo de 6, 12, 18 ou 24 meses. O botão “Reaplicar o teste” cria a nova avaliação, que herda a função atual, os sinais e o plano. O relatório novo mostra a evolução das competências.
- **Detecção de respostas falsas:** além dos alertas da etapa 1, o sistema avisa quando o perfil é favorável demais, quando o teste e a entrevista divergem muito e quando a pessoa respondeu rápido demais.

**Regras definidas na construção (a validar)**

- **Risco de saída (pontos):**
  - aderência à função abaixo de 50%: +30; de 50% a 59%: +15;
  - perfil 20 pontos melhor em outra área: +10;
  - satisfação 1 ou 2: +25; satisfação 3: +10;
  - intenção de sair ou proposta recebida: +25;
  - menos de 12 meses de casa: +10;
  - 24 meses ou mais sem promoção ou aumento: +10.
  - O risco é alto a partir de 55 pontos e médio a partir de 30.
- **Potencial:** é a média de curiosidade, autonomia, resolução de problemas, resiliência, abertura a feedback, visão estratégica e liderança. É alto a partir de 3,8 e médio a partir de 3,0.
- **Desempenho no mapa:** notas 1 e 2 contam como baixo, 3 como médio e 4 e 5 como alto.
- **Sucessão:** a pessoa está pronta agora com 75% ou mais de compatibilidade e potencial a partir de 3,0. Está pronta em 1 a 2 anos a partir de 60%.
- **Retorno:** economia = (vagas preenchidas com gente de dentro × custo de contratação) + (funcionários com risco alto × custo de substituição × redução esperada). Os valores padrão, todos editáveis, são:
  - salário médio de R$ 3.000;
  - contratação externa de 1 salário;
  - substituição de 6 salários;
  - redução de 20% das saídas;
  - R$ 150 por pessoa avaliada.
- **Respostas falsas:**
  - perfil favorável demais = 5 ou mais traços no extremo desejável;
  - divergência = 3 ou mais competências com 2 pontos ou mais de diferença entre o teste e a entrevista;
  - rápido demais = as 60 afirmações em menos de 4 minutos.

**Fase 4:** publicada em 13/11/2026 (ver a seção seguinte).

## Protótipo: fase 4 (aprendizado)

Com esta fase, as 4 fases do plano estão no protótipo. O menu foi reagrupado em 7 abas: Painel, Pessoas avaliadas, Vagas, Equipes, Testes e convites, Resultados e Configurações. “Aplicar teste” agora fica dentro de “Testes e convites”.

**O que já funciona**

- **Validação com o desempenho real:** fica na aba Resultados. Mostra um gráfico da compatibilidade com a função contra o desempenho informado pelo gestor, com a correlação. Também mostra as competências mais e menos ligadas ao bom desempenho, com uma sugestão de quais pesos aumentar, e o risco de quem saiu da empresa contra o risco de quem ficou.
- **Registro de saída:** no relatório, o gestor registra quando alguém sai, com a data e o motivo. A pessoa sai das equipes, e o sistema guarda o risco que ela tinha na época.
- **Auditoria de viés:** também fica em Resultados. Com a coleta ligada, o teste termina com 4 perguntas opcionais: gênero, faixa etária, cor ou raça e deficiência. Elas têm um consentimento próprio e nunca aparecem para grupos com menores. A auditoria compara os grupos pela compatibilidade média e pela taxa de aprovação, usando a regra dos 4/5.
- **Departamentos compartilhados:** na Biblioteca, cada departamento gera um código para copiar. Outro gestor cola o código e importa o departamento.
- **Devolutiva compartilhável:** um cartão em imagem para redes sociais, com o nome, as 3 áreas e os pontos fortes, mais um texto pronto para postar. O cartão nunca mostra notas nem pontos a desenvolver. A pessoa avaliada também consegue baixar o cartão na página dela.
- **Cursos e carreiras:** a devolutiva ganhou duas seções. “Caminhos de formação” traz os cursos técnicos e as graduações de cada área recomendada. “Cursos para desenvolver” traz temas de curso para as competências mais fracas.

**Regras definidas na construção (a validar)**

- **Validação:** a amostra mínima recomendada é de 30 funcionários. A correlação é moderada a partir de 0,3 e forte a partir de 0,5. A lista de competências só aparece com pelo menos 5 pessoas.
- **Auditoria:** só mostra grupos com 5 pessoas ou mais. A aprovação conta quem tem 60% ou mais em alguma vaga ou área. Uma taxa abaixo de 80% da maior taxa indica possível viés. Pretas e pardas também são somadas como “Negra”, seguindo o IBGE.
- **Dados demográficos:** nunca entram no cálculo nem nos relatórios individuais. São dados sensíveis pela LGPD, e a coleta começa desligada.
- **Caminhos de formação:** valem para os 25 departamentos da biblioteca. Departamentos criados pelo gestor ainda não têm caminhos.

**Limites do protótipo:** o ajuste de pesos sugerido pela validação é feito à mão, na biblioteca. A revisão de departamentos pelo administrador e a biblioteca comum a todos os gestores dependem da hospedagem profissional, com vários gestores de verdade.

**Próximo passo:** ver a decisão de 13/11/2026 abaixo.

## Decisão: uso pessoal, só para testes (13/11/2026)

Por enquanto, o sistema fica para uso pessoal e para testes. Não há psicólogo envolvido e ele não será vendido.

- **Motivo:** pela Resolução CFP nº 31/2022, um psicólogo só pode usar profissionalmente testes com parecer favorável no SATEPSI. Além disso, o uso comercial do inventário HEXACO original exige uma licença paga.
- **Mudanças na página:** o rodapé e os relatórios baixados passam a dizer que o sistema é um protótipo para uso pessoal e testes. Também dizem que ele não é avaliação psicológica e não deve ser usado para decidir contratações, demissões ou promoções.
- **Testes:** feitos com voluntários adultos que concordem em participar, sem impacto no trabalho deles.
- **Para voltar a pensar em venda:** escolher entre usar um teste já aprovado no SATEPSI, posicionar o produto como ferramenta comportamental sem psicólogo ou submeter um teste próprio ao SATEPSI. Os documentos Kit de validação e piloto e Materiais do piloto ficam guardados para essa fase.

## Versão web: primeira entrega (13/11/2026)

A versão para uso fora do Claude. Continua valendo a decisão de uso pessoal e testes.

- **Tecnologia:** Next.js 15 na Vercel; banco e login no Supabase (região São Paulo). Passo a passo em `docs/como-publicar.md`.
- **Motor:** o mesmo do protótipo (`prototipo/motor.js`). Nenhuma regra de cálculo mudou.
- **Gestor:** conta com e-mail e senha. Cada gestor só vê as próprias empresas, convites e avaliações (regras de segurança no banco, por linha).
- **Convite por link:** tipo avulso ou funcionário, com rótulo, limite de respostas (padrão 200) e opção de pausar. Convite que aceita menores exige a confirmação de que o gestor tem a autorização dos responsáveis.
- **Teste:** a pessoa não precisa de conta. Aceita o termo, responde as 60 afirmações e as 10 perguntas da entrevista. O progresso fica salvo no próprio aparelho até o envio. O banco confere as respostas (60 notas de 1 a 5) antes de gravar.
- **Entrevista:** o gestor dá as notas de 1 a 5, ou usa o Claude se a chave da API estiver configurada. A nota final segue a regra de 60% traços + 40% entrevista.
- **Devolutiva:** cada pessoa recebe um link próprio e secreto. O texto só aparece depois que o gestor libera, e fica guardado como estava no momento da liberação. Liberar de novo atualiza o texto.
- **Fica para as próximas entregas:** vagas, equipes, reorganização, sucessão, reavaliação, validação com desempenho, auditoria de viés, marca e relatórios para baixar.

## Versão web: administrador e convite de gestor (13/11/2026)

- **Administrador:** a primeira conta do banco é a do administrador (hoje, o Isaías). Só ele vê a página **Gestores**.
- **Convite de gestor:** o administrador informa nome e e-mail e recebe um link. O link vale por 7 dias, serve uma vez só e só com aquele e-mail. Dá para cancelar e reativar.
- **Cadastro fechado:** ninguém cria conta sem convite válido. A regra fica no banco (gatilho de cadastro), não só na tela. A página Entrar não oferece mais "criar conta".
- **O que o administrador vê:** nome, e-mail, data de entrada e quantos convites e testes cada gestor tem. Não vê as pessoas avaliadas, as respostas nem os relatórios de outros gestores.
- **Onde se aplica o teste:** o gestor cadastra empresas, entidades (associação, ONG, igreja, escola…) ou treinamentos (curso, turma, programa). O convite do tipo "participante" (antes "funcionário") fica ligado a um deles.


## Versão 0.3: correções do teste do Henrique (14/11/2026)

**Por quê.** No primeiro teste real, um perfil de liderança recebeu Logística, Produção e Manutenção, todas com a função de entrada como exemplo. Causas: notas espremidas (todas as competências entre 3,1 e 3,9, áreas entre 60% e 68%); a regra "maior nota entre as funções" deixava o cargo de entrada decidir a área; o teste media estilo (personalidade), mas não interesse nem vontade de liderar.

**O que mudou**

- **Botões da escala:** cerca de 35% mais baixos (número e texto mais compactos, menos espaço entre as afirmações).
- **Bloco 2 do teste (33 itens, depois das 60 afirmações):** 24 atividades de interesse, 4 por tipo RIASEC (Realista, Investigativo, Artístico, Social, Empreendedor, Convencional), escala "Não gostaria nada" a "Gostaria muito"; 6 afirmações de motivação para liderar (1 invertida); 3 perguntas de histórico ("quantas vezes você coordenou um grupo", "foi escolhido para representar ou liderar", "ensinou ou orientou alguém"), escala de "Nunca" a "Mais de 6 vezes". Todos os itens foram escritos para este sistema: o modelo RIASEC é uma teoria pública e nenhuma escala publicada foi copiada. O teste passa a levar de 35 a 45 minutos.
- **Perfil padronizado:** para escolher as áreas, cada competência é comparada com a média da própria pessoa (média = 3; cada desvio-padrão vale 0,8 ponto). Assim aparece o que se destaca na pessoa, mesmo quando ela responde tudo em tom moderado.
- **Área separada de nível:** o perfil da área é a média das funções no perfil padronizado, sem penalidade. O cargo de entrada não decide mais a área. O nível vem do **índice de liderança**: 40% motivação para liderar + 30% histórico de liderança + 30% competência liderança pelos traços. Índice alto: a função de exemplo em cada área é a de liderança (maior peso em liderança). Senão, a de maior compatibilidade absoluta, sem contar a de liderança.
- **Nota da área:** 50% perfil padronizado + 50% interesse. Cada departamento tem um código RIASEC de dois tipos (principal com peso 2, secundário com peso 1). Interesses também são padronizados pela média da pessoa (cada desvio-padrão vale 20 pontos, a partir de 50). Sem o bloco 2 (avaliações antigas e protótipo), a área usa só o perfil.
- **Resultado inconclusivo:** se a média das 3 primeiras áreas ficar menos de 8 pontos acima da mediana de todas, o relatório e a devolutiva avisam que não há preferência clara.
- **Competências mais robustas:** estabilidade emocional (e as competências que a usam) passa a vir só das facetas Ansiedade e Medo. Sentimentalismo e Dependência ficam de fora: sentir as emoções dos outros não é instabilidade. Liderança = 50% traços + 30% motivação + 20% histórico; desenvolvimento de pessoas = 70% traços + 30% histórico de ensino.
- **Vagas e reorganização:** continuam com a compatibilidade absoluta da função (100% − distância até o ideal, com penalidade de crítica), porque ali importa o nível de cada competência.
- **Convites:** o gestor define quantas pessoas podem responder (1 = individual) e por quanto tempo o link vale (1, 7, 30 ou 90 dias, ou sem prazo). Cada convite tem QR code para projetor ou impressão. Convite vencido aparece como encerrado e pode ganhar mais 7 dias. O sistema não envia e-mail em nenhum convite.
- **Convite de gestor sem e-mail:** o administrador copia o link e manda. Com "Confirm email" desligado no Supabase, o gestor cria a senha e já entra.

**Regras (constantes em `RULES`)**

| Regra | Valor |
| --- | --- |
| `stdSpread` | 0,8 ponto por desvio-padrão da pessoa |
| `stdMinSd` | desvio mínimo 0,3 (não estica ruído) |
| `wAreaPerfil` / `wAreaInteresse` | 50% / 50% |
| `interesseSpread` | 20 pontos por desvio-padrão |
| `inconclusivo` | menos de 8 pontos entre a média das 3 primeiras e a mediana |
| `wLidMotivacao` / `wLidHistorico` / `wLidTracos` | 40% / 30% / 30% |
| `lidAlto` / `lidMedio` | 3,8 / 3,0 |

**A validar:** pesos e faixas acima são primeira versão. Conferir com pessoas que o Henrique conhece bem, de perfis variados, antes de ajustar.
