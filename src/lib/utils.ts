export const fmt = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatDate = (dateStr: string): string =>
  dateStr.split('-').reverse().join('/')

export const today = (): string =>
  new Date().toISOString().split('T')[0]

export const getStockStatus = (stock: number): 'ok' | 'low' | 'empty' => {
  if (stock === 0) return 'empty'
  if (stock <= 2) return 'low'
  return 'ok'
}