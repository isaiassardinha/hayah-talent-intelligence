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

- `app/`, `components/`, `lib/`: versão web em Next.js 15 (App Router, JavaScript). Login e dados no Supabase via `@supabase/ssr`. Rotas do gestor em `app/(gestor)/`; teste público em `app/t/[token]`; devolutiva pública em `app/d/[segredo]`.
- `supabase/migrations/`: SQL do banco. Toda tabela tem RLS por `gestor_id = auth.uid()`. O teste e a devolutiva públicos só passam pelas funções `convite_publico`, `enviar_respostas` e `devolutiva_publica` (SECURITY DEFINER). Mudou o banco? Crie uma nova migração numerada; não edite a `0001` já aplicada.
- `lib/motor.js` importa `prototipo/motor.js`: o motor é o mesmo do protótipo.
- `docs/como-publicar.md`: passo a passo do Supabase e da Vercel.
- `prototipo/index.html`: o protótipo inteiro. O primeiro `<script>` é o motor de cálculo (sem acesso a tela nem a dados); o segundo é a interface.
- `prototipo/motor.js`: cópia do primeiro `<script>`, gerada por `npm run extrair`. **Não editar à mão**: edite o `index.html` e rode o script.
- `docs/especificacao.md`: especificação e decisões. Toda regra nova ou mudada entra lá, na seção da fase correspondente.
- `testes/`: testes do motor e do banco (PGlite) com `node:test`.

## Regras do motor que não podem quebrar

- Nota de competência = 60% traços + 40% entrevista (quando avaliada). Conhecimento técnico só vem da entrevista específica.
- Compatibilidade da função = média ponderada das notas (nota 1 = 0%, nota 5 = 100%), menos 10 pontos por competência crítica abaixo de 3.
- Departamento: maior nota entre as funções para recomendar (top 3); média das funções para as 3 áreas não indicadas.
- Constantes ficam em `RULES`, `RULES2` e `RULES3`. Mudou um número? Atualize também a tabela de regras em `docs/especificacao.md`.
- Dados demográficos (auditoria de viés) nunca entram no cálculo nem em relatório individual.

## Como verificar uma mudança

1. `npm run extrair && npm test && npm run build`
2. Versão web: `npm run dev` com `.env.local` apontando para um projeto Supabase de teste. Conferir login, convite, teste no celular, painel, relatório e devolutiva.
3. Abrir `prototipo/index.html` no navegador, clicar em "Criar exemplo completo" e conferir Painel, Pessoas avaliadas, Vagas e Equipes. Testar também com a janela estreita (celular).

## Situação da versão web

Primeira versão pronta: login, convites por link, dados isolados por gestor, teste, painel, relatório, entrevista e devolutiva. Ainda só no protótipo: vagas, equipes, reorganização, sucessão, reavaliação, validação, auditoria de viés e relatórios para baixar. Levar essas partes para a versão web, uma por vez, é a próxima etapa.
