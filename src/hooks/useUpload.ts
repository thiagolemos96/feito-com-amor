import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useUpload() {
    const [uploading, setUploading] = useState(false)

    const uploadImage = async (file: File): Promise<string> => {
        setUploading(true)
        try {
            const ext = file.name.split('.').pop()
            const filename = `${Date.now()}.${ext}`

            const { error } = await supabase.storage
                .from('products')
                .upload(filename, file, { upsert: true })

            if (error) throw error

            const { data } = supabase.storage
                .from('products')
                .getPublicUrl(filename)

            return data.publicUrl
        } finally {
            setUploading(false)
        }
    }

    return { uploadImage, uploading }
}