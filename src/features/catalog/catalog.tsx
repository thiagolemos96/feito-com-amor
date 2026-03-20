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
  const [editing, setEditing] = useState<Product | null | undefined>(undefined)

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
      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
        <PageHeader title="Catálogo" subtitle={`${products.length} produtos cadastrados`} />
        <div className="flex gap-2.5 items-center flex-wrap">
          <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3.5 py-[9px] w-[280px]">
            <ion-icon name="search-outline" style={{ fontSize: 16, color: 'var(--color-muted)', flexShrink: 0 }} />
            <input
              placeholder="Buscar produto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-none bg-transparent font-body text-[13.5px] outline-none w-full text-text"
            />
          </div>
          <Button variant="primary" onClick={() => setEditing(null)}>+ Novo Produto</Button>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onEdit={setEditing} onRemove={onRemove} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 px-5 text-muted">
            <div className="text-5xl mb-3">
              <ion-icon name="search-outline" style={{ fontSize: 48, opacity: 0.3 }} />
            </div>
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </div>

      {editing !== undefined && (
        <ProductModal
          key={editing ? `edit-${editing.id}` : 'new'}
          product={editing}
          onSave={handleSave}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  )
}
