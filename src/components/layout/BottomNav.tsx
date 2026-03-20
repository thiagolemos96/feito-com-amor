import type { Page } from '../../types'

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'catalog', label: 'Catálogo', icon: 'bag-handle-outline' },
  { id: 'stock', label: 'Estoque', icon: 'cube-outline' },
  { id: 'dashboard', label: 'Visão Geral', icon: 'home-outline' },
  { id: 'sales', label: 'Vendas', icon: 'cash-outline' },
  { id: 'finance', label: 'Financeiro', icon: 'bar-chart-outline' },
]

interface BottomNavProps {
  activePage: Page
  onNavigate: (page: Page) => void
}

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'visible',
        zIndex: 150,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = activePage === item.id
        const isCenter = item.id === 'dashboard'

        if (isCenter) {
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label="Visão Geral"
              style={{
                flex: 1,
                position: 'relative',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 6,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: isActive ? 'var(--color-accent2)' : 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.28)',
                  transition: 'background 150ms',
                }}
              >
                <ion-icon name="home-outline" style={{ fontSize: 24, color: 'white' }} />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  color: 'var(--color-accent)',
                }}
              >
                Visão Geral
              </span>
            </button>
          )
        }

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            aria-label={item.label}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
              transition: 'color 150ms',
              minHeight: 56,
            }}
          >
            <ion-icon name={item.icon} style={{ fontSize: isActive ? 22 : 20 }} />
            <span
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
