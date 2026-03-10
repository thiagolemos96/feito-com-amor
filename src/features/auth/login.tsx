import { useState } from 'react'
import { Button, FormField, Input } from '../../components/ui'

interface LoginProps {
    onLogin: (email: string, password: string) => Promise<void>
}

export function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            await onLogin(email, password)
        } catch {
            setError('Email ou senha incorretos.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, width: 380 }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
                    Feito com Amor
                </h1>
                <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 32 }}>Gestão de Artesanato</p>

                <FormField label="Email">
                    <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                    />
                </FormField>

                <FormField label="Senha">
                    <Input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                </FormField>

                {error && (
                    <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>{error}</p>
                )}

                <Button variant="primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </Button>
            </div>
        </div>
    )
}