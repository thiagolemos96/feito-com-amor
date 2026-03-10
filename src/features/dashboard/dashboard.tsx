import type { Product, Sale } from '../../types'
import { fmt, formatDate } from '../../lib/utils'
import { StatCard, TableCard, Badge, PageHeader } from '../../components/ui'

interface DashboardProps {
  products: Product[]
  sales: Sale[]
}

export function Dashboard({ products, sales }: DashboardProps) {
  const TODAY = '2026-03-07'
  const todaySales = sales.filter(s => s.date === TODAY)
  const todayRevenue = todaySales.reduce((a, s) => a + s.total, 0)
  const weekRevenue = sales.reduce((a, s) => a + s.total, 0)
  const lowStock = products.filter(p => p.quantity <= 2)
  const recentSales = [...sales].sort((a, b) => b.id - a.id).slice(0, 5)

  return (
    <div>
      <PageHeader title="Visão Geral" subtitle="Sexta-feira, 7 de março de 2026" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Vendas Hoje" value={fmt(todayRevenue)} sub={`${todaySales.length} venda(s)`} accent="green" />
        <StatCard label="Esta Semana" value={fmt(weekRevenue)} sub={`${sales.length} vendas`} />
        <StatCard label="Produtos" value={String(products.length)} sub="no catálogo" accent="yellow" />
        <StatCard label="Estoque Baixo" value={String(lowStock.length)} sub="produtos ≤ 2 un." accent="red" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <TableCard title="Últimas Vendas">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Data', 'Total', 'Itens'].map(h => (
                  <th key={h} style={{ background: 'var(--surface2)', padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSales.map(s => (
                <tr key={s.id}>
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', color: 'var(--text2)', fontSize: 13 }}>{formatDate(s.date)}</td>
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                    <strong style={{ color: 'var(--accent)' }}>{fmt(s.total)}</strong>
                  </td>
                  <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', color: 'var(--text2)' }}>
                    {s.items.reduce((a, i) => a + i.qty, 0)} un.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>

        <TableCard title="⚠️ Estoque Baixo">
          {lowStock.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text2)' }}>Tudo em ordem! ✅</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Produto', 'Qtd'].map(h => (
                    <th key={h} style={{ background: 'var(--surface2)', padding: '11px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id}>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>{p.name}</td>
                    <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                      <Badge variant={p.quantity === 0 ? 'red' : 'yellow'}>{p.quantity} un.</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableCard>
      </div>
    </div>
  )
}