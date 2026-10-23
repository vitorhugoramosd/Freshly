-- =====================================================================
-- FRESHLY: script do banco de dados
-- Como usar: no Supabase, abra "SQL Editor" > "New query", cole tudo
-- e clique em "Run". Pode rodar mais de uma vez sem problema.
-- =====================================================================

-- Tabela principal: cada linha é um alimento que o usuário cadastrou.
create table if not exists public.alimentos (
  id            uuid primary key default gen_random_uuid(),
  -- dono do alimento; auth.uid() é o id do usuário logado
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nome          text not null check (char_length(nome) between 1 and 80),
  quantidade    numeric(10,2) not null default 1 check (quantidade > 0),
  unidade       text not null default 'un',
  categoria     text not null default 'Outros',
  local         text not null default 'Geladeira' check (local in ('Geladeira','Freezer','Despensa')),
  validade      date not null,
  preco         numeric(10,2) check (preco is null or preco >= 0),
  -- ativo = ainda está em casa; consumido = foi usado; descartado = foi para o lixo
  status        text not null default 'ativo' check (status in ('ativo','consumido','descartado')),
  finalizado_em timestamptz,
  criado_em     timestamptz not null default now()
);

create index if not exists alimentos_user_validade_idx
  on public.alimentos (user_id, status, validade);

-- ---------------------------------------------------------------------
-- RLS (Row Level Security = segurança por linha)
-- Liga uma "trava" na tabela: cada usuário só enxerga e mexe nas
-- linhas em que user_id é ele mesmo. Sem isso, qualquer um com a
-- chave pública leria os dados de todo mundo.
-- ---------------------------------------------------------------------
alter table public.alimentos enable row level security;

drop policy if exists "dono le"      on public.alimentos;
drop policy if exists "dono insere"  on public.alimentos;
drop policy if exists "dono altera"  on public.alimentos;
drop policy if exists "dono apaga"   on public.alimentos;

create policy "dono le"     on public.alimentos for select using (user_id = (select auth.uid()));
create policy "dono insere" on public.alimentos for insert with check (user_id = (select auth.uid()));
create policy "dono altera" on public.alimentos for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "dono apaga"  on public.alimentos for delete using (user_id = (select auth.uid()));
