import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <span className="font-display font-semibold text-lg tracking-tight">BudgetDaily</span>
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
        >
          Log in
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-warn)] uppercase mb-6">
          one number, every day
        </p>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight max-w-2xl leading-[1.1]">
          Put in your budget.<br />We'll tell you what's safe to spend today.
        </h1>
        <p className="mt-6 text-[var(--color-text-dim)] max-w-md text-base">
          No categories, no charts to interpret. Set a total and an end date — get one honest
          number every morning, and overspending today quietly adjusts every day after it.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="mt-10 px-7 py-3.5 rounded-full bg-[var(--color-brand)] text-[var(--color-ink)] font-semibold text-sm hover:brightness-110 transition-all"
        >
          Start your budget — $4/mo
        </button>
        <p className="mt-3 text-xs text-[var(--color-text-faint)]">7-day free trial · cancel anytime</p>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-[var(--color-text-faint)]">
        BudgetDaily
      </footer>
    </div>
  )
}
