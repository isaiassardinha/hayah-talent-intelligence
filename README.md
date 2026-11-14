# Hayah Talent Intelligence

Sistema de análise de perfil, compatibilidade com funções e vagas e alocação de pessoas em equipes.

> **Situação atual:** uso pessoal e testes. Não é avaliação psicológica nem teste psicológico, e não deve ser usado para decidir contratações, demissões ou promoções. Ver a seção "Decisão: uso pessoal, só para testes" em `docs/especificacao.md`.

## O que tem aqui

| Pasta ou arquivo | O que é |
| --- | --- |
| `app/`, `components/`, `lib/` | A versão web (Next.js): login do gestor, convites por link, teste no celular, painel, relatório e devolutiva. |
| `supabase/migrations/0001_inicial.sql` | O banco de dados: tabelas, regras de segurança (cada gestor só vê os seus dados) e as funções usadas pelo teste público. |
| `docs/como-publicar.md` | **Passo a passo para colocar no ar** com Supabase e Vercel. |
| `prototipo/index.html` | O protótipo completo, numa página só. Tem todas as funções (vagas, equipes etc.). |
| `prototipo/motor.js` | O motor de cálculo. Gerado a partir do `index.html` e usado pela versão web. |
| `docs/especificacao.md` | A especificação completa e todas as decisões tomadas. |
| `testes/` | Testes do motor e do banco de dados. |
| `CLAUDE.md` | Contexto do projeto para o Claude Code. |

## A versão web

Para colocar no ar, siga [`docs/como-publicar.md`](docs/como-publicar.md).

O que já funciona:

- conta de gestor com e-mail e senha;
- empresas e convites por link (avulso ou funcionário), com pausa e limite de respostas;
- teste no celular, sem conta, com consentimento e progresso salvo no aparelho;
- painel com as pessoas avaliadas e o que falta fazer;
- relatório da pessoa: áreas recomendadas e não indicadas, traços, competências e guia de gestão;
- notas da entrevista pelo gestor ou pelo Claude (opcional);
- devolutiva por link próprio, que só aparece depois que o gestor libera.

Ainda só no protótipo: vagas, equipes, reorganização, sucessão, reavaliação, validação, auditoria de viés e relatórios para baixar.

## Como abrir o protótipo

- **Pelo Claude (com dados salvos):** https://claude.ai/artifact/EuQqg54ZdYMC9bwBHAUWHL
- **No computador, sem salvar nada:** abra `prototipo/index.html` no navegador. A página entra em modo demonstração: tudo funciona, mas os dados somem quando a página é fechada. Use o botão "Criar exemplo completo" para ver os relatórios.

## Como rodar os testes

Precisa do Node.js 20 ou mais novo.

```bash
npm install
npm run extrair   # atualiza prototipo/motor.js a partir do index.html
npm test          # testes do motor e do banco
```

## O que o protótipo faz

- Teste de personalidade com 60 afirmações (modelo HEXACO) e entrevista estruturada com 10 perguntas, com notas do gestor ou do Claude.
- Compatibilidade com 75 funções de 25 departamentos: 3 áreas recomendadas e 3 não indicadas por pessoa.
- Vagas com pré-requisitos, pontos desejáveis, entrevista específica, ranking e comparação de candidatos.
- Equipes: mapa de competências, talentos (9 caixas), risco de saída, sucessão, reorganização e retorno estimado.
- Guia de gestão, plano de desenvolvimento, reavaliação e evolução por pessoa.
- Painel com alertas, relatórios com a marca da consultoria, cartão para redes sociais, validação com o desempenho real e auditoria de viés.

## Limites do protótipo

O protótipo é uma página dentro do Claude: um gestor só, sem login próprio e sem convite por link. Por isso existe a versão web.

Documentos de apoio no Claude (fora deste repositório):

- [Kit de validação e piloto](https://claude.ai/artifact/E8zD5b375NbwzGFaoNCgxy)
- [Materiais do piloto](https://claude.ai/artifact/VTUnz8HD2pumgtxLoT4hQZ)
