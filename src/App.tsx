import { useState } from 'react'
import type { Page } from './types'
import { Sidebar } from './components/layout/sidebar'
import './index.css'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={page} onNavigate={setPage} />

      <main style={{ marginLeft: 220, flex: 1, padding: '36px 40px', maxWidth: 'calc(100vw - 220px)' }}>

      </main>
    </div>
  )
}