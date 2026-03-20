import type { Product, Sale } from '../../types'
import { fmt, formatDate, formatFullDate } from '../../lib/utils'
import { HeroStatCard, StatCard, TableCard, Badge, PageHeader } from '../../components/ui'

interface DashboardProps {
  products: Product[]
  sales: Sale[]
}

export function Dashboard({ products, sales }: DashboardProps) {
  const TODAY = new Date().toISOString().split('T')[0]
  const todaySales = sales.filter(s => s.date === TODAY)
  const todayRevenue = todaySales.reduce((a, s) => a + s.total, 0)
  const weekRevenue = sales.reduce((a, s) => a + s.total, 0)
  const lowStock = products.filter(p => p.quantity <= 2)
  const recentSales = [...sales].sort((a, b) => b.id - a.id).slice(0, 5)

  const thClass = 'bg-surface2 px-5 py-[11px] text-left text-[12px] font-semibold text-muted'
  const tdClass = 'px-5 py-[14px] border-b border-border'

  return (
    <div>
      <PageHeader title="Visão Geral" subtitle={formatFullDate(TODAY)} />

      <div className="mb-4">
        <HeroStatCard
          label="Vendas Hoje"
          value={fmt(todayRevenue)}
          sub={`${todaySales.length} venda(s) registrada(s)`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Esta Semana" value={fmt(weekRevenue)} sub={`${sales.length} vendas`} />
        <StatCard label="Produtos" value={String(products.length)} sub="no catálogo" accent="yellow" />
        <StatCard label="Estoque Baixo" value={String(lowStock.length)} sub="produtos ≤ 2 un." accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TableCard title="Últimas Vendas">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 320 }}>
              <thead>
                <tr>
                  {['Data', 'Total', 'Itens'].map(h => (
                    <th key={h} className={thClass}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSales.map(s => (
                  <tr key={s.id}>
                    <td className={`${tdClass} text-muted text-[13px]`}>{formatDate(s.date)}</td>
                    <td className={tdClass}>
                      <strong className="text-accent">{fmt(s.total)}</strong>
                    </td>
                    <td className={`${tdClass} text-muted`}>
                      {s.items.reduce((a, i) => a + i.qty, 0)} un.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableCard>

        <TableCard title="Estoque Baixo">
          {lowStock.length === 0 ? (
            <div className="text-center py-10 px-5 text-muted">Tudo em ordem!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: 240 }}>
                <thead>
                  <tr>
                    {['Produto', 'Qtd'].map(h => (
                      <th key={h} className={thClass}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map(p => (
                    <tr key={p.id}>
                      <td className={tdClass}>{p.name}</td>
                      <td className={tdClass}>
                        <Badge variant={p.quantity === 0 ? 'red' : 'yellow'}>{p.quantity} un.</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TableCard>
      </div>
    </div>
  )
}
