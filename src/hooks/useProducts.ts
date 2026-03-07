import { useState } from 'react'
import type { Product } from '../types'
import { mockProducts } from '../mocks'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts)

  const addProduct = (data: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...data, id: Date.now() }])
  }

  const updateProduct = (id: number, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  const removeProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const adjustStock = (id: number, delta: number) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)
    )
  }

  const decrementStock = (productId: number, qty: number) => {
    adjustStock(productId, -qty)
  }

  return { products, addProduct, updateProduct, removeProduct, adjustStock, decrementStock }
}