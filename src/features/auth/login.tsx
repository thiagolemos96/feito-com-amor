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
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-2xl p-10 w-full max-w-sm">
                <h1 className="font-display text-[28px] font-bold text-text mb-1">
                    Feito com Amor
                </h1>
                <p className="text-muted text-[14px] mb-8">Gestão de Artesanato</p>

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
                    <p className="text-danger text-[13px] mb-4">{error}</p>
                )}

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </Button>
            </div>
        </div>
    )
}
