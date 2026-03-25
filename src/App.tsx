import { useState, useEffect } from 'react'
import type { Page } from './types'
import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import { useSales } from './hooks/useSales'
import { Login } from './features/auth/login'
import { Sidebar } from './components/layout/sidebar'
import { BottomNav } from './components/layout/BottomNav'
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
  const { sales, addSale, deleteSale, updateSale } = useSales()

  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )
  const [showSaleModal, setShowSaleModal] = useState(false)
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
      {isMobile && (
        <header
          className="fixed top-0 left-0 right-0 z-[99] md:hidden flex items-center justify-between px-4"
          style={{ height: 40, background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
        >
          <span className="font-display font-bold text-accent" style={{ fontSize: 15 }}>
            Feito com Amor
          </span>
          <button onClick={toggleTheme} className="p-2 flex items-center text-muted" aria-label="Alternar tema">
            <ion-icon name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'} style={{ fontSize: 20 }} />
          </button>
        </header>
      )}

      {!isMobile && (
        <Sidebar
          activePage={page}
          onNavigate={setPage}
          onSignOut={signOut}
          isMobile={false}
          isOpen={false}
          onClose={() => {}}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      <main className={
        isMobile
          ? 'ml-0 flex-1 pt-[48px] pb-[80px] px-4 min-h-screen'
          : 'ml-[220px] flex-1 px-10 py-9 min-h-screen'
      }>
        {page === 'dashboard' && <Dashboard products={products} sales={sales} />}
        {page === 'catalog' && <Catalog products={products} onAdd={addProduct} onUpdate={updateProduct} onRemove={removeProduct} />}
        {page === 'stock' && <Stock products={products} onAdjust={adjustStock} />}
        {page === 'sales' && <Sales products={products} sales={sales} onAddSale={handleAddSale} onDeleteSale={deleteSale} onUpdateSale={updateSale} showModal={showSaleModal} setShowModal={setShowSaleModal} />}
        {page === 'finance' && <Finance sales={sales} products={products} />}
      </main>

      {isMobile && (
        <button
          onClick={() => { setPage('sales'); setShowSaleModal(true) }}
          aria-label="Nova Venda"
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--color-success)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 140,
          }}
        >
          <ion-icon name="add-outline" style={{ fontSize: 28, color: 'white' }} />
        </button>
      )}

      {isMobile && (
        <BottomNav activePage={page} onNavigate={setPage} />
      )}
    </div>
  )
}
