-- Hayah Talent Intelligence · banco de dados inicial
-- Rodar no Supabase: SQL Editor > New query > colar este arquivo > Run.
--
-- Regras de acesso:
--  * Cada gestor (usuário logado) vê e altera só os próprios dados (RLS).
--  * A pessoa avaliada não tem login: ela abre o link do convite e envia as
--    respostas por uma função segura (enviar_respostas). Ela nunca lê tabelas.
--  * A devolutiva é lida por um link secreto (devolutiva_publica), e só depois
--    que o gestor a libera.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------- tabelas

create table public.gestores (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text check (char_length(nome) <= 120),
  criado_em timestamptz not null default now()
);

create table public.empresas (
  id uuid primary key default gen_random_uuid(),
  gestor_id uuid not null default auth.uid() references public.gestores (id) on delete cascade,
  nome text not null check (char_length(trim(nome)) between 2 and 120),
  criado_em timestamptz not null default now()
);
create index empresas_gestor_idx on public.empresas (gestor_id);

create table public.convites (
  id uuid primary key default gen_random_uuid(),
  gestor_id uuid not null default auth.uid() references public.gestores (id) on delete cascade,
  empresa_id uuid references public.empresas (id) on delete set null,
  token text not null unique default encode(extensions.gen_random_bytes(12), 'hex'),
  tipo text not null check (tipo in ('avulso', 'funcionario')),
  rotulo text check (char_length(rotulo) <= 160),
  menores boolean not null default false,
  autorizacao_em timestamptz,
  ativo boolean not null default true,
  limite integer not null default 200 check (limite between 1 and 5000),
  criado_em timestamptz not null default now(),
  -- grupo com menores exige a confirmação da autorização dos responsáveis
  constraint convite_menores_autorizado check (not menores or autorizacao_em is not null)
);
create index convites_gestor_idx on public.convites (gestor_id);

-- respostas válidas: todas de 1 a 5
create function public.respostas_validas(r smallint[]) returns boolean
language sql immutable as $$
  select coalesce(bool_and(x between 1 and 5), false) from unnest(r) as x
$$;

-- notas válidas: vazias ou de 1 a 5
create function public.notas_validas(n smallint[]) returns boolean
language sql immutable as $$
  select n is null or coalesce(bool_and(x is null or x between 1 and 5), true) from unnest(n) as x
$$;

create table public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  gestor_id uuid not null references public.gestores (id) on delete cascade,
  convite_id uuid references public.convites (id) on delete set null,
  empresa_id uuid references public.empresas (id) on delete set null,
  nome text not null check (char_length(trim(nome)) between 3 and 120),
  tipo text not null check (tipo in ('avulso', 'funcionario')),
  respostas smallint[] not null check (array_length(respostas, 1) = 60 and public.respostas_validas(respostas)),
  entrevista text[] not null check (array_length(entrevista, 1) = 10),
  consentimento boolean not null check (consentimento),
  duracao_seg integer,
  notas smallint[] check (notas is null or (array_length(notas, 1) = 10 and public.notas_validas(notas))),
  motivos text[],
  avaliado_por text check (avaliado_por in ('gestor', 'ia')),
  avaliado_em timestamptz,
  devolutiva jsonb,
  devolutiva_liberada_em timestamptz,
  segredo text not null unique default encode(extensions.gen_random_bytes(16), 'hex'),
  criado_em timestamptz not null default now()
);
create index avaliacoes_gestor_idx on public.avaliacoes (gestor_id, criado_em desc);
create index avaliacoes_convite_idx on public.avaliacoes (convite_id);

-- ---------------------------------------------------------------- cadastro automático do gestor

create function public.criar_gestor() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.gestores (id, nome)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'nome', ''), 120))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_gestor();

-- ---------------------------------------------------------------- permissões

alter table public.gestores enable row level security;
alter table public.empresas enable row level security;
alter table public.convites enable row level security;
alter table public.avaliacoes enable row level security;

revoke all on public.gestores, public.empresas, public.convites, public.avaliacoes from anon, authenticated;

grant select, update (nome) on public.gestores to authenticated;
grant select, insert, update, delete on public.empresas to authenticated;
grant select, insert, update, delete on public.convites to authenticated;
grant select, delete on public.avaliacoes to authenticated;
grant update (nome, notas, motivos, avaliado_por, avaliado_em, devolutiva, devolutiva_liberada_em)
  on public.avaliacoes to authenticated;

