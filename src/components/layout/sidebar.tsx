import type { Page, NavItem } from '../../types'

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Visão Geral', icon: 'grid-outline' },
  { id: 'catalog', label: 'Catálogo', icon: 'bag-handle-outline' },
  { id: 'stock', label: 'Estoque', icon: 'cube-outline' },
  { id: 'sales', label: 'Vendas', icon: 'cash-outline' },
  { id: 'finance', label: 'Financeiro', icon: 'bar-chart-outline' },
]

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
  onSignOut: () => void
  isMobile: boolean
  isOpen: boolean
  onClose: () => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Sidebar({
  activePage,
  onNavigate,
  onSignOut,
  isMobile,
  isOpen,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const asideClass = [
    'w-[220px] min-h-screen bg-sidebar flex flex-col fixed left-0 top-0 bottom-0 z-[150]',
    isMobile ? 'transition-transform duration-[250ms]' : '',
    isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0',
    isMobile && isOpen ? 'shadow-[4px_0_24px_rgba(0,0,0,0.35)]' : '',
  ].filter(Boolean).join(' ')

  return (
    <aside className={asideClass}>
      <div className="px-6 pt-7 pb-5 border-b border-white/8">
        <h1 className="font-display text-[#faf7f2] text-[18px] font-bold leading-tight">
          Feito Com Amor
        </h1>
        <p className="text-white/40 text-[11px] mt-0.5">
          Gestão de Artesanato
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={[
                'flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border-none',
                'cursor-pointer font-body text-[13.5px] text-left w-full transition-all duration-150',
                isActive
                  ? 'bg-accent text-white font-medium'
                  : 'bg-transparent text-white/50 font-normal hover:bg-white/5 hover:text-white/75',
              ].join(' ')}
            >
              <span className="w-5 flex items-center justify-center shrink-0">
                <ion-icon name={item.icon} style={{ fontSize: 17 }} />
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t border-white/8 flex flex-col gap-0.5">
        {!isMobile && (
          <button
            onClick={onToggleTheme}
            className="w-full px-3.5 py-2.5 rounded-lg bg-transparent text-white/50 text-[13px] font-body flex items-center gap-2.5 hover:bg-white/5 hover:text-white/75 transition-all duration-150 text-left border-none cursor-pointer"
          >
            <ion-icon name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'} style={{ fontSize: 16 }} />
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </button>
        )}
        <button
          onClick={onSignOut}
          className="w-full px-3.5 py-2.5 rounded-lg bg-transparent text-white/50 text-[13px] font-body flex items-center gap-2.5 hover:bg-white/5 hover:text-white/75 transition-all duration-150 text-left border-none cursor-pointer"
        >
          <ion-icon name="log-out-outline" style={{ fontSize: 16 }} />
          Sair
        </button>
      </div>
    </aside>
  )
}
