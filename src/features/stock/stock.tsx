import { useMemo, useState } from 'react'
import type { Product } from '../../types'
import { fmt, getStockStatus } from '../../lib/utils'
import { Badge, Button, Modal, FormField, Input, PageHeader } from '../../components/ui'

interface StockProps {
  products: Product[]
  onAdjust: (id: number, delta: number) => void
}

const thClass = 'bg-surface2 px-3 sm:px-5 py-[11px] text-left text-[12px] font-semibold text-muted'
const tdClass = 'px-3 sm:px-5 py-[12px] border-b border-border text-[13px] align-middle'

export function Stock({ products, onAdjust }: StockProps) {
  const [adjustingId, setAdjustingId] = useState<number | null>(null)
  const [delta, setDelta] = useState('')

  const adjustingProduct = products.find(p => p.id === adjustingId)
  const sorted = useMemo(() =>
    [...products].sort((a, b) => a.quantity - b.quantity),
    [products])

  const handleConfirm = () => {
    const numericDelta = Number(delta)
    if (!adjustingId || !adjustingProduct || isNaN(numericDelta) || numericDelta === 0) return
    const maxReducao = -adjustingProduct.quantity
    const deltaSeguro = numericDelta < maxReducao ? maxReducao : numericDelta
    onAdjust(adjustingId, deltaSeguro)
    setAdjustingId(null)
    setDelta('')
  }

  const stockBadge = (p: Product) => {
    const status = getStockStatus(p.quantity)
    return (
      <Badge variant={status === 'ok' ? 'green' : status === 'low' ? 'yellow' : 'red'}>
        {status === 'empty' ? 'Esgotado' : status === 'low' ? 'Baixo' : 'OK'}
      </Badge>
    )
  }

  return (
    <div>
      <PageHeader title="Estoque" subtitle="Atualize as quantidades conforme os artesanatos ficam prontos" />

      <div className="bg-surface border border-border rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thClass}>Produto</th>
                <th className={`${thClass} hidden sm:table-cell`}>Preço</th>
                <th className={thClass}>Qtd</th>
                <th className={thClass}>Status</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => (
                <tr key={p.id}>
                  <td className={tdClass}>
                    <strong>{p.name}</strong>
                    <div className="text-muted text-[12px] mt-0.5">{p.description}</div>
                  </td>
                  <td className={`${tdClass} text-accent font-bold hidden sm:table-cell`}>{fmt(p.price)}</td>
                  <td className={`${tdClass} text-[16px] font-bold`}>{p.quantity}</td>
                  <td className={tdClass}>{stockBadge(p)}</td>
                  <td className={tdClass}>
                    <Button variant="ghost" onClick={() => { setAdjustingId(p.id); setDelta('') }} style={{ fontSize: 12.5 }}>
                      ± Ajustar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {adjustingId && adjustingProduct && (
        <Modal title="Ajustar Estoque" onClose={() => setAdjustingId(null)} width={360}>
          <p className="text-muted text-[14px] mb-5">
            <strong className="text-text">{adjustingProduct.name}</strong> — atual: <strong className="text-text">{adjustingProduct.quantity} un.</strong>
          </p>
          <FormField label="Quantidade (use negativo para subtrair)">
            <Input type="number" value={delta} onChange={e => setDelta(e.target.value)} placeholder="Ex: +3 ou -1" autoFocus />
          </FormField>
          {delta && !isNaN(Number(delta)) && (
            <p className="text-[13px] text-muted -mt-2 mb-4">
              Novo estoque: {Math.max(0, adjustingProduct.quantity + Number(delta))} un.
            </p>
          )}
          <div className="flex justify-end gap-2.5 mt-6">
            <Button variant="ghost" onClick={() => setAdjustingId(null)}>Cancelar</Button>
            <Button variant="primary" onClick={handleConfirm}>Confirmar</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
