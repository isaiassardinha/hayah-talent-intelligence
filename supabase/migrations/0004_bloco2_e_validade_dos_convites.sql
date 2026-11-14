-- Versão 0.3: bloco 2 do teste e validade dos convites.
-- Rodar depois da 0003 (SQL Editor > New query > colar > Run).
--
-- * avaliacoes.respostas_extra: as 33 respostas do bloco 2 (24 de interesses,
--   6 de motivação para liderar e 3 de histórico), de 1 a 5. Avaliações antigas
--   ficam sem elas (null) e continuam funcionando.
-- * convites.expira_em: data em que o link para de aceitar respostas (opcional).
--   O limite de pessoas já existia (convites.limite): 1 = convite individual.
-- * enviar_respostas ganha o parâmetro p_respostas_extra (opcional, para não
--   quebrar quem estiver com a página antiga aberta).

alter table public.avaliacoes
  add column respostas_extra smallint[]
  check (respostas_extra is null or (array_length(respostas_extra, 1) = 33 and public.respostas_validas(respostas_extra)));

alter table public.convites add column expira_em timestamptz;

-- O que a pessoa vê antes de começar o teste: agora o convite vencido aparece como encerrado.
create or replace function public.convite_publico(p_token text)
returns table (tipo text, empresa text, rotulo text, aberto boolean)
language sql stable security definer set search_path = public as $$
  select c.tipo,
         e.nome,
         c.rotulo,
         c.ativo
           and (c.expira_em is null or c.expira_em > now())
           and (select count(*) from public.avaliacoes a where a.convite_id = c.id) < c.limite
  from public.convites c
  left join public.empresas e on e.id = c.empresa_id
  where c.token = p_token
$$;

drop function public.enviar_respostas(text, text, smallint[], text[], boolean, integer);

create function public.enviar_respostas(
  p_token text,
  p_nome text,
  p_respostas smallint[],
  p_entrevista text[],
  p_consentimento boolean,
  p_duracao_seg integer,
  p_respostas_extra smallint[] default null
) returns text
language plpgsql security definer set search_path = public as $$
declare
  c public.convites%rowtype;
  v_segredo text;
begin
  select * into c from public.convites where token = p_token for update;
  if not found or not c.ativo then
    raise exception 'convite_invalido' using errcode = 'P0001';
  end if;
  if c.expira_em is not null and c.expira_em <= now() then
    raise exception 'convite_vencido' using errcode = 'P0001';
  end if;
  if (select count(*) from public.avaliacoes a where a.convite_id = c.id) >= c.limite then
    raise exception 'convite_esgotado' using errcode = 'P0001';
  end if;
  if not coalesce(p_consentimento, false) then
    raise exception 'sem_consentimento' using errcode = 'P0001';
  end if;
  if p_respostas is null or array_length(p_respostas, 1) <> 60 or not public.respostas_validas(p_respostas) then
    raise exception 'respostas_invalidas' using errcode = 'P0001';
  end if;
  if p_respostas_extra is not null and (array_length(p_respostas_extra, 1) is distinct from 33 or not public.respostas_validas(p_respostas_extra)) then
    raise exception 'respostas_invalidas' using errcode = 'P0001';
  end if;
  if p_entrevista is null or array_length(p_entrevista, 1) <> 10 then
    raise exception 'entrevista_invalida' using errcode = 'P0001';
  end if;

  insert into public.avaliacoes (gestor_id, convite_id, empresa_id, nome, tipo, respostas, respostas_extra, entrevista, consentimento, duracao_seg)
  values (
    c.gestor_id, c.id, c.empresa_id,
    left(trim(p_nome), 120),
    c.tipo,
    p_respostas,
    p_respostas_extra,
    array(select left(coalesce(x, ''), 4000) from unnest(p_entrevista) with ordinality as t (x, i) order by i),
    true,
    case when p_duracao_seg between 0 and 86400 then p_duracao_seg end
  )
  returning segredo into v_segredo;
  return v_segredo;
end;
$$;

revoke all on function public.enviar_respostas(text, text, smallint[], text[], boolean, integer, smallint[]) from public;
grant execute on function public.enviar_respostas(text, text, smallint[], text[], boolean, integer, smallint[]) to anon, authenticated;
