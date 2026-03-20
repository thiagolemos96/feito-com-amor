import { useState } from 'react'
import type { Product } from '../../types'
import { Modal, FormField, Input, Textarea, Button } from '../../components/ui'
import { useUpload } from '../../hooks/useUpload'

type ProductFormData = Omit<Product, 'id'>
interface ProductModalProps { product?: Product | null; onSave: (data: ProductFormData) => void; onClose: () => void }
const EMPTY: ProductFormData = { name: '', description: '', price: 0, quantity: 0, image: '📷' }

export function ProductModal({ product, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<ProductFormData>(() =>
    product ? { name: product.name, description: product.description, price: product.price, quantity: product.quantity, image: product.image } : EMPTY
  )
  const [preview, setPreview] = useState<string | null>(() =>
    product?.image.startsWith('http') ? product.image : null
  )
  const { uploadImage, uploading } = useUpload()

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
      <div className="text-center mb-5">
        {preview
          ? <img src={preview} alt="preview" className="w-[100px] h-[100px] object-cover rounded-xl border border-border inline-block" />
          : <div className="text-[56px]">{form.image}</div>
        }
      </div>

      <FormField label="Emoji (se não tiver foto)">
        <Input
          value={form.image.startsWith('http') ? '📷' : form.image}
          onChange={e => { set('image', e.target.value); setPreview(null) }}
          maxLength={2}
          style={{ fontSize: 24, textAlign: 'center' }}
          disabled={form.image.startsWith('http')}
        />
      </FormField>

      <FormField label="Foto do produto (opcional)">
        <label className="flex items-center gap-2.5 px-3.5 py-2.5 border border-dashed border-border rounded-lg cursor-pointer text-muted text-[13.5px]">
          <ion-icon name="folder-open-outline" style={{ fontSize: 18, flexShrink: 0 }} />
          <span>{uploading ? 'Enviando...' : 'Clique para selecionar uma foto'}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>
        {preview && (
          <button
            onClick={() => { setPreview(null); set('image', '📷') }}
            className="mt-1.5 text-[12px] text-danger bg-transparent border-none cursor-pointer"
          >
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
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Preço (R$)">
          <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} />
        </FormField>
        <FormField label="Qtd em Estoque">
          <Input type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
        </FormField>
      </div>

      <div className="flex justify-end gap-2.5 mt-6">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave} disabled={uploading}>
          {uploading ? 'Aguarde...' : product ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </Modal>
  )
}
