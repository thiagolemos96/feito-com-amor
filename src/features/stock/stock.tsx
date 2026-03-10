import { useMemo, useState } from 'react'
import type { Product } from '../../types'
import { fmt, getStockStatus } from '../../lib/utils'
import { Badge, Button, Modal, FormField, Input, PageHeader } from '../../components/ui'

interface StockProps {
  products: Product[]
  onAdjust: (id: number, delta: number) => void
}

const thStyle = { background: 'var(--surface2)', padding: '11px 20px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' as const, letterSpacing: '0.7px' }
const tdStyle = { padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5, verticalAlign: 'middle' as const }


export function Stock({ products, onAdjust }: StockProps) {
  const [adjustingId, setAdjustingId] = useState<number | null>(null)
  const [delta, setDelta] = useState('')

  const adjustingProduct = products.find(p => p.id === adjustingId)
  const sorted = useMemo(() =>
    [...products].sort((a, b) => a.quantity - b.quantity),
    [products]);


  const handleConfirm = () => {
    const numericDelta = Number(delta)

    if (!adjustingId || !adjustingProduct || isNaN(numericDelta) || numericDelta === 0) return

    // Limita a redução para não ficar abaixo de 0 real
    const maxReducao = -adjustingProduct.quantity
    const deltaSeguro = numericDelta < maxReducao ? maxReducao : numericDelta

    onAdjust(adjustingId, deltaSeguro)

    setAdjustingId(null)
    setDelta('')
  }


  const stockBadge = (p: Product) => {
    const status = getStockStatus(p.quantity)
    return <Badge variant={status === 'ok' ? 'green' : status === 'low' ? 'yellow' : 'red'}>
      {status === 'empty' ? 'Esgotado' : status === 'low' ? 'Baixo' : 'OK'}
    </Badge>
  }

  return (
    <div>
      <PageHeader title="Estoque" subtitle="Atualize as quantidades conforme os artesanatos ficam prontos" />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Produto</th>
              <th style={thStyle}>Preço</th>
              <th style={thStyle}>Estoque</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => (
              <tr key={p.id}>
                <td style={tdStyle}>
                  <strong>{p.name}</strong>
                  <div style={{ color: 'var(--text2)', fontSize: 12, marginTop: 2 }}>{p.description}</div>
                </td>
                <td style={{ ...tdStyle, fontFamily: "'Playfair Display', serif", color: 'var(--accent)', fontWeight: 700 }}>{fmt(p.price)}</td>
                <td style={{ ...tdStyle, fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>{p.quantity}</td>
                <td style={tdStyle}>{stockBadge(p)}</td>
                <td style={tdStyle}>
                  <Button variant="ghost" onClick={() => { setAdjustingId(p.id); setDelta('') }} style={{ fontSize: 12.5 }}>
                    ± Ajustar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adjustingId && adjustingProduct && (
        <Modal title="Ajustar Estoque" onClose={() => setAdjustingId(null)} width={360}>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>
            <strong>{adjustingProduct.name}</strong> — atual: <strong>{adjustingProduct.quantity} un.</strong>
          </p>
          <FormField label="Quantidade (use negativo para subtrair)">
            <Input type="number" value={delta} onChange={e => setDelta(e.target.value)} placeholder="Ex: +3 ou -1" autoFocus />
          </FormField>
          {delta && !isNaN(Number(delta)) && (
            <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: -8, marginBottom: 16 }}>
              Novo estoque: {Math.max(0, adjustingProduct.quantity + Number(delta))} un.
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <Button variant="ghost" onClick={() => setAdjustingId(null)}>Cancelar</Button>
            <Button variant="primary" onClick={handleConfirm}>Confirmar</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}