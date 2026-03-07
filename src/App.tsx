import { useState } from 'react'
import type { Page } from './types'
import { useProducts } from './hooks/useProducts'
import { Sidebar } from './components/layout/sidebar'
import { Catalog } from './features/catalog/catalog'
import { Stock } from './features/stock/stock'
import './index.css'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const { products, addProduct, updateProduct, removeProduct, adjustStock, decrementStock } = useProducts()


  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={page} onNavigate={setPage} />

      <main style={{ marginLeft: 220, flex: 1, padding: '36px 40px', maxWidth: 'calc(100vw - 220px)' }}>
        {page === 'catalog'   && <Catalog products={products} onAdd={addProduct} onUpdate={updateProduct} onRemove={removeProduct} />}
        {page === 'stock'     && <Stock products={products} onAdjust={adjustStock} />}
      </main>
    </div>
  )
}