import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { MessageSquare, Send, CheckCircle2, X, AlertCircle, Bug, Sparkles, Mail } from 'lucide-react'

export default function FeedbackModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const [type, setType] = useState('bug') // 'bug' | 'feature' | 'billing' | 'other'
  const [email, setEmail] = useState(user?.email || '')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    // Can dispatch mailto or store feedback locally
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setMessage('')
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#e8e4f5] animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#f8f6ff] hover:bg-[#ede9fe] text-[#64748b] hover:text-[#1f2430] transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="text-lg font-bold text-[#1f2430]">Feedback Received!</h3>
            <p className="text-xs text-[#64748b] max-w-xs mx-auto">
              Thank you for helping us improve BudgetDaily. Our team will review your report promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#f1edf9]">
              <div className="w-8 h-8 rounded-xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center font-bold">
                <Bug size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1f2430]">Support & Bug Report</h3>
                <p className="text-[10px] text-[#64748b]">We usually respond within 24 hours</p>
              </div>
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1.5">Topic</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bug', label: '🐛 Bug Report' },
                  { id: 'feature', label: '✨ Feature Request' },
                  { id: 'billing', label: '💳 Billing Help' },
                  { id: 'other', label: '💬 General Feedback' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      type === t.id
                        ? 'bg-[#ede9fe] text-[#6c5ce7] border border-[#ddd6fe]'
                        : 'bg-[#f8f6ff] text-[#64748b] border border-[#e8e4f5]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1">Your Email</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] outline-none focus:border-[#6c5ce7]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] mb-1">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe what happened or your suggestion..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] outline-none focus:border-[#6c5ce7] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold shadow-md shadow-[#6c5ce7]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send size={14} />
              <span>Submit to Support</span>
            </button>

            <div className="text-center">
              <a
                href="mailto:support@budgetdaily.app"
                className="text-[11px] text-[#6c5ce7] hover:underline"
              >
                Or email us directly at support@budgetdaily.app
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
