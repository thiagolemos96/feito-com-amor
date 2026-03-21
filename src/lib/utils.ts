import type { Sale } from '../types'

export const fmt = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatDate = (dateStr: string): string =>
  dateStr.split('-').reverse().join('/')

export const formatFullDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  const formatted = date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export const today = (): string =>
  new Date().toISOString().split('T')[0]

export const getStockStatus = (stock: number): 'ok' | 'low' | 'empty' => {
  if (stock === 0) return 'empty'
  if (stock <= 2) return 'low'
  return 'ok'
}

export function getDailyRevenue(sales: Sale[], days: number): number[] {
  const base = today()
  const result: number[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const total = sales.filter(s => s.date === dateStr).reduce((acc, s) => acc + s.total, 0)
    result.push(total)
  }
  return result
}