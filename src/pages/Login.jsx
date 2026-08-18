import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { store } from '../lib/store'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import {
  triggerGoogleOAuth,
  getGoogleClientId,
} from '../lib/googleAuth'
import { redirectToPolarCheckout } from '../lib/polar'
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Inbox,
} from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn } = useAuth()

  const redirectTarget = searchParams.get('redirect')
  const planTarget = searchParams.get('plan')

  const [step, setStep] = useState('input') // 'input' | 'otp'

  // Input states
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // OTP states
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const otpInputsRef = useRef([])

  const handlePostAuthRedirect = (userData) => {
    if (redirectTarget === 'subscribe') {
      redirectToPolarCheckout({ planId: planTarget || 'monthly', email: userData.email })
      return
    }
    const hasBudget = store.getActiveBudget()
    navigate(hasBudget ? '/dashboard' : '/onboarding')
  }

  // Check for existing Supabase session on mount
  useEffect(() => {
    async function checkExistingSession() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession()
        if (data?.session?.user) {
          const u = data.session.user
          const userObj = signIn({
            id: u.id,
            email: u.email,
            name: u.user_metadata?.full_name || u.email?.split('@')[0],
            verified: true,
            method: 'supabase',
          })
          handlePostAuthRedirect(userObj)
        }
      }
    }
    checkExistingSession()
  }, [])

  // Validate Email Regex
  const isValidEmail = (val) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(val.trim())
  }

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [step, resendTimer])

  // STRICT SUPABASE OTP SEND HANDLER (NO FAKE CODES)
  const handleSendCode = async (e) => {
    e?.preventDefault()
    setError('')

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      setError('Please enter your email address')
      return
    }
    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@gmail.com)')
      return
    }

    setLoading(true)

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      setError('Authentication server is connecting. Please try again.')
      return
    }

    try {
      const { error: sbErr } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
        },
      })

      if (sbErr) {
        setLoading(false)
        setError(sbErr.message || 'Could not send verification code. Please check your email address.')
        return
      }

      // Success: Supabase sent real email
      setOtp(['', '', '', '', '', ''])
      setResendTimer(60)
      setLoading(false)
      setStep('otp')
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Failed to send verification code. Please try again.')
    }
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

  // STRICT SUPABASE OTP VERIFICATION HANDLER
  const handleVerifyOtp = async (e) => {
    e?.preventDefault()
    setError('')
    const entered = otp.join('')
    if (entered.length < 6) {
      setError('Please enter the complete 6-digit code sent to your email')
      return
    }

    setLoading(true)

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      setError('Authentication service error. Please try again.')
      return
    }

    try {
      const { data, error: sbErr } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: entered,
        type: 'email',
      })

      if (sbErr || !data?.user) {
        setLoading(false)
        setError(sbErr?.message || 'Invalid or expired verification code. Please check your inbox.')
        return
      }

      const sbUser = data.user
      const userData = {
        id: sbUser.id,
        email: sbUser.email,
        name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0],
        verified: true,
        method: 'supabase_email',
      }

      const userObj = signIn(userData)
      handlePostAuthRedirect(userObj)
    } catch (err) {
      setLoading(false)
      setError(err?.message || 'Verification failed. Please try again.')
    }
  }

  // Handle Google Sign-In in ALL browsers
  const handleGoogleClick = async () => {
    setError('')
    setLoading(true)

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: oauthErr } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        })
        if (!oauthErr) return
      } catch (err) {
        console.warn('Supabase OAuth note:', err)
      }
    }

    const clientId = getGoogleClientId()
    if (clientId) {
      triggerGoogleOAuth({
        clientId,
        onSuccess: (verifiedUser) => {
          setLoading(false)
          const userObj = signIn(verifiedUser)
          handlePostAuthRedirect(userObj)
        },
        onError: (err) => {
          setLoading(false)
          setError('Google sign-in could not be completed. Please use Email verification.')
        },
      })
      return
    }

    setLoading(false)
    setError('Google sign-in service unavailable. Please sign in with your email.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f3f0ff]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#e8e4f5] shadow-2xl relative overflow-hidden">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#6c5ce7] mb-3 shadow-md shadow-[#6c5ce7]/15">
            <ShieldCheck size={26} />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#1f2430]">
            {step === 'otp' ? 'Enter Verification Code' : 'Sign In to BudgetDaily'}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1.5">
            {step === 'otp'
              ? `Enter the 6-digit code sent to ${email}`
              : 'Secure verification via Supabase & Google'}
          </p>
        </div>

        {/* STEP 1: Main Login Screen */}
        {step === 'input' && (
          <div className="space-y-4">
            {/* GOOGLE SIGN IN BUTTON */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#f8f6ff] hover:bg-[#ede9fe] border border-[#e8e4f5] text-[#1f2430] text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
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
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-[#f1edf9]" />
              <span className="text-[11px] uppercase tracking-wider text-[#94a3b8] font-mono">
                or with email code
              </span>
              <div className="flex-1 h-[1px] bg-[#f1edf9]" />
            </div>

            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748b] mb-1.5">
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
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] text-sm text-[#1f2430] outline-none focus:border-[#6c5ce7] transition-all font-mono"
                  />
                  <Mail size={18} className="absolute left-3.5 top-3.5 text-[#94a3b8]" />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white font-bold text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#6c5ce7]/25"
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

        {/* STEP 2: 6-Digit Real Supabase OTP Code Verification */}
        {step === 'otp' && (
          <div>
            <div className="p-4 rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] mb-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#6c5ce7] flex items-center justify-center mx-auto">
                <Inbox size={20} />
              </div>
              <p className="text-xs font-bold text-[#1f2430]">
                Check Your Email Inbox
              </p>
              <p className="text-[11px] text-[#64748b] leading-relaxed">
                We sent a 6-digit security code to <strong className="text-[#1f2430]">{email}</strong>. Enter it below to sign in.
              </p>
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
                    className="w-11 h-13 text-center text-xl font-bold font-mono rounded-2xl bg-[#f8f6ff] border border-[#e8e4f5] text-[#1f2430] outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/20 transition-all"
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="w-full py-3.5 rounded-2xl bg-[#6c5ce7] hover:bg-[#5849cf] text-white font-bold text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#6c5ce7]/25 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Verify & Continue</span>
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
                  className="text-[#64748b] hover:text-[#1f2430] transition-colors cursor-pointer"
                >
                  Change Email
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0}
                  onClick={handleSendCode}
                  className={`font-semibold ${
                    resendTimer > 0
                      ? 'text-[#94a3b8] cursor-not-allowed'
                      : 'text-[#6c5ce7] hover:underline cursor-pointer'
                  }`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-[#f1edf9] text-center flex items-center justify-center text-[11px] text-[#94a3b8]">
          <span className="flex items-center gap-1">
            <Lock size={12} />
            <span>256-bit Supabase & OAuth 2.0 Encrypted</span>
          </span>
        </div>
      </div>
    </div>
  )
}
