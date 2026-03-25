import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Sale, SaleItem } from '../types'
import { useToast } from '../context/toast'

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
  const { toast } = useToast()

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: fetchSales,
  })

  const deleteSale = useMutation({
    mutationFn: async (id: number) => {
      const { data: items, error: fetchError } = await supabase
        .from('sale_items')
        .select('product_id, quantity')
        .eq('sale_id', id)
      if (fetchError) throw fetchError

      for (const item of items ?? []) {
        const { data: product, error: pErr } = await supabase
          .from('products').select('quantity').eq('id', item.product_id).single()
        if (pErr) throw pErr
        await supabase.from('products').update({ quantity: product.quantity + item.quantity }).eq('id', item.product_id)
      }

      const { error: itemsError } = await supabase.from('sale_items').delete().eq('sale_id', id)
      if (itemsError) throw itemsError
      const { error } = await supabase.from('sales').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast('Venda excluída', 'success')
    },
    onError: () => toast('Erro ao excluir venda', 'error'),
  })

  const updateSale = useMutation({
    mutationFn: async ({ id, items, notes, seller, date }: { id: number; items: SaleItem[]; notes: string; seller: string; date: string }) => {
      const { data: oldItems, error: fetchError } = await supabase
        .from('sale_items').select('product_id, quantity').eq('sale_id', id)
      if (fetchError) throw fetchError

      for (const item of oldItems ?? []) {
        const { data: product, error: pErr } = await supabase
          .from('products').select('quantity').eq('id', item.product_id).single()
        if (pErr) throw pErr
        await supabase.from('products').update({ quantity: product.quantity + item.quantity }).eq('id', item.product_id)
      }

      const { error: deleteItemsError } = await supabase.from('sale_items').delete().eq('sale_id', id)
      if (deleteItemsError) throw deleteItemsError

      const { error: insertError } = await supabase.from('sale_items').insert(
        items.map(it => ({
          sale_id: id,
          product_id: it.productId,
          quantity: it.qty,
          unit_price: it.unitPrice,
        }))
      )
      if (insertError) throw insertError

      for (const item of items) {
        const { data: product, error: pErr } = await supabase
          .from('products').select('quantity').eq('id', item.productId).single()
        if (pErr) throw pErr
        await supabase.from('products').update({ quantity: product.quantity - item.qty }).eq('id', item.productId)
      }

      const total = items.reduce((acc, it) => acc + it.unitPrice * it.qty, 0)
      const { error } = await supabase.from('sales').update({ total, notes, seller, sold_at: date }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast('Venda atualizada', 'success')
    },
    onError: () => toast('Erro ao atualizar venda', 'error'),
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
      toast('Venda registrada', 'success')
    },
    onError: () => toast('Erro ao registrar venda', 'error'),
  })

  return {
    sales,
    isLoading,
    addSale: (items: SaleItem[], notes: string, seller: string) =>
      addSale.mutate({ items, notes, seller }),
    deleteSale: (id: number) => deleteSale.mutate(id),
    updateSale: (id: number, items: SaleItem[], notes: string, seller: string, date: string) =>
      updateSale.mutate({ id, items, notes, seller, date }),
    getTotalRevenue: () => sales.reduce((a, s) => a + s.total, 0),
    getAverageSale: () => sales.length ? sales.reduce((a, s) => a + s.total, 0) / sales.length : 0,
  }
}