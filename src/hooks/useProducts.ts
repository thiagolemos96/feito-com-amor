import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

// Busca todos os produtos junto com o estoque
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')        // sem o join com stock
    .order('name')

  if (error) throw error
  return data
}

export function useProducts() {
  const queryClient = useQueryClient()

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const addProduct = useMutation({
    mutationFn: async (data: Omit<Product, 'id'>) => {
      const { error } = await supabase
        .from('products')
        .insert({
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image,
          quantity: data.quantity,   // já vai junto
        })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
      const { error } = await supabase
        .from('products')
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image,
          quantity: data.quantity,
        })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  const removeProduct = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  const adjustStock = useMutation({
    mutationFn: async ({ id, delta }: { id: number; delta: number }) => {
      const product = products.find(p => p.id === id)
      if (!product) throw new Error('Produto não encontrado')
      const { error } = await supabase
        .from('products')
        .update({ quantity: Math.max(0, product.quantity + delta) })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })

  return {
    products,
    isLoading,
    addProduct: (data: Omit<Product, 'id'>) => addProduct.mutate(data),
    updateProduct: (id: number, data: Partial<Product>) => updateProduct.mutate({ id, data }),
    removeProduct: (id: number) => removeProduct.mutate(id),
    adjustStock: (id: number, delta: number) => adjustStock.mutate({ id, delta }),
    decrementStock: (id: number, qty: number) => adjustStock.mutate({ id, delta: -qty }),
  }
}