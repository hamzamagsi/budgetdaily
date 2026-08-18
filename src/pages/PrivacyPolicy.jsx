import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, Database, Globe } from 'lucide-react'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f3f0ff] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#e8e4f5] space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#f1edf9]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#6c5ce7] hover:opacity-80 transition-opacity cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#6c5ce7] bg-[#ede9fe] px-3 py-1 rounded-full">
            <Shield size={14} />
            <span>GDPR & CCPA Compliant</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1f2430]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#94a3b8] font-mono">
            Last Updated: August 18, 2024 · Effective Immediately
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#475569] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1f2430] flex items-center gap-2">
              <Eye size={18} className="text-[#6c5ce7]" />
              <span>1. Overview & Our Privacy Philosophy</span>
            </h2>
            <p>
              At <strong>BudgetDaily</strong> ("we", "our", or "us"), your financial privacy is our highest priority. We do not sell your personal financial data, transactions, or email address to third-party data brokers or advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1f2430] flex items-center gap-2">
              <Database size={18} className="text-[#6c5ce7]" />
              <span>2. Information We Collect</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Account Credentials:</strong> Email address and verified authentication ID via Google OAuth or Supabase Auth.</li>
              <li><strong>Financial Logs:</strong> Expense amounts, category allocations, wallet balances, and optional transaction notes entered by you.</li>
              <li><strong>Payment Metadata:</strong> When subscribing via Polar.sh, payment processing is handled directly by Polar.sh. We only receive confirmation tokens and active subscription status — we never store your raw credit card numbers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1f2430] flex items-center gap-2">
              <Lock size={18} className="text-[#6c5ce7]" />
              <span>3. Data Security & Encryption</span>
            </h2>
            <p>
              All communications between your device and BudgetDaily are encrypted using 256-bit TLS (Transport Layer Security). Supabase databases enforce strict Row Level Security (RLS), ensuring that only you can read and write your personal budget records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1f2430] flex items-center gap-2">
              <Globe size={18} className="text-[#6c5ce7]" />
              <span>4. Your Rights (GDPR & CCPA)</span>
            </h2>
            <p>You maintain full ownership of your data at all times. You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Export:</strong> Download a full CSV export of your financial records anytime from the Settings page.</li>
              <li><strong>Delete:</strong> Request complete permanent deletion of your account and all associated transactions.</li>
              <li><strong>Revoke:</strong> Cancel your subscription anytime via Polar.sh or revoke OAuth access.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-[#f1edf9]">
            <h2 className="text-base font-bold text-[#1f2430]">5. Contact Our Privacy Team</h2>
            <p className="text-xs sm:text-sm">
              If you have any questions or requests regarding your data, reach out to our privacy officer at{' '}
              <a href="mailto:privacy@budgetdaily.app" className="text-[#6c5ce7] font-semibold underline">
                privacy@budgetdaily.app
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
