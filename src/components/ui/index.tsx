import type { ReactNode } from 'react'

// ─── BADGE ────────────────────────────────────────────────────────
type BadgeVariant = 'green' | 'yellow' | 'red'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

const badgeStyles: Record<BadgeVariant, string> = {
  green: 'background:#e8f5ec;color:#2d6a40',
  yellow: 'background:#fef9e7;color:#9a6e00',
  red: 'background:#fdecea;color:#c0392b',
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11.5, fontWeight: 500,
      ...Object.fromEntries(badgeStyles[variant].split(';').map(s => s.split(':'))),
    }}>
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

export function Button({ variant = 'ghost', onClick, children, style, disabled }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '9px 18px', borderRadius: 8, border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500,
    transition: 'all 0.15s', opacity: disabled ? 0.5 : 1,
  }
  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: 'var(--accent)', color: 'white' },
    ghost: { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
    danger: { background: '#fdecea', color: 'var(--red)', border: '1px solid #f5c6c2' },
  }
  return (
    <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick} disabled={disabled}>
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

const accentColors: Record<AccentColor, string> = {
  default: 'var(--accent)',
  green: 'var(--green)',
  yellow: 'var(--yellow)',
  red: 'var(--red)',
}

export function StatCard({ label, value, sub, accent = 'default' }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 22, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: accentColors[accent],
      }} />
      <div style={{ fontSize: 11.5, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 500 }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginTop: 8, color: 'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// ─── MODAL ────────────────────────────────────────────────────────
interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  width?: number
}

export function Modal({ title, onClose, children, width = 520 }: ModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: 16, padding: 32,
          width, maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{title}</h3>
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
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 12.5, fontWeight: 500,
        color: 'var(--text2)', marginBottom: 6,
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: 'stretch', padding: '10px 14px', border: '1px solid var(--border)',
  borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
  background: 'var(--bg)', color: 'var(--text)', outline: 'none',
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input style={inputStyle} {...props} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select style={inputStyle} {...props} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea style={{ ...inputStyle, resize: 'none' }} {...props} />
}

// ─── PAGE HEADER ──────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700 }}>{title}</h2>
      {subtitle && <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
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
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      {(title || action) && (
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {title && <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600 }}>{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}