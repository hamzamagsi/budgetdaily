-- BudgetDaily schema
-- Run this in the Supabase SQL editor for your project.

create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  total_amount numeric not null check (total_amount > 0),
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  currency text not null default 'USD',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid references budgets on delete cascade not null,
  user_id uuid references auth.users not null,
  amount numeric not null check (amount > 0),
  label text,
  date timestamptz not null default now()
);

create table if not exists subscriptions (
  user_id uuid references auth.users primary key,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'trialing', -- trialing | active | past_due | canceled
  plan text not null default 'monthly',
  current_period_end timestamptz
);

alter table budgets enable row level security;
alter table expenses enable row level security;
alter table subscriptions enable row level security;

create policy "own budgets" on budgets for all using (auth.uid() = user_id);
create policy "own expenses" on expenses for all using (auth.uid() = user_id);
create policy "own subscription" on subscriptions for all using (auth.uid() = user_id);

-- Keep only one active budget per user
create unique index if not exists one_active_budget_per_user
  on budgets (user_id) where (active);
