# CLAUDE.md

Contexto para o Claude Code trabalhar neste repositório.

## Projeto

Hayah Talent Intelligence: sistema que analisa o perfil de uma pessoa (teste de personalidade HEXACO com 60 afirmações + entrevista estruturada) e calcula a compatibilidade com funções, departamentos e vagas. Também sugere reorganização de equipes, mostra risco de saída, sucessão e planos de desenvolvimento.

Quem conduz o projeto é o Isaías. Não há equipe de programação: o código é escrito com o Claude.

## Decisão vigente (13/11/2026)

- Uso pessoal e para testes. Sem psicólogo envolvido e sem venda por enquanto.
- Motivo: pela Resolução CFP nº 31/2022, psicólogos só podem usar profissionalmente testes com parecer favorável no SATEPSI; e o uso comercial do inventário HEXACO original exige licença paga.
- Todo texto do sistema deve deixar claro que ele **não é avaliação psicológica** e não deve ser usado para decidir contratação, demissão ou promoção.

## Idioma e escrita

- Interface, textos, comentários de regra de negócio e documentação em **português do Brasil**.
- Frases curtas e diretas. Nada de rótulos sobre a pessoa ("você é X"): falar em tendências ("seu perfil tende a…").
- A devolutiva da pessoa nunca mostra as áreas não indicadas nem as notas.

## Estrutura

- `prototipo/index.html`: o protótipo inteiro. O primeiro `<script>` é o motor de cálculo (sem acesso a tela nem a dados); o segundo é a interface.
- `prototipo/motor.js`: cópia do primeiro `<script>`, gerada por `npm run extrair`. **Não editar à mão**: edite o `index.html` e rode o script.
- `docs/especificacao.md`: especificação e decisões. Toda regra nova ou mudada entra lá, na seção da fase correspondente.
- `testes/`: testes do motor com `node:test`.

## Regras do motor que não podem quebrar

- Nota de competência = 60% traços + 40% entrevista (quando avaliada). Conhecimento técnico só vem da entrevista específica.
- Compatibilidade da função = média ponderada das notas (nota 1 = 0%, nota 5 = 100%), menos 10 pontos por competência crítica abaixo de 3.
- Departamento: maior nota entre as funções para recomendar (top 3); média das funções para as 3 áreas não indicadas.
- Constantes ficam em `RULES`, `RULES2` e `RULES3`. Mudou um número? Atualize também a tabela de regras em `docs/especificacao.md`.
- Dados demográficos (auditoria de viés) nunca entram no cálculo nem em relatório individual.

## Como verificar uma mudança

1. `npm run extrair && npm test`
2. Abrir `prototipo/index.html` no navegador, clicar em "Criar exemplo completo" e conferir Painel, Pessoas avaliadas, Vagas e Equipes. Testar também com a janela estreita (celular).

## Próxima etapa planejada

Versão para outras pessoas usarem: Supabase (banco e login, região São Paulo) + Vercel, com login, convite por link, dados isolados por gestor e o motor reaproveitado. Ainda não iniciada.
