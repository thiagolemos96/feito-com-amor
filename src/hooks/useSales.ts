import { useState } from 'react'
import type { Sale, SaleItem } from '../types'
import { mockSales } from '../mocks'

export function useSales() {
  const [sales, setSales] = useState<Sale[]>(mockSales)

  const addSale = (items: SaleItem[], notes: string): Sale => {
    const total = items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0)
    const sale: Sale = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      items,
      total,
      notes,
    }
    setSales(prev => [sale, ...prev])
    return sale
  }

  const getTodaySales = (dateStr: string) =>
    sales.filter(s => s.date === dateStr)

  const getTotalRevenue = () =>
    sales.reduce((acc, s) => acc + s.total, 0)

  const getAverageSale = () =>
    sales.length ? getTotalRevenue() / sales.length : 0

  return { sales, addSale, getTodaySales, getTotalRevenue, getAverageSale }
}