create policy "gestor vê o próprio cadastro" on public.gestores
  for select to authenticated using (id = auth.uid());
create policy "gestor altera o próprio cadastro" on public.gestores
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "gestor gerencia as próprias empresas" on public.empresas
  for all to authenticated
  using (gestor_id = auth.uid())
  with check (gestor_id = auth.uid());

create policy "gestor gerencia os próprios convites" on public.convites
  for all to authenticated
  using (gestor_id = auth.uid())
  with check (
    gestor_id = auth.uid()
    and (empresa_id is null or exists (
      select 1 from public.empresas e where e.id = empresa_id and e.gestor_id = auth.uid()))
  );

create policy "gestor vê as próprias avaliações" on public.avaliacoes
  for select to authenticated using (gestor_id = auth.uid());
create policy "gestor atualiza as próprias avaliações" on public.avaliacoes
  for update to authenticated using (gestor_id = auth.uid()) with check (gestor_id = auth.uid());
create policy "gestor exclui as próprias avaliações" on public.avaliacoes
  for delete to authenticated using (gestor_id = auth.uid());

-- ---------------------------------------------------------------- funções públicas (sem login)

-- O que a pessoa vê antes de começar o teste. Não expõe nada além disso.
create function public.convite_publico(p_token text)
returns table (tipo text, empresa text, rotulo text, aberto boolean)
language sql stable security definer set search_path = public as $$
  select c.tipo,
         e.nome,
         c.rotulo,
         c.ativo and (select count(*) from public.avaliacoes a where a.convite_id = c.id) < c.limite
  from public.convites c
  left join public.empresas e on e.id = c.empresa_id
  where c.token = p_token
$$;

-- Envio das respostas pela pessoa. Devolve o segredo do link da devolutiva.
create function public.enviar_respostas(
  p_token text,
  p_nome text,
  p_respostas smallint[],
  p_entrevista text[],
  p_consentimento boolean,
  p_duracao_seg integer
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
  if (select count(*) from public.avaliacoes a where a.convite_id = c.id) >= c.limite then
    raise exception 'convite_esgotado' using errcode = 'P0001';
  end if;
  if not coalesce(p_consentimento, false) then
    raise exception 'sem_consentimento' using errcode = 'P0001';
  end if;
  if p_respostas is null or array_length(p_respostas, 1) <> 60 or not public.respostas_validas(p_respostas) then
    raise exception 'respostas_invalidas' using errcode = 'P0001';
  end if;
  if p_entrevista is null or array_length(p_entrevista, 1) <> 10 then
    raise exception 'entrevista_invalida' using errcode = 'P0001';
  end if;

  insert into public.avaliacoes (gestor_id, convite_id, empresa_id, nome, tipo, respostas, entrevista, consentimento, duracao_seg)
  values (
    c.gestor_id, c.id, c.empresa_id,
    left(trim(p_nome), 120),
    c.tipo,
    p_respostas,
    array(select left(coalesce(x, ''), 4000) from unnest(p_entrevista) with ordinality as t (x, i) order by i),
    true,
    case when p_duracao_seg between 0 and 86400 then p_duracao_seg end
  )
  returning segredo into v_segredo;
  return v_segredo;
end;
$$;

-- Devolutiva pelo link secreto: o nome sempre, o conteúdo só depois de liberado.
create function public.devolutiva_publica(p_segredo text)
returns table (nome text, devolutiva jsonb, liberada_em timestamptz)
language sql stable security definer set search_path = public as $$
  select a.nome,
         case when a.devolutiva_liberada_em is not null then a.devolutiva end,
         a.devolutiva_liberada_em
  from public.avaliacoes a
  where a.segredo = p_segredo
$$;

revoke all on function public.convite_publico(text) from public;
revoke all on function public.enviar_respostas(text, text, smallint[], text[], boolean, integer) from public;
revoke all on function public.devolutiva_publica(text) from public;
revoke all on function public.criar_gestor() from public;
grant execute on function public.convite_publico(text) to anon, authenticated;
grant execute on function public.enviar_respostas(text, text, smallint[], text[], boolean, integer) to anon, authenticated;
grant execute on function public.devolutiva_publica(text) to anon, authenticated;
