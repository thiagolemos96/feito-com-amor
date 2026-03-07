import type { Product, Sale } from '../../types'
import { fmt } from '../../lib/utils'
import { StatCard, PageHeader } from '../../components/ui'

interface FinanceProps {
  sales: Sale[]
  products: Product[]
}

export function Finance({ sales, products }: FinanceProps) {
  const totalRevenue = sales.reduce((a, s) => a + s.total, 0)
  const avgSale = sales.length ? totalRevenue / sales.length : 0

  const bestProduct = (() => {
    const totals: Record<number, number> = {}
    sales.forEach(s => s.items.forEach(it => {
      totals[it.productId] = (totals[it.productId] || 0) + it.qty * it.unitPrice
    }))
    const best = Object.entries(totals).sort((a, b) => Number(b[1]) - Number(a[1]))[0]
    return best ? products.find(p => p.id === Number(best[0])) : null
  })()

  const byDate: Record<string, number> = {}
  sales.forEach(s => { byDate[s.date] = (byDate[s.date] || 0) + s.total })
  const dateEntries = Object.entries(byDate).sort((a, b) => a[0].localeCompare(b[0]))
  const maxDate = Math.max(...dateEntries.map(d => d[1]), 1)

  const byCategory: Record<string, number> = {}
  sales.forEach(s => s.items.forEach(it => {
    const p = products.find(pr => pr.id === it.productId)
    if (p) byCategory[p.category] = (byCategory[p.category] || 0) + it.unitPrice * it.qty
  }))
  const catEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
  const maxCat = Math.max(...catEntries.map(c => c[1]), 1)

  const BarChart = ({ entries, max, color }: { entries: [string, number][], max: number, color: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {entries.map(([label, val]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
          <div style={{ width: 90, color: 'var(--text2)', fontSize: 12 }}>{label.includes('-') ? label.split('-').slice(1).reverse().join('/') : label}</div>
          <div style={{ flex: 1, height: 22, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: color, borderRadius: 4, width: `${(val / max) * 100}%`, transition: 'width 0.5s' }} />
          </div>
          <div style={{ width: 80, textAlign: 'right', fontSize: 12.5, fontWeight: 500 }}>{fmt(val)}</div>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader title="Financeiro" subtitle="Resumo das receitas da loja" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Receita Total" value={fmt(totalRevenue)} sub={`${sales.length} vendas`} accent="green" />
        <StatCard label="Ticket Médio" value={fmt(avgSale)} sub="por venda" />
        <StatCard label="Mais Vendido" value={bestProduct?.name ?? '—'} sub={bestProduct?.category} accent="yellow" />
        <StatCard label="Produtos Ativos" value={String(products.filter(p => p.stock > 0).length)} sub="em estoque" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, marginBottom: 20 }}>Receita por Dia</h3>
          <BarChart entries={dateEntries} max={maxDate} color="var(--accent)" />
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, marginBottom: 20 }}>Receita por Categoria</h3>
          <BarChart entries={catEntries} max={maxCat} color="var(--green)" />
        </div>
      </div>
    </div>
  )
}