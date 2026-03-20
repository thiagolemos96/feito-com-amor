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
    seller: s.seller,
    items: (s.sale_items as { product_id: number; quantity: number; unit_price: number }[]).map(it => ({
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
    mutationFn: async ({ items, notes, seller }: { items: SaleItem[]; notes: string; seller: string }) => {
      const total = items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0)

      const { data: sale, error } = await supabase
        .from('sales')
        .insert({ total, notes, seller })  // <-- adiciona seller
        .select()
        .single()
      if (error) throw error

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
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  return {
    sales,
    isLoading,
    addSale: (items: SaleItem[], notes: string, seller: string) =>
      addSale.mutate({ items, notes, seller }),
    getTotalRevenue: () => sales.reduce((a, s) => a + s.total, 0),
    getAverageSale: () => sales.length ? sales.reduce((a, s) => a + s.total, 0) / sales.length : 0,
  }
}