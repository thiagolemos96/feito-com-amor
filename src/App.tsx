import { useState } from 'react'
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
  const { products, addProduct, updateProduct, removeProduct, adjustStock, decrementStock } = useProducts()
  const { sales, addSale } = useSales()

  const handleAddSale = (items: Parameters<typeof addSale>[0], notes: string) => {
    addSale(items, notes)
  }

  if (loading) return null

  if (!session) return <Login onLogin={signIn} />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={page} onNavigate={setPage} onSignOut={signOut} />

      <main style={{ marginLeft: 220, flex: 1, padding: '36px 40px', maxWidth: 'calc(100vw - 220px)' }}>
        {page === 'dashboard' && <Dashboard products={products} sales={sales} />}
        {page === 'catalog' && <Catalog products={products} onAdd={addProduct} onUpdate={updateProduct} onRemove={removeProduct} />}
        {page === 'stock' && <Stock products={products} onAdjust={adjustStock} />}
        {page === 'sales' && <Sales products={products} sales={sales} onAddSale={handleAddSale} />}
        {page === 'finance' && <Finance sales={sales} products={products} />}
      </main>
    </div>
  )
}