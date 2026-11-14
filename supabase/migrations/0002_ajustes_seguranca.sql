-- Ajustes de segurança apontados pelo verificador do Supabase.
-- Rodar depois da 0001 (SQL Editor > New query > colar > Run).
--
-- * No Supabase, funções novas já nascem com permissão de execução para anon e
--   authenticated. A função do gatilho de cadastro não deve ser chamada pela API.
-- * As funções de validação ganham search_path fixo.
-- As três funções públicas (convite_publico, enviar_respostas, devolutiva_publica)
-- continuam abertas de propósito: é por elas que o teste e a devolutiva funcionam sem login.

revoke execute on function public.criar_gestor() from anon, authenticated;

alter function public.respostas_validas(smallint[]) set search_path = '';
alter function public.notas_validas(smallint[]) set search_path = '';
