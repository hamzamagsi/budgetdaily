import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, DollarSign, Scale } from 'lucide-react'

export default function TermsOfService() {
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
            <FileText size={14} />
            <span>Terms of Service</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1f2430]">
            Terms of Service
          </h1>
          <p className="text-xs text-[#94a3b8] font-mono">
            Last Updated: August 18, 2024 · Effective Immediately
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#475569] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1f2430] flex items-center gap-2">
              <Scale size={18} className="text-[#6c5ce7]" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p>
              By accessing or using <strong>BudgetDaily</strong> (the "Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1f2430] flex items-center gap-2">
              <DollarSign size={18} className="text-[#6c5ce7]" />
              <span>2. Subscriptions, Billing & Cancellations</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Billing Gateway:</strong> All paid subscriptions ($1.99/mo, $9.99/6mo, $19.99/yr, $100 Lifetime) are processed through Polar.sh as the Merchant of Record.</li>
              <li><strong>Self-Serve Cancellation:</strong> You may cancel or manage your active subscription at any time through the Polar Customer Portal (<a href="https://polar.sh/purchases" target="_blank" rel="noopener noreferrer" className="text-[#6c5ce7] underline">polar.sh/purchases</a>) or via Settings.</li>
              <li><strong>Refund Policy:</strong> If you are unsatisfied with your subscription within 14 days of initial purchase, contact support@budgetdaily.app for a full refund.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1f2430] flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#6c5ce7]" />
              <span>3. User Accounts & Acceptable Use</span>
            </h2>
            <p>
              You are responsible for maintaining the security of your account login. You agree not to reverse engineer, disrupt, or exploit the service, or use it for any illegal financial activities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#1f2430] flex items-center gap-2">
              <AlertCircle size={18} className="text-[#6c5ce7]" />
              <span>4. Disclaimer of Financial Advice</span>
            </h2>
            <p>
              BudgetDaily is a personal budgeting and daily allowance calculation tool. It does not provide certified financial, legal, or investment advice. Always consult a qualified professional for major investment or tax decisions.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-[#f1edf9]">
            <h2 className="text-base font-bold text-[#1f2430]">5. Contact Us</h2>
            <p className="text-xs sm:text-sm">
              For legal inquiries or terms questions, contact{' '}
              <a href="mailto:support@budgetdaily.app" className="text-[#6c5ce7] font-semibold underline">
                support@budgetdaily.app
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
