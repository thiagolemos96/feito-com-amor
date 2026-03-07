import { useState, useEffect } from 'react'
import type { Product } from '../../types'
import { CATEGORIES } from '../../mocks'
import { Modal, FormField, Input, Select, Textarea, Button } from '../../components/ui'

type ProductFormData = Omit<Product, 'id'>

interface ProductModalProps {
  product?: Product | null
  onSave: (data: ProductFormData) => void
  onClose: () => void
}

const EMPTY_FORM: ProductFormData = {
  name: '', description: '', price: 0, category: 'Quadros', stock: 0, image: '🪵',
}

export function ProductModal({ product, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM)

  useEffect(() => {
    setForm(product ? { name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock, image: product.image } : EMPTY_FORM)
  }, [product])

  const set = (key: keyof ProductFormData, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = () => {
    if (!form.name || !form.price) return
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) })
  }

  return (
    <Modal title={product ? 'Editar Produto' : 'Novo Produto'} onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Emoji / Ícone">
          <Input value={form.image} onChange={e => set('image', e.target.value)} maxLength={2} style={{ fontSize: 24, textAlign: 'center' }} />
        </FormField>
        <FormField label="Categoria">
          <Select value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </Select>
        </FormField>
      </div>

      <FormField label="Nome do Produto">
        <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Quadro Floral 30x40" />
      </FormField>

      <FormField label="Descrição">
        <Textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Material, tamanho, detalhes..." />
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Preço (R$)">
          <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0,00" />
        </FormField>
        <FormField label="Qtd em Estoque">
          <Input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
        </FormField>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>{product ? 'Salvar' : 'Adicionar'}</Button>
      </div>
    </Modal>
  )
}