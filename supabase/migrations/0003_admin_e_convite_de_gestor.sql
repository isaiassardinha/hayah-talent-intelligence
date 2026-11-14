-- Administrador do sistema, convite de gestor e tipo de organização.
-- Rodar depois da 0002 (SQL Editor > New query > colar > Run).
--
-- * Só o administrador cria convites de gestor. Ninguém cria conta sem convite.
-- * O primeiro gestor do banco vira administrador. Num banco novo, a primeira
--   conta criada vira administradora (não precisa de convite).
-- * O administrador vê a lista de gestores e quantos testes cada um aplicou,
--   mas não vê as pessoas avaliadas nem as respostas de outros gestores.
-- * Empresas ganham um tipo: empresa, entidade ou treinamento.

-- ---------------------------------------------------------------- papel do gestor

alter table public.gestores
  add column papel text not null default 'gestor' check (papel in ('admin', 'gestor'));

update public.gestores set papel = 'admin'
where id = (select id from public.gestores order by criado_em, id limit 1)
  and not exists (select 1 from public.gestores where papel = 'admin');

create function public.eh_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.gestores where id = auth.uid() and papel = 'admin')
$$;

-- ---------------------------------------------------------------- tipo de organização

alter table public.empresas
  add column tipo text not null default 'empresa' check (tipo in ('empresa', 'entidade', 'treinamento'));

-- ---------------------------------------------------------------- convites de gestor

create table public.convites_gestor (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(trim(email)) and email like '_%@_%._%' and char_length(email) <= 254),
  nome text check (char_length(nome) <= 120),
  token text not null unique default encode(extensions.gen_random_bytes(16), 'hex'),
  criado_por uuid not null default auth.uid() references public.gestores (id) on delete cascade,
  criado_em timestamptz not null default now(),
  expira_em timestamptz not null default now() + interval '7 days',
  usado_em timestamptz,
  usado_por uuid references public.gestores (id) on delete set null,
  cancelado_em timestamptz
);
create index convites_gestor_email_idx on public.convites_gestor (email);

alter table public.convites_gestor enable row level security;
revoke all on public.convites_gestor from anon, authenticated;
grant select, insert (email, nome), update (cancelado_em, expira_em) on public.convites_gestor to authenticated;

create policy "admin gerencia convites de gestor" on public.convites_gestor
  for all to authenticated
  using (public.eh_admin())
  with check (public.eh_admin());

-- ---------------------------------------------------------------- cadastro só com convite

create or replace function public.criar_gestor() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_convite public.convites_gestor%rowtype;
  v_papel text := 'gestor';
begin
  if not exists (select 1 from public.gestores where papel = 'admin') then
    -- banco novo: a primeira conta é a do administrador
    v_papel := 'admin';
  else
    select * into v_convite from public.convites_gestor c
     where c.token = new.raw_user_meta_data ->> 'convite'
       and c.email = lower(new.email)
       and c.usado_em is null and c.cancelado_em is null and c.expira_em > now()
     for update;
    if not found then
      raise exception 'cadastro_sem_convite' using errcode = 'P0001';
    end if;
  end if;

  insert into public.gestores (id, nome, papel)
  values (new.id, left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'nome'), ''), v_convite.nome, ''), 120), v_papel)
  on conflict (id) do nothing;

  if v_convite.id is not null then
    update public.convites_gestor set usado_em = now(), usado_por = new.id where id = v_convite.id;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------- funções

-- Página de cadastro: mostra para quem é o convite e se ainda vale.
create function public.convite_gestor_publico(p_token text)
returns table (email text, nome text, valido boolean)
language sql stable security definer set search_path = '' as $$
  select c.email, c.nome, (c.usado_em is null and c.cancelado_em is null and c.expira_em > now())
  from public.convites_gestor c
  where c.token = p_token
$$;

-- Lista de gestores para o administrador. Para os outros, volta vazia.
create function public.listar_gestores()
returns table (id uuid, nome text, email text, papel text, criado_em timestamptz, convites bigint, avaliacoes bigint)
language sql stable security definer set search_path = '' as $$
  select g.id, g.nome, u.email::text, g.papel, g.criado_em,
         (select count(*) from public.convites c where c.gestor_id = g.id),
         (select count(*) from public.avaliacoes a where a.gestor_id = g.id)
  from public.gestores g
  join auth.users u on u.id = g.id
  where public.eh_admin()
  order by g.criado_em
$$;

revoke all on function public.eh_admin() from public, anon, authenticated;
revoke all on function public.convite_gestor_publico(text) from public, anon, authenticated;
revoke all on function public.listar_gestores() from public, anon, authenticated;
revoke all on function public.criar_gestor() from public, anon, authenticated;
grant execute on function public.eh_admin() to authenticated;
grant execute on function public.convite_gestor_publico(text) to anon, authenticated;
grant execute on function public.listar_gestores() to authenticated;
