import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import { format, addDays } from 'date-fns'
import { redirectToPolarCheckout } from '../lib/polar'
import {
  Sparkles,
  Calendar,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Crown,
  Briefcase,
  User,
  Zap,
  Shield,
  Layers,
  Calculator,
} from 'lucide-react'

const ROLES = [
  { id: 'job', label: '🏢 Employed / Job', desc: 'Monthly or bi-weekly salary' },
  { id: 'freelance', label: '💻 Freelancer / Contractor', desc: 'Variable project earnings' },
  { id: 'business', label: '💼 Business Owner / Founder', desc: 'Business & personal cashflow' },
  { id: 'student', label: '🎓 Student', desc: 'Allowance & living expenses' },
  { id: 'other', label: '🏡 Other', desc: 'Custom budget tracking' },
]

const PERIOD_PRESETS = [
  { id: 'monthly', label: '📅 Monthly', days: 30, desc: 'Full calendar month' },
  { id: 'fortnightly', label: '🗓️ Fortnightly', days: 14, desc: '2 weeks / bi-weekly' },
  { id: 'weekly', label: '📆 Weekly', days: 7, desc: '7-day sprint' },
  { id: 'custom', label: '⏱️ Custom Range', days: 1, desc: 'Choose specific dates' },
]

const CURRENCIES = [
  { symbol: '$', label: 'USD ($)', name: 'US Dollar' },
  { symbol: '₨', label: 'PKR (₨)', name: 'Pakistani Rupee' },
  { symbol: '₹', label: 'INR (₹)', name: 'Indian Rupee' },
  { symbol: 'AED', label: 'AED (د.إ)', name: 'UAE Dirham' },
  { symbol: 'SAR', label: 'SAR (﷼)', name: 'Saudi Riyal' },
  { symbol: '€', label: 'EUR (€)', name: 'Euro' },
  { symbol: '£', label: 'GBP (£)', name: 'British Pound' },
  { symbol: 'CAD', label: 'CAD ($)', name: 'Canadian Dollar' },
  { symbol: 'AUD', label: 'AUD ($)', name: 'Australian Dollar' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [step, setStep] = useState(1) // 1: Profile, 2: Plan, 3: Budget & Dates, 4: Categories

  // Step 1: Profile State
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '')
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || '')
  const [role, setRole] = useState('job')

  // Step 2: Plan Choice
  const [chosenPlan, setChosenPlan] = useState('free') // 'free' | 'monthly'

  // Step 3: Budget Period & Amount
  const today = format(new Date(), 'yyyy-MM-dd')
  const defaultEnd = format(addDays(new Date(), 29), 'yyyy-MM-dd')

  const [periodType, setPeriodType] = useState('monthly')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [currency, setCurrency] = useState('$')
  const [totalAmount, setTotalAmount] = useState('4500')

  // Step 4: Category Budgets
  const [categoryAllocations, setCategoryAllocations] = useState({
    rent: '1700',
    groceries: '500',
    dining: '250',
    healthcare: '200',
    entertainment: '200',
    transport: '150',
  })

  // Calculate days & daily allowance
  const days = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
  const numericAmount = Number(totalAmount) || 0
  const dailyAllowance = numericAmount > 0 ? (numericAmount / days).toFixed(2) : '0.00'

  // Handle Preset Period Change
  const handlePresetSelect = (preset) => {
    setPeriodType(preset.id)
    if (preset.id !== 'custom') {
      const newEnd = format(addDays(new Date(startDate), preset.days - 1), 'yyyy-MM-dd')
      setEndDate(newEnd)
    }
  }

  // Final Complete Handler
  const handleFinish = () => {
    // 1. Update user profile name
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || user?.name || 'User'
    store.signIn({
      ...user,
      name: fullName,
      role,
    })

    // 2. Save Budget in localStore
    const periodLabel = `August · ${format(new Date(startDate), 'dd MMM')} - ${format(new Date(endDate), 'dd MMM')}`
    store.updateBudget({
      totalAmount: numericAmount || 4500,
      startDate,
      endDate,
      periodDays: days,
      periodLabel,
      currency,
      mode: 'budget',
    })

    // 3. Save initial category budgets
    Object.entries(categoryAllocations).forEach(([catId, amount]) => {
      store.setCategoryBudget(catId, Number(amount) || 0)
    })

    // 4. If Pro selected, redirect to Polar checkout, otherwise go to Dashboard
    if (chosenPlan === 'monthly') {
      redirectToPolarCheckout({ planId: 'monthly', email: user?.email })
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#f3f0ff]">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e4f5] shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        {/* PROGRESS BAR & STEP HEADER */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748b]">
            <span className="text-[#6c5ce7] uppercase font-mono tracking-wider">Step {step} of 4</span>
            <span>{step === 1 ? 'Profile' : step === 2 ? 'Plan' : step === 3 ? 'Budget Period' : 'Allocations'}</span>
          </div>

          <div className="w-full h-2 rounded-full bg-[#f1edf9] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#6c5ce7] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* ================= STEP 1: PROFILE SETUP ================= */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center mx-auto shadow-xs">
                <User size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1f2430]">Let's Personalize Your Budget</h2>
              <p className="text-xs text-[#64748b]">Tell us a bit about yourself so we can tailor your experience.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Hamza"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-xs text-[#1f2430] outline-none focus:border-[#6c5ce7]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Magsi"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-xs text-[#1f2430] outline-none focus:border-[#6c5ce7]"
                />
              </div>
            </div>

            {/* OCCUPATION / ROLE SELECTOR */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-2">What best describes your income source?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      role === r.id
                        ? 'bg-[#ede9fe] border-[#6c5ce7] shadow-xs'
                        : 'bg-[#f8f6ff] border-[#e8e4f5] hover:bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#1f2430]">{r.label}</p>
                    <p className="text-[10px] text-[#64748b] mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white font-bold text-xs shadow-lg shadow-[#6c5ce7]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continue to Next Step</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ================= STEP 2: CHOOSE PLAN ================= */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center mx-auto shadow-xs">
                <Crown size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1f2430]">Choose Your BudgetDaily Plan</h2>
              <p className="text-xs text-[#64748b]">Select free starter or unlock all 10 superpowers.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              {/* Free Plan */}
              <div
                onClick={() => setChosenPlan('free')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  chosenPlan === 'free'
                    ? 'bg-[#ede9fe] border-2 border-[#6c5ce7] shadow-md shadow-[#6c5ce7]/15'
                    : 'bg-[#f8f6ff] border-[#e8e4f5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1f2430]">Free Starter</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#e8e4f5] text-[#64748b] font-mono font-bold">
                    $0 / forever
                  </span>
                </div>
                <ul className="text-[11px] text-[#64748b] space-y-1">
                  <li className="flex items-center gap-1.5"><Check size={13} className="text-[#10b981]" /> Daily allowance engine</li>
                  <li className="flex items-center gap-1.5"><Check size={13} className="text-[#10b981]" /> Calendar matrix spend logs</li>
                  <li className="flex items-center gap-1.5"><Check size={13} className="text-[#10b981]" /> In-app calculator logger</li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div
                onClick={() => setChosenPlan('monthly')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  chosenPlan === 'monthly'
                    ? 'bg-[#ede9fe] border-2 border-[#6c5ce7] shadow-md shadow-[#6c5ce7]/15'
                    : 'bg-[#f8f6ff] border-[#e8e4f5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1f2430]">Pro Member</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6c5ce7] text-white font-mono font-bold">
                    $1.99 / mo
                  </span>
                </div>
                <ul className="text-[11px] text-[#64748b] space-y-1">
                  <li className="flex items-center gap-1.5"><Sparkles size={13} className="text-[#6c5ce7]" /> Unlimited daily logs</li>
                  <li className="flex items-center gap-1.5"><Sparkles size={13} className="text-[#6c5ce7]" /> Custom categories & icon maker</li>
                  <li className="flex items-center gap-1.5"><Sparkles size={13} className="text-[#6c5ce7]" /> Visual charts & CSV exports</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] text-xs font-bold text-[#64748b] transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white font-bold text-xs shadow-lg shadow-[#6c5ce7]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Budget Setup</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: BUDGET PERIOD & AMOUNT ================= */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center mx-auto shadow-xs">
                <Calculator size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1f2430]">Set Your Budget & Date Range</h2>
              <p className="text-xs text-[#64748b]">Select your duration and total target spend.</p>
            </div>

            {/* PRESET PERIOD BUTTONS */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Period Preset</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PERIOD_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                      periodType === p.id
                        ? 'bg-[#6c5ce7] text-white shadow-xs'
                        : 'bg-[#f8f6ff] text-[#64748b] border border-[#e8e4f5]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] outline-none focus:border-[#6c5ce7] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1">End Date ({days} days)</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] outline-none focus:border-[#6c5ce7] font-mono"
                />
              </div>
            </div>

            {/* TOTAL AMOUNT INPUT */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Total Budget Amount</label>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#e6f4f1] border border-[#c7ede4] text-[#0f766e]">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent font-bold text-sm outline-none text-[#0f766e] cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.symbol} value={c.symbol}>
                      {c.symbol} ({c.name})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  required
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-mono text-2xl sm:text-3xl font-extrabold text-[#0f766e]"
                />
              </div>
            </div>

            {/* LIVE DAILY ALLOWANCE CALCULATION CARD */}
            <div className="p-4 rounded-2xl bg-[#6c5ce7] text-white flex items-center justify-between shadow-lg shadow-[#6c5ce7]/20">
              <div>
                <p className="text-[10px] uppercase font-bold text-white/80 tracking-wider font-mono">
                  Your Safe Daily Allowance
                </p>
                <p className="text-2xl font-extrabold font-mono mt-0.5">
                  {currency}{dailyAllowance} <span className="text-xs font-normal text-white/80">/ day</span>
                </p>
              </div>
              <div className="text-right text-[11px] text-white/80 font-mono">
                <span>{days} total days</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] text-xs font-bold text-[#64748b] transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white font-bold text-xs shadow-lg shadow-[#6c5ce7]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Allocations</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CATEGORY ALLOCATIONS & FINISH ================= */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center mx-auto shadow-xs">
                <Layers size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1f2430]">Baseline Category Budgets</h2>
              <p className="text-xs text-[#64748b]">Set optional limits per category (you can adjust anytime).</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {[
                { id: 'rent', name: '🏠 Rent & Housing' },
                { id: 'groceries', name: '🍎 Groceries' },
                { id: 'dining', name: '🍣 Dining Out' },
                { id: 'healthcare', name: '❤️ Healthcare' },
                { id: 'entertainment', name: '🍺 Entertainment' },
                { id: 'transport', name: '🚗 Transport & Fuel' },
              ].map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] space-y-1">
                  <span className="text-xs font-bold text-[#1f2430] truncate block">{c.name}</span>
                  <div className="flex items-center gap-1 font-mono text-xs text-[#6c5ce7]">
                    <span>$</span>
                    <input
                      type="number"
                      value={categoryAllocations[c.id] || '0'}
                      onChange={(e) =>
                        setCategoryAllocations({
                          ...categoryAllocations,
                          [c.id]: e.target.value,
                        })
                      }
                      className="w-full bg-transparent border-none outline-none font-bold text-xs text-[#1f2430]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3 px-4 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] text-xs font-bold text-[#64748b] transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white font-bold text-xs shadow-lg shadow-[#6c5ce7]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>{chosenPlan === 'monthly' ? 'Proceed to Pro Checkout' : 'Finish & Enter Dashboard'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
