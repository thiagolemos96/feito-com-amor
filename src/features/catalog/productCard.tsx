import type { Product } from '../../types'
import { fmt, getStockStatus } from '../../lib/utils'
import { Badge, Button } from '../../components/ui'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onRemove: (id: number) => void
}

const stockLabel = (stock: number) => {
  if (stock === 0) return 'Esgotado'
  if (stock <= 2) return `${stock} restante(s)`
  return `${stock} em estoque`
}

const stockVariant = (stock: number) => {
  const status = getStockStatus(stock)
  return status === 'ok' ? 'green' : status === 'low' ? 'yellow' : 'red'
}

export function ProductCard({ product, onEdit, onRemove }: ProductCardProps) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 20, transition: 'box-shadow 0.15s',
    }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{product.image}</div>
      <span style={{ fontSize: 11, color: 'var(--text2)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 8 }}>
        {product.category}
      </span>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 3 }}>{product.name}</div>
      <div style={{ fontSize: 12.5, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.4 }}>{product.description}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: 'var(--accent)' }}>
          {fmt(product.price)}
        </span>
        <Badge variant={stockVariant(product.stock)}>{stockLabel(product.stock)}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        <Button variant="ghost" onClick={() => onEdit(product)} style={{ flex: 1, fontSize: 12.5, padding: '7px 0', justifyContent: 'center' }}>
          ✏️ Editar
        </Button>
        <Button variant="danger" onClick={() => onRemove(product.id)} style={{ fontSize: 12.5, padding: '7px 12px' }}>
          🗑
        </Button>
      </div>
    </div>
  )
}