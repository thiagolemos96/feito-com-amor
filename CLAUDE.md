# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- **NEVER run `git push` or any command that uploads to a remote repository.** All git work stays local. Use `/commit` only.
- **Read `ARCHITECTURE.md` at the start of every session before making any change.** It is the authoritative reference for structure, patterns, and conventions. After any change that affects architecture (new file, new hook, schema change, new component, design token, etc.), update `ARCHITECTURE.md` immediately.

## What this project is

"Feito com Amor" is a management dashboard for a handmade crafts business. It tracks products, stock, sales, and generates monthly financial reports. Three sellers: Fatima, Tania, Antonio (hardcoded in `src/types/index.ts` as `SELLERS`).

## Commands

```bash
npm run dev       # Dev server (Vite)
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # Serve production build locally
```

## Environment

Requires a `.env` file at the project root:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The Supabase client is initialized in `src/lib/supabase.ts`.

## Architecture

### Feature-based structure

Each page is a self-contained module under `src/features/`:

| Feature | Route (Page type) | Description |
|---|---|---|
| `auth/login.tsx` | login | Email/password auth via Supabase |
| `dashboard/dashboard.tsx` | dashboard | Overview stats, recent sales, low stock alerts |
| `catalog/` | catalog | Product grid, add/edit/delete, image upload |
| `stock/stock.tsx` | stock | Table sorted by quantity, delta-based adjustments |
| `sales/sales.tsx` | sales | Monthly/daily filters, multi-item sale modal |
| `finance/finance.tsx` | finance | Revenue charts, seller breakdown, PDF export |

Navigation is done by setting the `Page` type (not React Router). `App.tsx` renders the active page based on a `currentPage` state passed from the sidebar.

### Data layer

React Query handles all server state. Hooks live in `src/hooks/`:

- `useAuth.ts`: session management, signIn, signOut
- `useProducts.ts`: products list (joined with stock quantity), add/edit/delete/upload mutations
- `useSales.ts`: sales list (with `sale_items` relationship), add mutation
- `useUpload.ts`: image upload to Supabase Storage bucket `products`

Query keys: `['products']`, `['sales']`. All mutations call `queryClient.invalidateQueries` on success.

### Supabase schema

Tables: `products`, `sales`, `sale_items`

- `products`: id, name, description, price, quantity, image, created_at
- `sales`: id, date, total, notes, seller
- `sale_items`: productId, qty, unitPrice (child of sales)

Storage bucket: `products` (public, for product images).

### Type system

All types defined in `src/types/index.ts`. Add new types here. Key ones:

```ts
type Page = 'dashboard' | 'catalog' | 'stock' | 'sales' | 'finance'
const SELLERS = ['Fatima', 'Tania', 'Antonio']
```

### Utilities (src/lib/utils.ts)

- `fmt(value)`: formats number as BRL currency
- `formatDate(dateStr)`: YYYY-MM-DD to DD/MM/YYYY
- `formatFullDate(dateStr)`: full date with weekday (pt-BR)
- `today()`: returns current date as YYYY-MM-DD
- `getStockStatus(qty)`: returns `'ok' | 'low' | 'empty'`

Use these everywhere. Do not re-implement currency or date formatting inline.

### PDF generation

`src/lib/generateReport.ts` uses jsPDF + jspdf-autotable to generate branded monthly reports. Called from `finance/ReportButton.tsx`. Styled to match the app's design tokens.

## Design system

Tailwind CSS v4 is used. The syntax is `@import "tailwindcss"` in `index.css` (not `@tailwind base/components/utilities`). There is no `tailwind.config.js`.

Design tokens are CSS variables defined in `index.css`:

```css
--bg, --surface, --text, --accent, --green, --red, --yellow
```

Fonts: **Playfair Display** (headings), **DM Sans** (body). Both loaded via Google Fonts in `index.html`.

UI components (Badge, Button, StatCard, Modal, FormField, Input, Select, Textarea, PageHeader, TableCard) are all in `src/components/ui/index.tsx`. Use these before creating new ones.

Components use inline styles referencing CSS variables (e.g. `style={{ color: 'var(--accent)' }}`). This is the established pattern. Do not introduce CSS modules or styled-components.

## Gotchas

- `context/` and `test/` directories exist but are empty. Context is not used; state is managed via React Query + local component state.
- Product images fall back to an emoji if no image URL is set.
- Stock quantity lives on the `products` table (not a separate stock table).
- `App.css` exists but is unused boilerplate from Vite scaffolding.
- TypeScript strict mode is on (`noUnusedLocals`, `noUnusedParameters`). Build will fail if you leave unused vars.
