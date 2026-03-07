import type { Product, Sale } from '../types'

export const mockProducts: Product[] = [
  { id: 1, name: 'Quadro Floral', description: 'Madeira pintada à mão, 30x40cm', price: 85.0, category: 'Quadros', stock: 4, image: '🌸' },
  { id: 2, name: 'Porta Retrato Rústico', description: 'Pinho natural, 15x20cm', price: 45.0, category: 'Porta Retratos', stock: 7, image: '🪵' },
  { id: 3, name: 'Enfeite de Jardim', description: 'Cogumelo de madeira pintado', price: 32.0, category: 'Jardim', stock: 2, image: '🍄' },
  { id: 4, name: 'Colar Artesanal', description: 'Miçangas coloridas feitas à mão', price: 28.0, category: 'Colares', stock: 5, image: '📿' },
  { id: 5, name: 'Plaquinha Bem-Vindo', description: 'MDF com letras pintadas', price: 55.0, category: 'Decoração', stock: 3, image: '🏡' },
  { id: 6, name: 'Vaso de Madeira', description: 'Tronco torneado, pintado', price: 70.0, category: 'Decoração', stock: 1, image: '🌿' },
]

export const mockSales: Sale[] = [
  { id: 1, date: '2026-03-07', items: [{ productId: 1, qty: 1, unitPrice: 85 }, { productId: 4, qty: 2, unitPrice: 28 }], total: 141, notes: '' },
  { id: 2, date: '2026-03-07', items: [{ productId: 2, qty: 1, unitPrice: 45 }], total: 45, notes: 'Cliente voltou' },
  { id: 3, date: '2026-03-06', items: [{ productId: 5, qty: 1, unitPrice: 55 }, { productId: 3, qty: 1, unitPrice: 32 }], total: 87, notes: '' },
  { id: 4, date: '2026-03-05', items: [{ productId: 6, qty: 1, unitPrice: 70 }], total: 70, notes: 'Presente' },
  { id: 5, date: '2026-03-04', items: [{ productId: 1, qty: 2, unitPrice: 85 }], total: 170, notes: '' },
]

export const CATEGORIES = ['Quadros', 'Porta Retratos', 'Jardim', 'Colares', 'Decoração']