import { useState } from 'react'
import type { Product, Sale } from '../../types'
import { fmt } from '../../lib/utils'
import { StatCard } from '../../components/ui'
import { ReportButton } from './ReportButton'

interface FinanceProps {
  sales: Sale[]
  products: Product[]
}

function BarChart({ entries, max, color }: { entries: [string, number][], max: number, color: string }) {
  return (
    <div className="flex flex-col gap-2">
      {entries.map(([label, val]) => (
        <div key={label} className="flex items-center gap-2.5 text-[13px]">
          <div className="w-[90px] text-muted text-[12px] shrink-0">
            {label.includes('-') ? label.split('-').slice(1).reverse().join('/') : label}
          </div>
          <div className="flex-1 h-[22px] bg-surface2 rounded overflow-hidden">
            <div
              className="h-full rounded transition-[width] duration-500"
              style={{ background: color, width: `${(val / max) * 100}%` }}
            />
          </div>
          <div className="w-[80px] text-right text-[12.5px] font-medium shrink-0">{fmt(val)}</div>
        </div>
      ))}
    </div>
  )
}

export function Finance({ sales, products }: FinanceProps) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const filteredSales = sales.filter(s => {
    const [y, m] = s.date.split('-').map(Number)
    return y === year && m === month
  })

  const totalRevenue = filteredSales.reduce((a, s) => a + s.total, 0)
  const avgSale = filteredSales.length ? totalRevenue / filteredSales.length : 0

  const bestProduct = (() => {
    const totals: Record<number, number> = {}
    filteredSales.forEach(s => s.items.forEach(it => {
      totals[it.productId] = (totals[it.productId] || 0) + it.qty * it.unitPrice
    }))
    const best = Object.entries(totals).sort((a, b) => Number(b[1]) - Number(a[1]))[0]
    return best ? products.find(p => p.id === Number(best[0])) : null
  })()

  const byDate: Record<string, number> = {}
  filteredSales.forEach(s => { byDate[s.date] = (byDate[s.date] || 0) + s.total })
  const dateEntries = Object.entries(byDate).sort((a, b) => a[0].localeCompare(b[0]))
  const maxDate = Math.max(...dateEntries.map(d => d[1]), 1)

  const bySeller: Record<string, number> = {}
  filteredSales.forEach(s => {
    bySeller[s.seller] = (bySeller[s.seller] || 0) + s.total
  })
  const sellerEntries = Object.entries(bySeller).sort((a, b) => b[1] - a[1])
  const maxSeller = Math.max(...sellerEntries.map(c => c[1]), 1)

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h2 className="font-display text-[28px] font-bold text-text">Financeiro</h2>
          <p className="text-muted text-[14px] mt-1">Resumo das receitas da loja</p>
        </div>
        <ReportButton
          sales={sales}
          products={products}
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
        />
      </div>

      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        <StatCard label="Receita Total" value={fmt(totalRevenue)} sub={`${filteredSales.length} vendas`} accent="green" />
        <StatCard label="Ticket Médio" value={fmt(avgSale)} sub="por venda" />
        <StatCard label="Mais Vendido" value={bestProduct?.name ?? '—'} accent="yellow" />
        <StatCard label="Produtos Ativos" value={String(products.filter(p => p.quantity > 0).length)} sub="em estoque" />
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        <div className="bg-surface border border-border rounded-[14px] p-6">
          <h3 className="font-body font-semibold text-[15px] text-text mb-5">Receita por Dia</h3>
          <BarChart entries={dateEntries} max={maxDate} color="var(--color-accent)" />
        </div>
        <div className="bg-surface border border-border rounded-[14px] p-6">
          <h3 className="font-body font-semibold text-[15px] text-text mb-5">Receita por Vendedor</h3>
          <BarChart entries={sellerEntries} max={maxSeller} color="var(--color-success)" />
        </div>
      </div>
    </div>
  )
}
