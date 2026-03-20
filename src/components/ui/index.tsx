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

// ─── BUTTON ───────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'ghost' | 'danger'

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
}

const accentBar: Record<AccentColor, string> = {
  default: 'bg-accent',
  green: 'bg-success',
  yellow: 'bg-warning',
  red: 'bg-danger',
}

export function StatCard({ label, value, sub, accent = 'default' }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-[14px] p-[22px] relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentBar[accent]}`} />
      <div className="text-[12px] text-muted font-semibold">{label}</div>
      <div className="font-body text-2xl font-bold mt-2 text-text">{value}</div>
      {sub && <div className="text-[12px] text-muted mt-1">{sub}</div>}
    </div>
  )
}

// ─── HERO STAT CARD ───────────────────────────────────────────────
interface HeroStatCardProps {
  label: string
  value: string
  sub?: string
}

export function HeroStatCard({ label, value, sub }: HeroStatCardProps) {
  return (
    <div className="bg-accent rounded-[14px] p-8 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10) 0%, transparent 60%)' }}
      />
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
  return <select className={inputClass} {...props} />
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
  title?: string
  action?: ReactNode
  children: ReactNode
}

export function TableCard({ title, action, children }: TableCardProps) {
  return (
    <div className="bg-surface border border-border rounded-[14px] overflow-hidden">
      {(title || action) && (
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          {title && <h3 className="font-body text-[15px] font-semibold text-text">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
