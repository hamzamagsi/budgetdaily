import { useMemo } from 'react'

const STATUS_COLOR = {
  safe: 'var(--color-safe)',
  warn: 'var(--color-warn)',
  over: 'var(--color-over)',
}

const STATUS_LABEL = {
  safe: "You're on track",
  warn: 'Slowing down',
  over: 'Over for today',
}

// A dial, not a bar chart — reads at a glance like a fuel gauge.
// Arc sweeps 220° (from -110° to +110°), fill proportional to leftToday / todaysAllowance.
export default function AllowanceGauge({ status, currency }) {
  const { leftToday, todaysAllowance, spentToday, status: level } = status

  const ratio = todaysAllowance > 0 ? Math.max(0, Math.min(1, leftToday / todaysAllowance)) : 0
  const color = STATUS_COLOR[level]

  const size = 280
  const stroke = 14
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2

  const startAngle = -200
  const sweepAngle = 220

  const trackPath = useMemo(() => describeArc(cx, cy, r, startAngle, startAngle + sweepAngle), [])
  const fillPath = useMemo(
    () => describeArc(cx, cy, r, startAngle, startAngle + sweepAngle * ratio),
    [ratio]
  )

  const displayAmount = level === 'over' ? Math.abs(leftToday) : leftToday

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`}>
        <path d={trackPath} fill="none" stroke="var(--color-line)" strokeWidth={stroke} strokeLinecap="round" />
        <path
          d={fillPath}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{ transition: 'stroke 400ms ease' }}
        />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="font-mono"
          style={{ fontSize: 44, fontWeight: 600, fill: 'var(--color-text)' }}
        >
          {level === 'over' ? '-' : ''}
          {currency}
          {formatAmount(displayAmount)}
        </text>
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          className="font-body"
          style={{ fontSize: 13, fill: 'var(--color-text-dim)', letterSpacing: '0.02em' }}
        >
          {level === 'over' ? 'over today' : 'left to spend today'}
        </text>
      </svg>

      <div className="mt-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        <span className="text-sm font-medium" style={{ color }}>
          {STATUS_LABEL[level]}
        </span>
      </div>

      <p className="mt-3 text-sm text-[var(--color-text-faint)] font-mono">
        {currency}
        {formatAmount(spentToday)} spent · {currency}
        {formatAmount(todaysAllowance)} allowance
      </p>
    </div>
  )
}

function formatAmount(n) {
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}
