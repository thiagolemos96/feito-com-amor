import { useState, useEffect } from 'react'
import type { Page } from './types'
import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import { useSales } from './hooks/useSales'
import { Login } from './features/auth/login'
import { Sidebar } from './components/layout/sidebar'
import { Dashboard } from './features/dashboard/dashboard'
import { Catalog } from './features/catalog/catalog'
import { Stock } from './features/stock/stock'
import { Sales } from './features/sales/sales'
import { Finance } from './features/finance/finance'
import './index.css'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const { session, loading, signIn, signOut } = useAuth()
  const { products, addProduct, updateProduct, removeProduct, adjustStock } = useProducts()
  const { sales, addSale } = useSales()

  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const handleAddSale = (items: Parameters<typeof addSale>[0], notes: string, seller: string) => {
    addSale(items, notes, seller)
  }

  if (loading) return null

  if (!session) return <Login onLogin={signIn} />

  return (
    <div className="flex min-h-screen bg-bg">
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-[149] backdrop-blur-sm"
        />
      )}

      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-14 bg-surface border-b border-border flex items-center justify-between px-5 z-[99]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-text flex items-center"
            aria-label="Abrir menu"
          >
            <ion-icon name="menu-outline" style={{ fontSize: 24 }} />
          </button>
          <span className="font-display text-[17px] font-bold text-text">Feito Com Amor</span>
          <button
            onClick={toggleTheme}
            className="p-2 text-muted flex items-center"
            aria-label="Alternar tema"
          >
            <ion-icon name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'} style={{ fontSize: 22 }} />
          </button>
        </header>
      )}

      <Sidebar
        activePage={page}
        onNavigate={(p) => { setPage(p); setSidebarOpen(false) }}
        onSignOut={signOut}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className={
        isMobile
          ? 'ml-0 flex-1 pt-[72px] px-5 pb-6 min-h-screen'
          : 'ml-[220px] flex-1 px-10 py-9 min-h-screen'
      }>
        {page === 'dashboard' && <Dashboard products={products} sales={sales} />}
        {page === 'catalog' && <Catalog products={products} onAdd={addProduct} onUpdate={updateProduct} onRemove={removeProduct} />}
        {page === 'stock' && <Stock products={products} onAdjust={adjustStock} />}
        {page === 'sales' && <Sales products={products} sales={sales} onAddSale={handleAddSale} />}
        {page === 'finance' && <Finance sales={sales} products={products} />}
      </main>
    </div>
  )
}
