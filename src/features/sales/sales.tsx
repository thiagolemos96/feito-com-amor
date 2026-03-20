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

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [day, setDay] = useState(0)

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const daysInMonth = new Date(year, month, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const filteredSales = sales.filter(s => {
    const [y, m, d] = s.date.split('-').map(Number)
    if (y !== year || m !== month) return false
    if (day !== 0 && d !== day) return false
    return true
  })

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

  const thClass = 'bg-surface2 px-3 sm:px-5 py-[11px] text-left text-[12px] font-semibold text-muted'
  const tdClass = 'px-3 sm:px-5 py-[12px] border-b border-border text-[13px] align-middle'
  const filterSelectClass = 'px-3 py-2 pr-8 border border-border rounded-lg font-body text-[13.5px] bg-surface text-text outline-none appearance-none cursor-pointer'

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <PageHeader title="Vendas" subtitle={`${filteredSales.length} vendas exibidas`} />
          <Button variant="primary" onClick={() => setShowModal(true)} style={{ flexShrink: 0 }}>+ Registrar Venda</Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select value={day} onChange={e => setDay(Number(e.target.value))} className={filterSelectClass}>
              <option value={0}>Todos os dias</option>
              {days.map(d => <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"><ion-icon name="chevron-down-outline" style={{ fontSize: 13 }} /></span>
          </div>
          <div className="relative">
            <select value={month} onChange={e => { setMonth(Number(e.target.value)); setDay(0) }} className={filterSelectClass}>
              {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"><ion-icon name="chevron-down-outline" style={{ fontSize: 13 }} /></span>
          </div>
          <div className="relative">
            <select value={year} onChange={e => setYear(Number(e.target.value))} className={filterSelectClass}>
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"><ion-icon name="chevron-down-outline" style={{ fontSize: 13 }} /></span>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={`${thClass} hidden sm:table-cell`}>#</th>
                <th className={thClass}>Data</th>
                <th className={thClass}>Vendedor</th>
                <th className={thClass}>Produtos</th>
                <th className={thClass}>Total</th>
                <th className={`${thClass} hidden sm:table-cell`}>Obs.</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(s => (
                <tr key={s.id}>
                  <td className={`${tdClass} text-muted text-[12px] hidden sm:table-cell`}>#{String(s.id).slice(-4)}</td>
                  <td className={`${tdClass} text-muted`}>{formatDate(s.date)}</td>
                  <td className={`${tdClass} text-muted`}>{s.seller || '—'}</td>
                  <td className={`${tdClass} text-[13px]`}>{s.items.map(it => `${it.qty}x ${getProductName(it.productId)}`).join(', ')}</td>
                  <td className={tdClass}>
                    <strong className="font-body font-bold text-accent text-[15px]">{fmt(s.total)}</strong>
                  </td>
                  <td className={`${tdClass} text-muted text-[12.5px] hidden sm:table-cell`}>{s.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Nova Venda" onClose={() => setShowModal(false)}>
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2.5 bg-surface2 rounded-lg mb-2">
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
            <Select value={seller} onChange={e => setSeller(e.target.value)}>
              <option value="">Selecione quem realizou a venda...</option>
              {SELLERS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FormField>

          <FormField label="Observação (opcional)">
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ex: cliente pediu embrulho..." />
          </FormField>

          <div className="text-right pt-3 border-t border-border font-body font-bold text-[20px] text-accent mb-2">
            Total: {fmt(saleTotal)}
          </div>

          <div className="flex justify-end gap-2.5 mt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave}>Confirmar Venda</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
