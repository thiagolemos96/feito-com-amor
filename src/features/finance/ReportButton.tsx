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

    const filterSelectClass = 'px-3 py-2 pr-8 border border-border rounded-lg font-body text-[13.5px] bg-surface text-text outline-none appearance-none cursor-pointer'

    return (
        <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
                <select value={month} onChange={e => setMonth(Number(e.target.value))} className={filterSelectClass}>
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
            <Button variant="primary" onClick={handleGenerate}>
                <ion-icon name="document-outline" style={{ fontSize: 15 }} />
                Gerar PDF
            </Button>
        </div>
    )
}
