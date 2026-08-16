import { useState } from 'react'
import { Sparkles, AlertTriangle, CheckCircle2, Flame } from 'lucide-react'

const STATUS_CONFIG = {
  safe: {
    label: 'On Track',
    subtext: 'Safe to spend',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.3)',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    icon: CheckCircle2,
  },
  warn: {
    label: 'Slowing Down',
    subtext: 'Approaching daily limit',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.3)',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    icon: AlertTriangle,
  },
  over: {
    label: 'Over Budget',
    subtext: 'Shrinks tomorrow allowance',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.35)',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    icon: Flame,
  },
}

export default function AllowanceGauge({ status, currency = '$' }) {
  const [viewMode, setViewMode] = useState('remaining') // 'remaining' | 'spent'
  const { leftToday, todaysAllowance, spentToday, status: level } = status

  // Exact mathematically-sound ratio calculation (0.0 to 1.0)
  const safeAllowance = Number(todaysAllowance) > 0 ? Number(todaysAllowance) : 1
  const remainingRatio = todaysAllowance > 0
    ? Math.max(0, Math.min(1, leftToday / safeAllowance))
    : 0
  const spentRatio = todaysAllowance > 0
    ? Math.min(1, Math.max(0, spentToday / safeAllowance))
    : (spentToday > 0 ? 1 : 0)

  const activeRatio = viewMode === 'remaining' ? remainingRatio : spentRatio
  const currentConfig = STATUS_CONFIG[level] || STATUS_CONFIG.safe
  const StatusIcon = currentConfig.icon

  // SVG Semi-Circle Dimensions
  const width = 300
  const height = 180
  const cx = 150
  const cy = 150
  const r = 110
  const strokeWidth = 16

  // Exact arc length for 180-degree semicircle = PI * r
  const arcLength = Math.PI * r // ~345.57
  const strokeDashoffset = arcLength * (1 - activeRatio)

  const displayRemaining = level === 'over' ? Math.abs(leftToday) : leftToday
  const pctDisplay = viewMode === 'remaining'
    ? Math.round(remainingRatio * 100)
    : Math.round((spentToday / (todaysAllowance || 1)) * 100)

  return (
    <div className="flex flex-col items-center w-full select-none">
      {/* View mode toggle pill */}
      <div className="flex items-center gap-1 bg-[#121927] p-1 rounded-full border border-[var(--color-line)] mb-4 text-xs">
        <button
          type="button"
          onClick={() => setViewMode('remaining')}
          className={`px-3 py-1 rounded-full transition-all font-medium ${
            viewMode === 'remaining'
              ? 'bg-[var(--color-panel-elevated)] text-[var(--color-text)] shadow-sm'
              : 'text-[var(--color-text-dim)] hover:text-white'
          }`}
        >
          Allowance Left
        </button>
        <button
          type="button"
          onClick={() => setViewMode('spent')}
          className={`px-3 py-1 rounded-full transition-all font-medium ${
            viewMode === 'spent'
              ? 'bg-[var(--color-panel-elevated)] text-[var(--color-text)] shadow-sm'
              : 'text-[var(--color-text-dim)] hover:text-white'
          }`}
        >
          Spent Today
        </button>
      </div>

      {/* SVG Instrument Dial */}
      <div className="relative flex items-center justify-center">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          <defs>
            {/* Safe Gradient */}
            <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            {/* Warning Gradient */}
            <linearGradient id="warnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            {/* Overspent Gradient */}
            <linearGradient id="overGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            {/* Subtle glow filter */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc (180° Left to Right) */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="var(--color-line-subtle)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Scale Tick Marks */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const angle = Math.PI * (1 - pct) // From PI (left) to 0 (right)
            const tickR1 = r - 16
            const tickR2 = r - 24
            const x1 = cx + tickR1 * Math.cos(angle)
            const y1 = cy - tickR1 * Math.sin(angle)
            const x2 = cx + tickR2 * Math.cos(angle)
            const y2 = cy - tickR2 * Math.sin(angle)
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={pct === 0.5 ? 2 : 1.5}
                strokeLinecap="round"
              />
            )
          })}

          {/* Active Progress Arc (Exact 0% to 100% math with strokeDasharray) */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={
              level === 'over'
                ? 'url(#overGradient)'
                : level === 'warn'
                ? 'url(#warnGradient)'
                : 'url(#safeGradient)'
            }
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#gaugeGlow)"
            style={{
              transition: 'stroke-dashoffset 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </svg>

        {/* Center Numbers & Readout */}
        <div className="absolute inset-x-0 bottom-2 flex flex-col items-center text-center">
          <div className="flex items-baseline justify-center font-mono">
            {level === 'over' && (
              <span className="text-2xl font-bold text-[var(--color-over)] mr-1">-</span>
            )}
            <span className="text-2xl font-medium text-[var(--color-text-dim)] mr-1">{currency}</span>
            <span
              className="text-4xl sm:text-5xl font-bold tracking-tight"
              style={{
                color: level === 'over' ? 'var(--color-over)' : 'var(--color-text)',
              }}
            >
              {formatAmount(displayRemaining)}
            </span>
          </div>

          <p className="text-xs font-medium text-[var(--color-text-dim)] mt-1 flex items-center gap-1.5">
            {viewMode === 'remaining' ? (
              level === 'over' ? (
                <span className="text-[var(--color-over)] font-semibold">Over daily allowance</span>
              ) : (
                <>
                  <span>Available to spend today</span>
                  <span className="text-[var(--color-text-faint)]">({pctDisplay}%)</span>
                </>
              )
            ) : (
              <span>Total spent today ({pctDisplay}%)</span>
            )}
          </p>
        </div>
      </div>

      {/* Dynamic Status Badge */}
      <div
        className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all"
        style={{
          background: currentConfig.bgColor,
          borderColor: currentConfig.borderColor,
          color: currentConfig.color,
          boxShadow: `0 0 16px ${currentConfig.glow}`,
        }}
      >
        <StatusIcon size={14} className={level === 'over' ? 'animate-pulse' : ''} />
        <span>{currentConfig.label}</span>
        <span className="opacity-60">·</span>
        <span className="opacity-80">{currentConfig.subtext}</span>
      </div>

      {/* Detailed Breakdown Bar */}
      <div className="grid grid-cols-2 gap-4 w-full mt-5 pt-4 border-t border-[var(--color-line-subtle)] text-center">
        <div className="flex flex-col">
          <span className="text-[11px] text-[var(--color-text-faint)] uppercase tracking-wider font-mono">
            Spent Today
          </span>
          <span className="font-mono text-sm font-semibold text-[var(--color-text)] mt-0.5">
            {currency}
            {formatAmount(spentToday)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[var(--color-text-faint)] uppercase tracking-wider font-mono">
            Daily Allowance
          </span>
          <span className="font-mono text-sm font-semibold text-[var(--color-safe)] mt-0.5">
            {currency}
            {formatAmount(todaysAllowance)}
          </span>
        </div>
      </div>
    </div>
  )
}

function formatAmount(n) {
  const num = Number(n) || 0
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
