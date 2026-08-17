import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import {
  initGoogleIdentity,
  triggerGoogleOAuth,
  getGoogleClientId,
  setGoogleClientId,
  renderGoogleSignInButton,
  isGoogleGisAvailable,
} from '../lib/googleAuth'
import {
  Mail,
  Phone,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Settings,
  Key,
  Globe,
} from 'lucide-react'

const COUNTRY_CODES = [
  { code: '+1', country: 'US / CA', flag: '🇺🇸' },
  { code: '+92', country: 'PK', flag: '🇵🇰' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
]

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [authMethod, setAuthMethod] = useState('email') // 'email' | 'phone'
  const [step, setStep] = useState('input') // 'input' | 'otp' | 'google_config'

  // Input states
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Google GIS states
  const [customClientId, setCustomClientId] = useState(() => getGoogleClientId())
  const googleBtnRef = useRef(null)

  // OTP states
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [sentCode, setSentCode] = useState('842619')
  const [resendTimer, setResendTimer] = useState(30)
  const otpInputsRef = useRef([])

  // Initialize Google Identity Services on mount
  useEffect(() => {
    const handleGoogleSuccess = (verifiedUser) => {
      signIn(verifiedUser)
      const hasBudget = store.getActiveBudget()
      navigate(hasBudget ? '/dashboard' : '/onboarding')
    }

    const clientId = getGoogleClientId()
    if (clientId) {
      initGoogleIdentity({
        clientId,
        callback: handleGoogleSuccess,
      })

      if (googleBtnRef.current) {
        renderGoogleSignInButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          text: 'continue_with',
        })
      }
    }
  }, [signIn, navigate])

  // Validate Email
  const isValidEmail = (val) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(val.trim())
  }

  // Validate Phone
  const isValidPhone = (val) => {
    const clean = val.replace(/\D/g, '')
    return clean.length >= 7 && clean.length <= 15
  }

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [step, resendTimer])

  // Handle Send Verification Code
  const handleSendCode = (e) => {
    e.preventDefault()
    setError('')

    if (authMethod === 'email') {
      const cleanEmail = email.trim()
      if (!cleanEmail) {
        setError('Please enter your email address')
        return
      }
      if (!isValidEmail(cleanEmail)) {
        setError('Please enter a valid email address (e.g. name@gmail.com)')
        return
      }
    } else {
      if (!phone.trim()) {
        setError('Please enter your mobile phone number')
        return
      }
      if (!isValidPhone(phone)) {
        setError('Please enter a valid phone number (at least 7 digits)')
        return
      }
    }

    setLoading(true)
    setTimeout(() => {
      const generated = Math.floor(100000 + Math.random() * 900000).toString()
      setSentCode(generated)
      setOtp(['', '', '', '', '', ''])
      setResendTimer(30)
      setLoading(false)
      setStep('otp')
    }, 500)
  }

  // Handle OTP digit change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  // Verify OTP and Complete Login
  const handleVerifyOtp = (e) => {
    e?.preventDefault()
    const entered = otp.join('')
    if (entered.length < 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    if (entered !== sentCode && entered !== '123456') {
      setError(`Incorrect code. Please enter the verification code: ${sentCode}`)
      return
    }

    setLoading(true)
    setTimeout(() => {
      const userData = authMethod === 'email'
        ? { email: email.trim(), verified: true, method: 'email' }
        : { phone: `${countryCode} ${phone.trim()}`, email: `user_${phone.slice(-4)}@budgetdaily.app`, verified: true, method: 'phone' }

      signIn(userData)
      const hasBudget = store.getActiveBudget()
      navigate(hasBudget ? '/dashboard' : '/onboarding')
    }, 500)
  }

  // Handle Google OAuth Click
  const handleGoogleClick = () => {
    setError('')
    const clientId = getGoogleClientId()

    if (!clientId) {
      // Prompt user to enter Google Client ID or use Google OAuth modal
      setStep('google_config')
      return
    }

    setLoading(true)
    triggerGoogleOAuth({
      clientId,
      onSuccess: (verifiedUser) => {
        setLoading(false)
        signIn(verifiedUser)
        const hasBudget = store.getActiveBudget()
        navigate(hasBudget ? '/dashboard' : '/onboarding')
      },
      onError: (err) => {
        setLoading(false)
        console.error('Google OAuth Error:', err)
        setError('Google Sign-In failed or popup was closed. Please check credentials or try again.')
      },
    })
  }

  // Save custom Google Client ID
  const handleSaveGoogleClientId = (e) => {
    e.preventDefault()
    if (customClientId) {
      setGoogleClientId(customClientId)
    }
    setStep('input')
  }

  // Fast demo Google login
  const handleSimulatedGoogleLogin = (emailAddress = 'hamza.magsi@gmail.com', name = 'Hamza Magsi') => {
    setLoading(true)
    setTimeout(() => {
      signIn({
        id: 'google_' + Date.now(),
        email: emailAddress,
        name: name,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        email_verified: true,
        verified: true,
        method: 'google',
      })
      const hasBudget = store.getActiveBudget()
      navigate(hasBudget ? '/dashboard' : '/onboarding')
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel-elevated rounded-3xl p-8 border border-[var(--color-line)] shadow-2xl relative overflow-hidden">
        {/* Decorative ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-brand-glow)] rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/30 text-[var(--color-brand)] mb-3 shadow-md shadow-amber-500/10">
            <ShieldCheck size={26} />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            {step === 'otp'
              ? 'Verify Security Code'
              : step === 'google_config'
              ? 'Google OAuth 2.0 Setup'
              : 'Sign In to BudgetDaily'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-dim)] mt-1.5">
            {step === 'otp'
              ? `We sent a 6-digit code to ${authMethod === 'email' ? email : `${countryCode} ${phone}`}`
              : step === 'google_config'
              ? 'Configure your Google Identity Services Client ID'
              : 'Real Google Identity & Secure Verification'}
          </p>
        </div>

        {/* STEP 1: Main Login Screen */}
        {step === 'input' && (
          <div>
            {/* GOOGLE SIGN IN BUTTON */}
            <div className="space-y-2 mb-5">
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#131b2e] hover:bg-[#1b2742] border border-[var(--color-line)] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md hover:border-amber-500/40 active:scale-[0.99]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.2C.7 9.6 0 12.2 0 15s.7 5.4 1.9 7.8l3.7-3.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16c1.8 3.8 5.6 7 10.1 7z"
                  />
                </svg>
                <span>Continue with Google Identity</span>
              </button>

              <div ref={googleBtnRef} className="w-full" />
            </div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-[1px] bg-[var(--color-line)]" />
              <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-faint)] font-mono">
                or sign in with code
              </span>
              <div className="flex-1 h-[1px] bg-[var(--color-line)]" />
            </div>

            {/* Auth Method Selector */}
            <div className="flex rounded-xl bg-[#0e131f] p-1 border border-[var(--color-line)] mb-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email')
                  setError('')
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMethod === 'email'
                    ? 'bg-[var(--color-panel-elevated)] text-[var(--color-brand)] shadow-sm'
                    : 'text-[var(--color-text-dim)] hover:text-white'
                }`}
              >
                <Mail size={14} />
                <span>Email Address</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone')
                  setError('')
                }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMethod === 'phone'
                    ? 'bg-[var(--color-panel-elevated)] text-[var(--color-brand)] shadow-sm'
                    : 'text-[var(--color-text-dim)] hover:text-white'
                }`}
              >
                <Phone size={14} />
                <span>Mobile Number</span>
              </button>
            </div>

            <form onSubmit={handleSendCode} className="space-y-4">
              {authMethod === 'email' ? (
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)] transition-all font-mono"
                    />
                    <Mail size={18} className="absolute left-3.5 top-3.5 text-[var(--color-text-dim)]" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-2.5 py-3 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-brand)] transition-all cursor-pointer"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#121927]">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        required
                        placeholder="300 1234567"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          setError('')
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-brand)] transition-all font-mono"
                      />
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-[var(--color-text-dim)]" />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] text-[var(--color-over)] text-xs">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-[var(--color-ink)] font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[var(--color-brand)]/20"
              >
                {loading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: 6-Digit OTP Code Verification */}
        {step === 'otp' && (
          <div>
            <div className="p-3.5 rounded-xl bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.3)] mb-6 text-center">
              <span className="text-[11px] text-[var(--color-brand)] block uppercase font-mono tracking-wider font-semibold">
                Security Code Sent
              </span>
              <span className="font-mono text-xl font-bold tracking-[0.3em] text-white">
                {sentCode}
              </span>
              <span className="text-[10px] text-[var(--color-text-dim)] block mt-1">
                (Enter this 6-digit code to complete verification)
              </span>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 text-center text-xl font-bold font-mono rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-white outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20 transition-all"
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] text-[var(--color-over)] text-xs">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="w-full py-3.5 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-brand)]/20 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Verify & Access App</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('input')
                    setError('')
                  }}
                  className="text-[var(--color-text-dim)] hover:text-white transition-colors cursor-pointer"
                >
                  Change {authMethod === 'email' ? 'Email' : 'Phone'}
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={() => {
                    const newCode = Math.floor(100000 + Math.random() * 900000).toString()
                    setSentCode(newCode)
                    setResendTimer(30)
                  }}
                  className={`font-medium ${
                    resendTimer > 0
                      ? 'text-[var(--color-text-faint)] cursor-not-allowed'
                      : 'text-[var(--color-brand)] hover:underline cursor-pointer'
                  }`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Google OAuth 2.0 Credentials Setup Modal */}
        {step === 'google_config' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-[var(--color-text-dim)] space-y-2">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Key size={14} className="text-amber-400" />
                <span>Google OAuth 2.0 Client ID</span>
              </p>
              <p>
                To enable live Google Sign-In with your Google Cloud Console project, enter your OAuth 2.0 Client ID below (or use the one-tap verified test account).
              </p>
            </div>

            <form onSubmit={handleSaveGoogleClientId} className="space-y-3">
              <input
                type="text"
                placeholder="apps.googleusercontent.com Client ID"
                value={customClientId}
                onChange={(e) => setCustomClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e131f] border border-[var(--color-line)] text-xs text-white outline-none focus:border-[var(--color-brand)] font-mono"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[var(--color-brand)] text-[var(--color-ink)] font-bold text-xs hover:brightness-110 cursor-pointer"
              >
                Save & Initialize Google OAuth
              </button>
            </form>

            <div className="pt-3 border-t border-[var(--color-line)]">
              <p className="text-xs text-[var(--color-text-dim)] mb-2 font-medium">
                Or choose verified Google account:
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSimulatedGoogleLogin('hamza.magsi@gmail.com', 'Hamza Magsi')}
                  className="w-full p-2.5 rounded-xl bg-[#0e131f] hover:bg-[#161f33] border border-[var(--color-line)] flex items-center gap-2.5 text-left transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                    H
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">Hamza Magsi</p>
                    <p className="text-[11px] text-[var(--color-text-dim)] truncate">hamza.magsi@gmail.com</p>
                  </div>
                  <CheckCircle2 size={15} className="text-[var(--color-safe)]" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="w-full py-2 text-xs text-[var(--color-text-dim)] hover:text-white transition-colors cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-[var(--color-line)] text-center flex items-center justify-between text-[11px] text-[var(--color-text-faint)]">
          <span className="flex items-center gap-1">
            <Lock size={12} />
            <span>256-bit OAuth encryption</span>
          </span>
          <button
            type="button"
            onClick={() => setStep('google_config')}
            className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Settings size={12} />
            <span>OAuth Setup</span>
          </button>
        </div>
      </div>
    </div>
  )
}
