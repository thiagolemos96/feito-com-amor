import type { Page, NavItem } from '../../types'

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Visão Geral', icon: '📊' },
  { id: 'catalog', label: 'Catálogo', icon: '🛍️' },
  { id: 'stock', label: 'Estoque', icon: '📦' },
  { id: 'sales', label: 'Vendas', icon: '💰' },
  { id: 'finance', label: 'Financeiro', icon: '📈' },
]

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
  onSignOut: () => void
}

export function Sidebar({ activePage, onNavigate, onSignOut }: SidebarProps) {
  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: 'var(--text)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, bottom: 0,
    }}>
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#faf7f2', fontSize: 18, fontWeight: 700 }}>
          Feito Com Amor
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 3, letterSpacing: '0.5px' }}>
          Gestão de Artesanato
        </p>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5, textAlign: 'left', width: '100%',
              transition: 'all 0.15s',
              background: activePage === item.id ? 'var(--accent)' : 'transparent',
              color: activePage === item.id ? '#fff' : 'rgba(255,255,255,0.5)',
              fontWeight: activePage === item.id ? 500 : 400,
            }}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={onSignOut}
          style={{ width: '100%', padding: '9px 14px', border: 'none', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: 'left' }}
        >
          🚪 Sair
        </button>
      </div>
    </aside>
  )
}