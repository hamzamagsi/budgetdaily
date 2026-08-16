# BudgetDaily

Set a total budget and an end date. The app tells you exactly how much you can
spend *today* — and if you go over, every remaining day quietly absorbs it
instead of blocking you (unless it would blow the whole budget, which it blocks).

## Run it right now (no setup)

```bash
npm install
npm run dev
```

Open the URL it prints. This runs in **local demo mode** — data lives in your
browser's localStorage, "sign in" accepts any email, and "subscribing" just
flips a flag. Fully usable, nothing to configure.

## Making it a real product

Three things turn this from a demo into a real subscription app: **Supabase**
(accounts + database), **Stripe** (billing), **Vercel** (hosting + the two
serverless functions in `/api`). All the code for this is already written —
you're wiring keys, not building anything.

### 1. Supabase (accounts + database)

1. Create a project at supabase.com (free tier is fine to start).
2. In the SQL editor, run everything in `supabase/schema.sql`.
3. In Project Settings -> API, copy your Project URL and anon public key.
4. Add to your `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```
5. In `src/lib/store.js`, swap the export:
   ```js
   // export const store = localStore
   export const store = supabaseStore
   ```
   Also update the call sites in `AuthContext.jsx`, `Dashboard.jsx`, and
   `Onboarding.jsx` to `await` the now-async store methods (they're written to
   match `localStore`'s shape 1:1, so this is mechanical).
6. Enable "Email OTP" under Authentication -> Providers if it isn't already on.

### 2. Stripe (real subscriptions)

1. Create a Product + a monthly Price ($4/mo or whatever you land on) in the
   Stripe dashboard. Copy the Price ID.
2. Copy your Secret Key from Developers -> API keys.
3. Add a webhook endpoint pointing at `https://yourdomain.com/api/stripe-webhook`,
   subscribed to: `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copy the signing secret.
4. Env vars (set these in Vercel's dashboard, not just locally):
   ```
   STRIPE_SECRET_KEY=sk_live_xxxx
   STRIPE_PRICE_ID=price_xxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxx
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=xxxx   (Settings -> API -> service_role — keep secret, server-side only)
   PUBLIC_URL=https://yourdomain.com
   ```
5. `npm install stripe` (only needed for the `/api` functions, not the frontend bundle).

### 3. Deploy to Vercel

Same flow you used for Ledger:
```bash
git init && git add . && git commit -m "init"
gh repo create budgetdaily --public --push
```
Then import the repo in Vercel, paste in the env vars above, deploy. The
`/api/create-checkout-session` and `/api/stripe-webhook` files are picked up
automatically as serverless functions — no extra config needed.

## How the core logic works

Everything lives in `src/lib/budgetEngine.js`, about 100 lines, fully commented.
The whole product is really one formula recomputed daily:

```
today's allowance = (total budget − money spent so far) / (days left, including today)
```

Overspend today, and tomorrow's allowance shrinks because the numerator
dropped. Underspend, and it grows. No separate "debt" to track — it falls out
of recomputing the formula fresh each day. The only hard block is spending
that would exceed the *entire remaining budget*, since at that point there's
no future day left to absorb it.

## Project structure

```
src/lib/budgetEngine.js    core math — start here
src/lib/store.js           flips between localStore (demo) and supabaseStore (real)
src/components/            AllowanceGauge (the dial), AddExpenseModal, ExpenseLog
src/pages/                 Landing, Login, Onboarding, Dashboard, Subscribe
api/                       Stripe serverless functions (Vercel)
supabase/schema.sql        Postgres schema + row-level security
```
