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

    const filterSelectClass = 'px-3 py-2 border border-border rounded-lg font-body text-[13.5px] bg-surface text-text outline-none'

    return (
        <div className="flex items-center gap-2.5 flex-wrap">
            <select value={month} onChange={e => setMonth(Number(e.target.value))} className={filterSelectClass}>
                {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select value={year} onChange={e => setYear(Number(e.target.value))} className={filterSelectClass}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <Button variant="primary" onClick={handleGenerate}>
                <ion-icon name="document-outline" style={{ fontSize: 15 }} />
                Gerar PDF
            </Button>
        </div>
    )
}
