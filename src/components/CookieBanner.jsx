import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, Check, X, Shield } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('bd_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = (choice) => {
    localStorage.setItem('bd_cookie_consent', choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="p-5 rounded-3xl bg-white border border-[#e8e4f5] shadow-2xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center shrink-0">
            <Cookie size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#1f2430]">We value your privacy</h4>
            <p className="text-[11px] text-[#64748b] leading-relaxed">
              We use essential cookies to keep you signed in and ensure security. We never sell your data.{' '}
              <Link to="/privacy" className="text-[#6c5ce7] font-semibold underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleAccept('essential')}
            className="flex-1 py-2 px-3 rounded-xl bg-[#f8f6ff] hover:bg-[#ede9fe] text-[#64748b] text-xs font-semibold transition-colors cursor-pointer text-center"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => handleAccept('all')}
            className="flex-1 py-2 px-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white text-xs font-bold transition-all shadow-md shadow-[#6c5ce7]/20 cursor-pointer text-center"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
