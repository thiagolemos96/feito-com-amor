import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Sale, SaleItem } from '../types'

const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select(`*, sale_items(*)`)
    .order('sold_at', { ascending: false })

  if (error) throw error

  return data.map(s => ({
    id: s.id,
    date: s.sold_at.split('T')[0],
    total: s.total,
    notes: s.notes ?? '',
    items: s.sale_items.map((it: any) => ({
      productId: it.product_id,
      qty: it.quantity,
      unitPrice: it.unit_price,
    })),
  }))
}

export function useSales() {
  const queryClient = useQueryClient()

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: fetchSales,
  })

  const addSale = useMutation({
    mutationFn: async ({ items, notes }: { items: SaleItem[]; notes: string }) => {
      const total = items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0)

      // Insere a venda
      const { data: sale, error } = await supabase
        .from('sales')
        .insert({ total, notes })
        .select()
        .single()
      if (error) throw error

      // Insere os itens
      const { error: itemsError } = await supabase.from('sale_items').insert(
        items.map(it => ({
          sale_id: sale.id,
          product_id: it.productId,
          quantity: it.qty,
          unit_price: it.unitPrice,
        }))
      )
      if (itemsError) throw itemsError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['products'] }) // atualiza estoque
    },
  })

  return {
    sales,
    isLoading,
    addSale: (items: SaleItem[], notes: string) => addSale.mutate({ items, notes }),
    getTotalRevenue: () => sales.reduce((a, s) => a + s.total, 0),
    getAverageSale: () => sales.length ? sales.reduce((a, s) => a + s.total, 0) / sales.length : 0,
  }
}