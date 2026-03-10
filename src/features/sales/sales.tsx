import { useState } from 'react'
import type { Product, Sale, SaleItem } from '../../types'
import { fmt, formatDate } from '../../lib/utils'
import { Button, Modal, FormField, Input, Select, PageHeader } from '../../components/ui'
import { SELLERS } from '../../types'

interface SalesProps {
  products: Product[]
  sales: Sale[]
  onAddSale: (items: SaleItem[], notes: string, seller: string) => void
}

interface SaleItemForm {
  productId: string
  qty: number
}

export function Sales({ products, sales, onAddSale }: SalesProps) {
  const [showModal, setShowModal] = useState(false)
  const [items, setItems] = useState<SaleItemForm[]>([{ productId: '', qty: 1 }])
  const [notes, setNotes] = useState('')
  const [seller, setSeller] = useState('')

  const getProduct = (id: string) => products.find(p => p.id === Number(id))

  const saleTotal = items.reduce((acc, it) => {
    const p = getProduct(it.productId)
    return acc + (p ? p.price * it.qty : 0)
  }, 0)

  const addItem = () => setItems(prev => [...prev, { productId: '', qty: 1 }])
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: keyof SaleItemForm, value: string | number) =>
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it))

  const handleSave = () => {
    const validItems = items
      .filter(it => it.productId && it.qty > 0)
      .map(it => ({
        productId: Number(it.productId),
        qty: Number(it.qty),
        unitPrice: getProduct(it.productId)!.price,
      }))
    if (validItems.length === 0 || !seller) {
      alert('Por favor, adicione itens e selecione um vendedor.')
      return
    }
    onAddSale(validItems, notes, seller)
    setShowModal(false)
    setItems([{ productId: '', qty: 1 }])
    setNotes('')
    setSeller('')
  }

  const getProductName = (id: number) => products.find(p => p.id === id)?.name ?? '?'

  const thStyle = { background: 'var(--surface2)', padding: '11px 20px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' as const, letterSpacing: '0.7px' }
  const tdStyle = { padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 13.5, verticalAlign: 'middle' as const }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <PageHeader title="Vendas" subtitle={`${sales.length} vendas registradas`} />
        <Button variant="primary" onClick={() => setShowModal(true)}>+ Registrar Venda</Button>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Vendedor</th>
              <th style={thStyle}>Produtos</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Obs.</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id}>
                <td style={{ ...tdStyle, color: 'var(--text2)', fontSize: 12 }}>#{String(s.id).slice(-4)}</td>
                <td style={{ ...tdStyle, color: 'var(--text2)' }}>{formatDate(s.date)}</td>
                <td style={{ ...tdStyle, color: 'var(--text2)' }}>{s.seller || '—'}</td>
                <td style={{ ...tdStyle, fontSize: 13 }}>{s.items.map(it => `${it.qty}x ${getProductName(it.productId)}`).join(', ')}</td>
                <td style={tdStyle}>
                  <strong style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent)', fontSize: 16 }}>{fmt(s.total)}</strong>
                </td>
                <td style={{ ...tdStyle, color: 'var(--text2)', fontSize: 12.5 }}>{s.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Nova Venda" onClose={() => setShowModal(false)}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--surface2)', borderRadius: 8, marginBottom: 8 }}>
              <Select value={it.productId} onChange={e => updateItem(i, 'productId', e.target.value)} style={{ flex: 1 }}>
                <option value="">Selecionar produto...</option>
                {products.filter(p => p.quantity > 0).map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>
                ))}
              </Select>
              <Input type="number" min={1} value={it.qty} onChange={e => updateItem(i, 'qty', e.target.value)} style={{ width: 65 }} />
              {items.length > 1 && (
                <Button variant="danger" onClick={() => removeItem(i)} style={{ padding: '6px 10px', fontSize: 13 }}>✕</Button>
              )}
            </div>
          ))}

          <Button variant="ghost" onClick={addItem} style={{ fontSize: 13, marginBottom: 16 }}>+ Adicionar item</Button>

          <FormField label="Vendedor">
            <Select value={seller} onChange={e => setSeller(e.target.value)} style={{ flex: 1 }}>
              <option value="">Selecione quem realizou a venda...</option>
              {SELLERS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FormField>

          <FormField label="Observação (opcional)">
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ex: cliente pediu embrulho..." />
          </FormField>

          <div style={{ textAlign: 'right', paddingTop: 12, borderTop: '1px solid var(--border)', fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--accent)', marginBottom: 8 }}>
            Total: {fmt(saleTotal)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave}>Confirmar Venda</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}