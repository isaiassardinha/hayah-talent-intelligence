# Hayah Talent Intelligence

Sistema de análise de perfil, compatibilidade com funções e vagas e alocação de pessoas em equipes.

> **Situação atual:** protótipo para uso pessoal e testes. Não é avaliação psicológica nem teste psicológico, e não deve ser usado para decidir contratações, demissões ou promoções. Ver a seção "Decisão: uso pessoal, só para testes" em `docs/especificacao.md`.

## O que tem aqui

| Pasta ou arquivo | O que é |
| --- | --- |
| `prototipo/index.html` | O protótipo completo, numa página só (HTML, CSS e JavaScript). |
| `prototipo/motor.js` | O motor de cálculo, separado do `index.html` para testar e reaproveitar. Gerado a partir do `index.html`. |
| `docs/especificacao.md` | A especificação completa: objetivos, perfis de acesso, metodologia, biblioteca, fases e todas as decisões tomadas. |
| `testes/motor.test.js` | Testes automáticos do motor de cálculo. |
| `CLAUDE.md` | Contexto do projeto para o Claude Code. |

## Como abrir o protótipo

- **Pelo Claude (com dados salvos):** https://claude.ai/artifact/EuQqg54ZdYMC9bwBHAUWHL
- **No computador, sem salvar nada:** abra `prototipo/index.html` no navegador. A página entra em modo demonstração: tudo funciona, mas os dados somem quando a página é fechada. Use o botão "Criar exemplo completo" para ver os relatórios.

## Como rodar os testes

Precisa do Node.js 18 ou mais novo.

```bash
npm run extrair   # atualiza prototipo/motor.js a partir do index.html
npm test          # roda os testes do motor
```

## O que o protótipo faz

- Teste de personalidade com 60 afirmações (modelo HEXACO) e entrevista estruturada com 10 perguntas, com notas do gestor ou do Claude.
- Compatibilidade com 75 funções de 25 departamentos: 3 áreas recomendadas e 3 não indicadas por pessoa.
- Vagas com pré-requisitos, pontos desejáveis, entrevista específica, ranking e comparação de candidatos.
- Equipes: mapa de competências, talentos (9 caixas), risco de saída, sucessão, reorganização e retorno estimado.
- Guia de gestão, plano de desenvolvimento, reavaliação e evolução por pessoa.
- Painel com alertas, relatórios com a marca da consultoria, cartão para redes sociais, validação com o desempenho real e auditoria de viés.

## Limites do protótipo

Os limites vêm de o protótipo ser uma página dentro do Claude:

- só há um gestor;
- não há login próprio nem convite por link para qualquer pessoa;
- não há cobrança;
- os dados ficam no armazenamento da página no Claude.

## Próximo passo: a versão para outras pessoas usarem

A ideia é transformar o protótipo num site próprio:

- **Supabase:** banco de dados e login, com servidores em São Paulo.
- **Vercel:** hospedagem do site.
- **Convite por link:** qualquer pessoa faz o teste no próprio celular.
- **Dados separados:** cada gestor vê só os seus dados.

O motor de cálculo (`prototipo/motor.js`) e os textos são reaproveitados como estão.

Documentos de apoio no Claude (fora deste repositório):

- [Kit de validação e piloto](https://claude.ai/artifact/E8zD5b375NbwzGFaoNCgxy)
- [Materiais do piloto](https://claude.ai/artifact/VTUnz8HD2pumgtxLoT4hQZ)
