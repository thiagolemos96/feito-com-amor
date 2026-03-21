import { useId } from 'react'
import type { ReactNode } from 'react'

// ─── BADGE ────────────────────────────────────────────────────────
type BadgeVariant = 'green' | 'yellow' | 'red'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

const badgeDot: Record<BadgeVariant, string> = {
  green: 'bg-success',
  yellow: 'bg-warning',
  red: 'bg-danger',
}
const badgeBg: Record<BadgeVariant, string> = {
  green: 'bg-success/10 text-success',
  yellow: 'bg-warning/15 text-warning',
  red: 'bg-danger/10 text-danger',
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[12px] font-medium ${badgeBg[variant]}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badgeDot[variant]}`} />
      {children}
    </span>
  )
}

// ─── SPARKLINE ────────────────────────────────────────────────────
interface SparklineProps {
  data: number[]
  color?: string
  fill?: boolean
  width?: number
  height?: number
}

export function Sparkline({ data, color = 'currentColor', fill = false, width = 100, height = 40 }: SparklineProps) {
  const uid = useId()
  const gradId = `sg${uid.replace(/:/g, '')}`
  if (data.length < 2) return null
  const max = Math.max(...data, 1)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 6) - 3
    return [x, y] as [number, number]
  })
  const polylinePoints = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const [lastX, lastY] = pts[pts.length - 1]
  const [firstX, firstY] = pts[0]
  const areaPath = `M${firstX},${firstY} ` +
    pts.slice(1).map(([x, y]) => `L${x},${y}`).join(' ') +
    ` L${width},${height} L0,${height} Z`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {fill && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={areaPath} fill={`url(#${gradId})`} />}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={3} fill={color} />
    </svg>
  )
}

// ─── BUTTON ───────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'edit'

interface ButtonProps {
  variant?: ButtonVariant
  onClick?: () => void
  children: ReactNode
  style?: React.CSSProperties
  disabled?: boolean
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent2',
  ghost: 'bg-transparent text-muted border border-border hover:bg-surface2',
  danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20',
  edit: 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20',
}

export function Button({ variant = 'ghost', onClick, children, style, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`inline-flex items-center gap-1.5 px-[18px] py-[9px] rounded-lg font-body text-[13.5px] font-medium transition-all duration-150 cursor-pointer border-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${buttonVariants[variant]}`}
    >
      {children}
    </button>
  )
}

// ─── STAT CARD ────────────────────────────────────────────────────
type AccentColor = 'default' | 'green' | 'yellow' | 'red'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: AccentColor
  sparkline?: ReactNode
}

const accentHover: Record<AccentColor, string> = {
  default: 'hover:border-accent',
  green: 'hover:border-success',
  yellow: 'hover:border-warning',
  red: 'hover:border-danger',
}

export function StatCard({ label, value, sub, accent = 'default', sparkline }: StatCardProps) {
  return (
    <div className={`bg-surface border-2 border-border rounded-[14px] p-[22px] transition-colors duration-150 relative overflow-hidden ${accentHover[accent]}`}>
      {sparkline && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none opacity-80">
          {sparkline}
        </div>
      )}
      <div className="relative z-10">
        <div className="text-[12px] text-muted font-semibold">{label}</div>
        <div className="font-body text-2xl font-bold mt-2 text-text">{value}</div>
        {sub && <div className="text-[12px] text-muted mt-1">{sub}</div>}
      </div>
    </div>
  )
}

// ─── HERO STAT CARD ───────────────────────────────────────────────
interface HeroStatCardProps {
  label: string
  value: string
  sub?: string
  sparkline?: ReactNode
}

export function HeroStatCard({ label, value, sub, sparkline }: HeroStatCardProps) {
  return (
    <div className="bg-accent rounded-[14px] p-8 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10) 0%, transparent 60%)' }}
      />
      {sparkline && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
          {sparkline}
        </div>
      )}
      <div className="relative z-10">
        <div className="text-[12px] text-white/70 font-semibold mb-2.5">{label}</div>
        <div className="font-body text-[42px] font-extrabold text-white leading-none">{value}</div>
        {sub && <div className="text-[13px] text-white/65 mt-2.5">{sub}</div>}
      </div>
    </div>
  )
}

// ─── MODAL ────────────────────────────────────────────────────────
interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  width?: number
  disableOutsideClick?: boolean
}

export function Modal({ title, onClose, children, width = 520, disableOutsideClick }: ModalProps) {
  return (
    <div
      onClick={disableOutsideClick ? undefined : onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-surface rounded-[14px] p-8 max-h-[90vh] overflow-y-auto relative w-full"
        style={{ maxWidth: width }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-transparent border-none text-[20px] cursor-pointer text-muted flex items-center justify-center hover:text-text transition-colors duration-150"
          title="Fechar"
        >
          ✕
        </button>
        <h3 className="font-body text-[20px] font-bold text-text mb-6 pr-8">{title}</h3>
        {children}
      </div>
    </div>
  )
}

// ─── FORM FIELD ───────────────────────────────────────────────────
interface FormFieldProps {
  label: string
  children: ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-muted mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass = 'w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg font-body text-[14px] text-text outline-none focus:border-accent transition-colors duration-150'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} {...props} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={`${inputClass} appearance-none pr-9 cursor-pointer`} {...props} />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        <ion-icon name="chevron-down-outline" style={{ fontSize: 14 }} />
      </span>
    </div>
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputClass} resize-none`} {...props} />
}

// ─── PAGE HEADER ──────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-[28px] font-bold text-text">{title}</h2>
      {subtitle && <p className="text-muted text-[14px] mt-1">{subtitle}</p>}
    </div>
  )
}

// ─── TABLE CARD ───────────────────────────────────────────────────
interface TableCardProps {
  title?: ReactNode
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export function TableCard({ title, subtitle, action, children }: TableCardProps) {
  return (
    <div className="bg-surface border border-border rounded-[14px] overflow-hidden">
      {(title || action) && (
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            {title && <h3 className="font-body text-[15px] font-semibold text-text">{title}</h3>}
            {subtitle && <p className="font-body text-[12px] text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

// ─── TOAST ────────────────────────────────────────────────────────

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error'
  subtitle?: string
  exiting?: boolean
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {toasts.map(t => {
        const ok = t.type === 'success'
        return (
          <div
            key={t.id}
            className={t.exiting ? '' : 'toast-enter'}
            style={{
              pointerEvents: 'all',
              background: ok ? 'var(--color-toast-success-bg)' : 'var(--color-toast-error-bg)',
              border: `1px solid ${ok ? 'var(--color-toast-success-border)' : 'var(--color-toast-error-border)'}`,
              borderRadius: 10,
              padding: '12px 16px',
              width: 280,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              opacity: t.exiting ? 0 : 1,
              transform: t.exiting ? 'translateX(20px)' : 'translateX(0)',
              transition: 'opacity 300ms ease, transform 300ms ease',
            }}
          >
            <span style={{ color: ok ? 'var(--color-success)' : 'var(--color-danger)', fontSize: 15, marginTop: 1, flexShrink: 0 }}>
              {ok ? '✓' : '✕'}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{t.message}</div>
              {t.subtitle && <div style={{ fontSize: 11.5, color: 'var(--color-muted)', marginTop: 2 }}>{t.subtitle}</div>}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 0, fontSize: 13, lineHeight: 1, flexShrink: 0 }}
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}
