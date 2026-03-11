import { useState, useEffect } from 'react'
import type { Product } from '../../types'
import { Modal, FormField, Input, Textarea, Button } from '../../components/ui'
import { useUpload } from '../../hooks/useUpload'

type ProductFormData = Omit<Product, 'id'>
interface ProductModalProps { product?: Product | null; onSave: (data: ProductFormData) => void; onClose: () => void }
const EMPTY: ProductFormData = { name: '', description: '', price: 0, quantity: 0, image: '📷' }

export function ProductModal({ product, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY)
  const [preview, setPreview] = useState<string | null>(null)
  const { uploadImage, uploading } = useUpload()

  useEffect(() => {
    if (product) {
      setForm({ name: product.name, description: product.description, price: product.price, quantity: product.quantity, image: product.image })
      setPreview(product.image.startsWith('http') ? product.image : null)
    } else {
      setForm(EMPTY)
      setPreview(null)
    }
  }, [product])

  const set = (key: keyof ProductFormData, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    const url = await uploadImage(file)
    set('image', url)
  }

  const handleSave = () => {
    if (!form.name || !form.price) return
    onSave({ ...form, price: Number(form.price), quantity: Number(form.quantity) })
  }

  return (
    <Modal title={product ? 'Editar Produto' : 'Novo Produto'} onClose={onClose} disableOutsideClick>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        {preview
          ? <img src={preview} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border)' }} />
          : <div style={{ fontSize: 56 }}>{form.image}</div>
        }
      </div>

      <FormField label="Emoji (se não tiver foto)">
        <Input value={form.image.startsWith('http') ? '📷' : form.image} onChange={e => { set('image', e.target.value); setPreview(null) }} maxLength={2} style={{ fontSize: 24, textAlign: 'center', width: '100%', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }} disabled={form.image.startsWith('http')} />
      </FormField>

      <FormField label="Foto do produto (opcional)">
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0px 10px 14px', border: '1px dashed var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text2)', fontSize: 13.5 }}>
          <span>📁</span>
          <span>{uploading ? 'Enviando...' : 'Clique para selecionar uma foto'}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
        </label>
        {preview && (
          <button onClick={() => { setPreview(null); set('image', '📷') }} style={{ marginTop: 6, fontSize: 12, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer' }}>
            ✕ Remover foto
          </button>
        )}
      </FormField>

      <FormField label="Nome do Produto">
        <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Quadro Floral 30x40" />
      </FormField>
      <FormField label="Descrição">
        <Textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Material, tamanho, detalhes..." />
      </FormField>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FormField label="Preço (R$)">
          <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} />
        </FormField>
        <FormField label="Qtd em Estoque">
          <Input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
        </FormField>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave} disabled={uploading}>
          {uploading ? 'Aguarde...' : product ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </Modal>
  )
}