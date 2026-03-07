export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  image: string
  created_at?: string
}

export interface SaleItem {
  productId: number
  qty: number
  unitPrice: number
}

export interface Sale {
  id: number
  date: string
  items: SaleItem[]
  total: number
  notes: string
}

export type Page = 'dashboard' | 'catalog' | 'stock' | 'sales' | 'finance'

export type NavItem = {
  id: Page
  label: string
  icon: string
}