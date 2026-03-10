import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Sale, Product } from '../types'
import { fmt } from './utils'

interface ReportOptions {
    sales: Sale[]
    products: Product[]
    month: number  // 1-12
    year: number
}

export function generateMonthlyReport({ sales, products, month, year }: ReportOptions) {
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const monthLabel = `${monthNames[month - 1]} ${year}`

    // Filtra vendas do mês
    const filtered = sales.filter(s => {
        const [y, m] = s.date.split('-').map(Number)
        return y === year && m === month
    })

    const totalRevenue = filtered.reduce((a, s) => a + s.total, 0)
    const avgSale = filtered.length ? totalRevenue / filtered.length : 0

    // Calcula produtos mais vendidos no mês
    const productTotals: Record<number, { qty: number; revenue: number }> = {}
    filtered.forEach(s => s.items.forEach(it => {
        if (!productTotals[it.productId]) productTotals[it.productId] = { qty: 0, revenue: 0 }
        productTotals[it.productId].qty += it.qty
        productTotals[it.productId].revenue += it.qty * it.unitPrice
    }))

    const doc = new jsPDF()
    const pageW = doc.internal.pageSize.getWidth()

    const bySeller: Record<string, number> = {}
    filtered.forEach(s => {
        bySeller[s.seller] = (bySeller[s.seller] || 0) + s.total
    })
    const sellerEntries = Object.entries(bySeller).sort((a, b) => b[1] - a[1])

    // ─── CABEÇALHO ───────────────────────────────────────────────
    doc.setFillColor(44, 36, 22) // var(--text) #2c2416
    doc.rect(0, 0, pageW, 40, 'F')

    doc.setTextColor(250, 247, 242)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Feito com Amor', 14, 18)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(181, 101, 29) // var(--accent)
    doc.text('Gestão de Artesanato', 14, 27)

    doc.setTextColor(200, 190, 175)
    doc.setFontSize(10)
    doc.text(`Relatório Mensal — ${monthLabel}`, 14, 36)

    const today = new Date().toLocaleDateString('pt-BR')
    doc.text(`Gerado em ${today}`, pageW - 14, 36, { align: 'right' })

    // ─── CARDS DE RESUMO ─────────────────────────────────────────
    let y = 55

    const cards = [
        { label: 'Total de Vendas', value: String(filtered.length) },
        { label: 'Receita Total', value: fmt(totalRevenue) },
        { label: 'Ticket Médio', value: fmt(avgSale) },
    ]

    const cardW = (pageW - 28 - 8) / 3
    cards.forEach((card, i) => {
        const x = 14 + i * (cardW + 4)
        doc.setFillColor(243, 237, 227) // var(--surface2)
        doc.roundedRect(x, y, cardW, 22, 3, 3, 'F')
        doc.setTextColor(122, 106, 82)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(card.label.toUpperCase(), x + 6, y + 8)
        doc.setTextColor(44, 36, 22)
        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.text(card.value, x + 6, y + 17)
    })

    y += 32

    // ─── TABELA DE VENDAS ─────────────────────────────────────────
    doc.setTextColor(44, 36, 22)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('Vendas do Mês', 14, y)
    y += 6

    if (filtered.length === 0) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(122, 106, 82)
        doc.text('Nenhuma venda registrada neste mês.', 14, y + 8)
        y += 20
    } else {
        autoTable(doc, {
            startY: y,
            head: [['Data', 'Produtos', 'Total', 'Obs.']],
            body: filtered.map(s => [
                s.date.split('-').reverse().join('/'),
                s.seller,
                s.items.map(it => {
                    const p = products.find(pr => pr.id === it.productId)
                    return `${it.qty}x ${p?.name ?? '?'}`
                }).join(', '),
                fmt(s.total),
                s.notes || '—',
            ]),
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [44, 36, 22], textColor: [250, 247, 242], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [250, 247, 242] },
            columnStyles: { 2: { fontStyle: 'bold', textColor: [181, 101, 29] } },
        })
        y = (doc as any).lastAutoTable.finalY + 12
    }

    // ─── TABELA DE RECEITA POR VENDEDOR ─────────────────────────
    doc.setTextColor(44, 36, 22)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('Receita por Vendedor', 14, y)
    y += 6

    autoTable(doc, {
        startY: y,
        head: [['Vendedor', 'Receita']],
        body: sellerEntries.map(([seller, total]) => [seller, fmt(total)]),
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [74, 124, 89], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [250, 247, 242] },
        columnStyles: { 1: { fontStyle: 'bold', textColor: [181, 101, 29] } },
    })

    // ─── RODAPÉ ───────────────────────────────────────────────────
    const pageH = doc.internal.pageSize.getHeight()
    doc.setFillColor(44, 36, 22)
    doc.rect(0, pageH - 12, pageW, 12, 'F')
    doc.setTextColor(100, 90, 75)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Feito com Amor — Gestão de Artesanato', pageW / 2, pageH - 4, { align: 'center' })

    // ─── SALVA ────────────────────────────────────────────────────
    doc.save(`relatorio-${monthLabel.toLowerCase().replace(' ', '-')}.pdf`)
}