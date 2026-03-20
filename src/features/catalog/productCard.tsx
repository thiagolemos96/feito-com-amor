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
    <div className="bg-surface border border-border rounded-[14px] p-5 flex flex-col gap-3 transition-shadow duration-150">
      <div>
        {product.image.startsWith('http') ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[140px] object-cover rounded-lg border border-border"
          />
        ) : (
          <div className="text-[36px]">{product.image}</div>
        )}
      </div>

      <div>
        <div className="font-body font-semibold text-[15px] text-text mb-0.5">{product.name}</div>
        <div className="text-[12.5px] text-muted leading-snug">{product.description}</div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-border">
        <span className="font-body font-bold text-[16px] text-accent">
          {fmt(product.price)}
        </span>
        <Badge variant={stockVariant(product.quantity) as 'green' | 'yellow' | 'red'}>{stockLabel(product.quantity)}</Badge>
      </div>

      <div className="flex gap-1.5">
        <Button variant="ghost" onClick={() => onEdit(product)} style={{ flex: 1, fontSize: 12.5, padding: '7px 0', justifyContent: 'center' }}>
          <ion-icon name="pencil-outline" style={{ fontSize: 14 }} />
          Editar
        </Button>
        <Button variant="danger" onClick={() => onRemove(product.id)} style={{ fontSize: 12.5, padding: '7px 12px' }}>
          <ion-icon name="trash-outline" style={{ fontSize: 14 }} />
        </Button>
      </div>
    </div>
  )
}
