import { useState } from 'react'
import type { Product } from '../../types'
import { Button, PageHeader } from '../../components/ui'
import { ProductCard } from './productCard'
import { ProductModal } from './productModal'

interface CatalogProps {
  products: Product[]
  onAdd: (data: Omit<Product, 'id'>) => void
  onUpdate: (id: number, data: Partial<Product>) => void
  onRemove: (id: number) => void
}

export function Catalog({ products, onAdd, onUpdate, onRemove }: CatalogProps) {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Product | null | undefined>(undefined) // undefined = closed

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (data: Omit<Product, 'id'>) => {
    if (editing) {
      onUpdate(editing.id, data)
    } else {
      onAdd(data)
    }
    setEditing(undefined)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <PageHeader title="Catálogo" subtitle={`${products.length} produtos cadastrados`} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 14px', width: 280 }}>
            <span>🔍</span>
            <input
              placeholder="Buscar produto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, outline: 'none', width: '100%', color: 'var(--text)' }}
            />
          </div>
          <Button variant="primary" onClick={() => setEditing(null)}>+ Novo Produto</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onEdit={setEditing} onRemove={onRemove} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text2)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </div>

      {editing !== undefined && (
        <ProductModal
          product={editing}
          onSave={handleSave}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  )
}