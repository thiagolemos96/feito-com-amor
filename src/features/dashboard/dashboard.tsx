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

      {/* Row 1: 3 stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <HeroStatCard
          label="Vendas Hoje"
          value={fmt(todayRevenue)}
          sub={`${todaySales.length} venda(s) registrada(s)`}
        />
        <StatCard
          label="Esta Semana"
          value={fmt(weekRevenue)}
          sub={`${sales.length} vendas`}
        />
        <StatCard
          label="Produtos"
          value={String(products.length)}
          sub="no catálogo"
          accent="yellow"
        />
      </div>

      {/* Row 2: tables 2:1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <TableCard title="Últimas Vendas">
            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 420 }}>
              <table className="w-full border-collapse" style={{ minWidth: 320 }}>
                <thead className="sticky top-0">
                  <tr>
                    {['Data', 'Vendedora', 'Total'].map(h => (
                      <th key={h} className={thClass}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map(s => (
                    <tr key={s.id}>
                      <td className={`${tdClass} text-muted text-[13px]`}>{formatDate(s.date)}</td>
                      <td className={tdClass}>{s.seller}</td>
                      <td className={tdClass}>
                        <strong className="text-accent">{fmt(s.total)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableCard>
        </div>

        <div className="md:col-span-1">
          <TableCard
            title="Estoque Baixo"
            subtitle="produtos ≤ 2 un."
            action={
              <span className="font-body font-bold text-[15px]" style={{ color: 'var(--color-danger)' }}>
                {lowStock.length}
              </span>
            }
          >
            {lowStock.length === 0 ? (
              <div className="text-center py-10 px-5 text-muted">Tudo em ordem!</div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 420 }}>
                <table className="w-full border-collapse" style={{ minWidth: 240 }}>
                  <thead className="sticky top-0">
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
    </div>
  )
}
