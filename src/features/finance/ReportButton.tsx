import { Button } from '../../components/ui'
import { generateMonthlyReport } from '../../lib/generateReport'
import type { Product, Sale } from '../../types'

interface ReportButtonProps {
    sales: Sale[]
    products: Product[]
    month: number
    setMonth: (month: number) => void
    year: number
    setYear: (year: number) => void
}

export function ReportButton({ sales, products, month, setMonth, year, setYear }: ReportButtonProps) {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const handleGenerate = () => {
        generateMonthlyReport({ sales, products, month, year })
    }

    const inputStyle: React.CSSProperties = {
        padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8,
        fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
        background: 'var(--bg)', color: 'var(--text)', outline: 'none',
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select value={month} onChange={e => setMonth(Number(e.target.value))} style={inputStyle}>
                {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select value={year} onChange={e => setYear(Number(e.target.value))} style={inputStyle}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <Button variant="primary" onClick={handleGenerate}>
                📄 Gerar PDF
            </Button>
        </div>
    )
}