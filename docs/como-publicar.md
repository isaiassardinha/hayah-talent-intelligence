# Como colocar no ar (Supabase + Vercel)

Leva uns 20 minutos. Você só precisa do navegador.

> O sistema continua sendo para uso pessoal e testes. Não é avaliação psicológica e não deve ser usado para decidir contratações, demissões ou promoções.

## 1. Supabase: criar o banco

1. Entre em [supabase.com](https://supabase.com) e clique em **New project**.
2. Dê um nome (ex.: `hayah`), crie uma senha do banco e guarde-a.
3. Em **Region**, escolha **South America (São Paulo)**.
4. Espere o projeto ficar pronto (1 a 2 minutos).

## 2. Supabase: criar as tabelas

1. No menu da esquerda, abra **SQL Editor** e clique em **New query**.
2. Abra o arquivo [`supabase/migrations/0001_inicial.sql`](../supabase/migrations/0001_inicial.sql) aqui no GitHub e clique no botão de copiar.
3. Cole no editor e clique em **Run**.
4. Deve aparecer "Success. No rows returned".
5. Repita com os outros arquivos da pasta [`supabase/migrations`](../supabase/migrations), na ordem dos números (`0002`, `0003`…).
6. Cada arquivo roda só uma vez.

## 3. Supabase: copiar as chaves

1. Abra **Project Settings** > **API Keys** (em alguns painéis, **Data API**).
2. Copie e guarde:
   - a **Project URL** (algo como `https://abcd1234.supabase.co`);
   - a chave **publishable** ou **anon public**.
3. **Nunca** use a chave `service_role` ou `secret`. Ela ignora as regras de segurança.

## 4. Vercel: publicar o site

1. Entre em [vercel.com](https://vercel.com) e clique em **Add New** > **Project**.
2. Escolha o repositório `hayah-talent-intelligence`. Se ele não aparecer, clique em **Adjust GitHub App Permissions** e libere o acesso.
3. A Vercel reconhece o Next.js sozinha. Não mude os comandos.
4. Abra **Environment Variables** e cadastre:

   | Nome | Valor |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | a Project URL do passo 3 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | a chave publishable ou anon do passo 3 |

5. Clique em **Deploy** e espere (2 a 3 minutos).
6. Copie o endereço que a Vercel mostrar (ex.: `https://hayah-talent-intelligence.vercel.app`).

## 5. Supabase: ligar o login ao endereço do site

1. No Supabase, abra **Authentication** > **URL Configuration**.
2. Em **Site URL**, cole o endereço da Vercel.
3. Em **Redirect URLs**, adicione:
   - `https://SEU-ENDERECO.vercel.app/auth/confirmar`
   - `http://localhost:3000/auth/confirmar` (para rodar no computador)
4. Salve.

## 6. Primeiro acesso (conta do administrador)

A primeira conta do banco vira a do administrador. Só ela pode convidar gestores.

1. No Supabase, abra **Authentication** > **Users** > **Add user** > **Create new user**.
2. Coloque seu e-mail e uma senha, marque **Auto Confirm User** e crie.
3. Abra o site e entre com esse e-mail e senha. No menu aparece **Gestores**: é a área do administrador.

## 7. Convidar gestores

1. Em **Gestores**, escreva o nome e o e-mail do gestor e toque em **Gerar convite**.
2. Copie o link e envie para a pessoa (WhatsApp, e-mail…). Ele vale por 7 dias e só uma vez.
3. A pessoa abre o link, cria a senha e confirma pelo e-mail. Depois ela cadastra as empresas, entidades ou treinamentos e cria os convites do teste.

Deixe **Allow new users to sign up** **ligado** no Supabase (**Authentication** > **Sign In / Providers**). O próprio banco recusa qualquer cadastro sem convite válido. Se essa opção estiver desligada, nem os gestores convidados conseguem criar a conta.

Quem faz o teste pelo link do convite não precisa de conta.

## Opcional

- **`NEXT_PUBLIC_SITE_URL`:** o endereço do site. Use se for ter domínio próprio. Sem ele, os links usam o endereço da própria página.
- **`ANTHROPIC_API_KEY`:** liga o botão **Avaliar com o Claude** na entrevista. Crie em [console.anthropic.com](https://console.anthropic.com). É cobrado por uso, à parte da assinatura do Claude.
- Depois de mudar uma variável na Vercel, abra **Deployments** e clique em **Redeploy** para valer.

## Problemas comuns

| O que acontece | O que fazer |
| --- | --- |
| O e-mail de confirmação não chega | Veja o spam. O envio padrão do Supabase tem limite baixo por hora: espere e tente de novo. |
| O link do e-mail abre `localhost` | Falta o passo 5 (Site URL). |
| Gestor convidado vê "Não foi possível criar a conta" | Confira se **Allow new users to sign up** está ligado no Supabase e se o convite ainda vale. |
| "Convite não encontrado" ou "não está mais ativo" | O link está incompleto ou o convite foi pausado. Confira em **Convites**. |
| Página em branco ou erro 500 | Confira as duas variáveis na Vercel e faça **Redeploy**. |
| Erro ao rodar o SQL dizendo que algo já existe | O SQL já foi rodado. Não precisa rodar de novo. |

## Rodar no computador

Precisa do Node.js 20 ou mais novo.

```bash
cp .env.example .env.local   # preencha com a URL e a chave do Supabase
npm install
npm run dev                  # abre em http://localhost:3000
```
