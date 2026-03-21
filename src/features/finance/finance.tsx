import { useState, useId, useRef } from 'react'
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

type HoverState = { dayIndex: number; mouseX: number; mouseY: number } | null

function AreaChart({ entries, month, year }: { entries: [string, number][], month: number, year: number }) {
  const uid = useId()
  const gradId = `ac${uid.replace(/:/g, '')}`
  const svgRef = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState<HoverState>(null)

  const daysInMonth = new Date(year, month, 0).getDate()

  const byDay: number[] = Array(daysInMonth).fill(0)
  entries.forEach(([date, val]) => {
    const day = parseInt(date.split('-')[2]) - 1
    if (day >= 0 && day < daysInMonth) byDay[day] = val
  })

  const max = Math.max(...byDay, 1)
  const vW = 600
  const vH = 160
  const pad = { t: 10, b: 30, l: 8, r: 8 }
  const cW = vW - pad.l - pad.r
  const cH = vH - pad.t - pad.b
  const axisY = pad.t + cH

  const xs = byDay.map((_, i) => pad.l + (i / Math.max(daysInMonth - 1, 1)) * cW)
  const ys = byDay.map(v => pad.t + (1 - v / max) * cH)

  const linePoints = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')
  const lineD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')
  const areaD = lineD + ` L${xs[xs.length - 1].toFixed(1)},${axisY} L${xs[0].toFixed(1)},${axisY} Z`

  const labelDays = [...new Set([0, 9, 19, daysInMonth - 1])]

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    // Convert screen X to SVG coordinate space, then to day index
    const svgX = ((e.clientX - rect.left) / rect.width) * vW
    const raw = (svgX - pad.l) / cW * (daysInMonth - 1)
    const dayIndex = Math.max(0, Math.min(daysInMonth - 1, Math.round(raw)))
    setHovered({ dayIndex, mouseX: e.clientX - rect.left, mouseY: e.clientY - rect.top })
  }

  const hDay = hovered?.dayIndex ?? -1
  const hVal = hDay >= 0 ? byDay[hDay] : 0

  // Tooltip: keep it inside the container (flip when close to right edge)
  const tooltipLeft = hovered
    ? hovered.mouseX > (svgRef.current?.getBoundingClientRect().width ?? 0) * 0.65
      ? hovered.mouseX - 130
      : hovered.mouseX + 14
    : 0

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${vW} ${vH}`}
        width="100%"
        height={160}
        preserveAspectRatio="none"
        style={{ display: 'block', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradId})`} />
        <polyline
          points={linePoints}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {byDay.map((v, i) => (
          <circle
            key={i}
            cx={xs[i]}
            cy={ys[i]}
            r={i === hDay ? 5.5 : (v > 0 ? 3.5 : 0)}
            fill="var(--color-accent)"
            style={{ transition: 'r 0.1s' }}
          />
        ))}
        {/* Crosshair */}
        {hovered && (
          <line
            x1={xs[hDay]}
            y1={pad.t}
            x2={xs[hDay]}
            y2={axisY}
            stroke="var(--color-accent)"
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.5}
          />
        )}
        <line x1={pad.l} y1={axisY} x2={vW - pad.r} y2={axisY} stroke="var(--color-border)" strokeWidth={1} />
        {labelDays.map(i => (
          <text key={i} x={xs[i]} y={axisY + 16} textAnchor="middle" fontSize={11} fill="var(--color-muted)">
            {i + 1}
          </text>
        ))}
      </svg>

      {/* HTML tooltip — lives outside SVG to avoid coordinate distortion */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: Math.max(0, hovered.mouseY - 48),
            left: tooltipLeft,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            className="rounded-[8px] px-3 py-2 text-[12.5px] font-body font-medium shadow-lg"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              minWidth: 116,
              whiteSpace: 'nowrap',
            }}
          >
            <div className="text-muted text-[11px] mb-0.5">
              Dia {hDay + 1} de {new Date(year, month - 1, 1).toLocaleString('pt-BR', { month: 'long' })}
            </div>
            <div style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
              {hVal > 0 ? fmt(hVal) : 'Sem vendas'}
            </div>
          </div>
        </div>
      )}
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Receita Total" value={fmt(totalRevenue)} sub={`${filteredSales.length} vendas`} accent="green" />
        <StatCard label="Ticket Médio" value={fmt(avgSale)} sub="por venda" />
        <StatCard label="Mais Vendido" value={bestProduct?.name ?? '—'} accent="yellow" />
        <StatCard label="Produtos Ativos" value={String(products.filter(p => p.quantity > 0).length)} sub="em estoque" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="md:col-span-3 bg-surface border border-border rounded-[14px] p-6">
          <h3 className="font-body font-semibold text-[15px] text-text mb-4">Receita por Dia</h3>
          <AreaChart entries={dateEntries} month={month} year={year} />
        </div>
        <div className="md:col-span-2 bg-surface border border-border rounded-[14px] p-6">
          <h3 className="font-body font-semibold text-[15px] text-text mb-5">Receita por Vendedor</h3>
          <BarChart entries={sellerEntries} max={maxSeller} color="var(--color-success)" />
        </div>
      </div>
    </div>
  )
}
