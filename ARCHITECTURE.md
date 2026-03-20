# ARCHITECTURE.md

> Authoritative reference for the feito-com-amor codebase. Read this at the start of every session before making any change. Update it immediately after any structural change.

---

## 1. Overview

"Feito com Amor" is an admin dashboard for a handmade crafts business. It manages products, stock, sales, and generates monthly financial reports as PDFs.

**Three sellers (hardcoded):** Fatima, Tania, Antonio — defined in `src/types/index.ts` as `SELLERS`.

**Stack:**
- React 19.2 + TypeScript 5.9
- Vite 7.3
- Supabase (auth + database + storage)
- TanStack React Query v5 (server state)
- jsPDF + jspdf-autotable (PDF reports)
- CSS variables (custom design system — Tailwind is installed but NOT used)

---

## 2. Navigation Model

No React Router. Navigation is purely state-based.

- `App.tsx` holds `useState<Page>('dashboard')`
- `Sidebar` calls `onNavigate(page)` to switch the active view
- `App.tsx` renders the correct feature component via conditionals

```ts
type Page = 'dashboard' | 'catalog' | 'stock' | 'sales' | 'finance'
```

---

## 3. Directory Structure

```
src/
├── main.tsx                        # Entry: StrictMode + QueryClientProvider
├── App.tsx                         # Root state, layout, conditional rendering
├── index.css                       # Design tokens (CSS variables) + body styles
├── App.css                         # Unused Vite boilerplate — do not touch
│
├── types/
│   └── index.ts                    # All types, interfaces, SELLERS constant
│
├── lib/
│   ├── supabase.ts                 # Supabase client (reads .env)
│   ├── utils.ts                    # Utility functions (see section 9)
│   └── generateReport.ts           # PDF generation via jsPDF + autotable
│
├── hooks/
│   ├── useAuth.ts                  # Auth session, signIn, signOut
│   ├── useProducts.ts              # Products CRUD + stock mutations
│   ├── useSales.ts                 # Sales list + addSale + revenue helpers
│   └── useUpload.ts                # Image upload to Supabase Storage
│
├── components/
│   ├── ui/
│   │   └── index.tsx               # All shared UI components (see section 7)
│   └── layout/
│       └── sidebar.tsx             # Fixed 220px left sidebar
│
├── features/
│   ├── auth/
│   │   └── login.tsx               # Email/password login form
│   ├── dashboard/
│   │   └── dashboard.tsx           # KPIs, recent sales, low stock alerts
│   ├── catalog/
│   │   ├── catalog.tsx             # Product grid + search
│   │   ├── productCard.tsx         # Individual product card
│   │   └── productModal.tsx        # Add/edit product form (uses useUpload)
│   ├── stock/
│   │   └── stock.tsx               # Stock table + delta adjustment modal
│   ├── sales/
│   │   └── sales.tsx               # Sales log + filters + add sale modal
│   └── finance/
│       ├── finance.tsx             # Revenue charts + seller breakdown
│       └── ReportButton.tsx        # PDF export trigger
│
└── mocks/
    └── index.ts                    # Mock data — NOT used in production
```

---

## 4. Supabase Schema

**Tables:**

| Table | Columns |
|-------|---------|
| `products` | id, name, description, price, quantity, image, created_at |
| `sales` | id, sold_at (mapped to `date`), total, notes, seller |
| `sale_items` | id, sale_id, product_id (mapped to `productId`), quantity (mapped to `qty`), unit_price (mapped to `unitPrice`) |

**Storage bucket:** `products` (public) — for product images.

**React Query keys:** `['products']`, `['sales']`

> Note: DB uses snake_case. `useSales.ts` maps `sold_at -> date`, `product_id -> productId`, `unit_price -> unitPrice`.

---

## 5. Data Flow

```
Supabase
   |
   |  (React Query fetching)
   v
useProducts / useSales / useAuth
   |
   |  (passed as props + callbacks)
   v
App.tsx  ------>  Feature Pages (Dashboard, Catalog, Stock, Sales, Finance)
                        |
                        |  (local UI state: modals, filters, search)
                        v
                   UI Components (src/components/ui/)
```

- `App.tsx` is the only place hooks are called (except `productModal.tsx` which uses `useUpload` directly)
- All mutations call `queryClient.invalidateQueries` on success
- `addSale` invalidates both `['sales']` AND `['products']` (stock is decremented on sale)
- Feature pages manage their own UI state (modals, search, filters) via local `useState`

---

## 6. Design System

**CSS variables** defined in `src/index.css`:

```css
--bg:       #faf7f2   /* page background (light beige) */
--surface:  #ffffff   /* card/modal background */
--surface2: #f3ede3   /* secondary surface */
--border:   #e8dece   /* borders */
--text:     #2c2416   /* primary text (dark brown) */
--text2:    #7a6a52   /* secondary text (medium brown) */
--accent:   #b5651d   /* primary accent (gold-brown) */
--accent2:  #8b4513   /* secondary accent (darker brown) */
--green:    #4a7c59   /* success */
--red:      #c0392b   /* error/danger */
--yellow:   #e6a817   /* warning */
```

**Fonts** (via Google Fonts in `index.html`):
- Playfair Display — headings/display
- DM Sans — body text

**Styling pattern:** inline styles using CSS variable references:
```tsx
style={{ color: 'var(--accent)', background: 'var(--surface)' }}
```

Do NOT introduce CSS modules, styled-components, or Tailwind utilities. The design system is intentionally CSS-variable-based.

---

## 7. UI Components Reference

All in `src/components/ui/index.tsx`. **Always check here before creating a new component.**

| Component | Key Props | Purpose |
|-----------|-----------|---------|
| `Badge` | `variant: 'green'\|'yellow'\|'red'` | Inline colored status badge |
| `Button` | `variant?: 'primary'\|'ghost'\|'danger'` | Styled action button |
| `StatCard` | `label, value, sub?, accent?` | KPI card with top accent bar |
| `Modal` | `title, onClose, width?, disableOutsideClick?` | Centered modal with backdrop |
| `FormField` | `label, children` | Form field wrapper with label |
| `Input` | HTMLInputAttributes | Styled text input |
| `Select` | HTMLSelectAttributes | Styled select dropdown |
| `Textarea` | HTMLTextareaAttributes | Styled textarea (no resize) |
| `PageHeader` | `title, subtitle?` | Page-level heading |
| `TableCard` | `title?, action?, children` | Card container for tables |

---

## 8. Type Reference

From `src/types/index.ts`:

```ts
interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  image: string
  created_at?: string
}

interface SaleItem {
  productId: number
  qty: number
  unitPrice: number
}

interface Sale {
  id: number
  date: string        // YYYY-MM-DD
  items: SaleItem[]
  total: number
  notes: string
  seller: string
}

type Page = 'dashboard' | 'catalog' | 'stock' | 'sales' | 'finance'

const SELLERS = ['Fatima', 'Tania', 'Antonio'] as const
type Seller = typeof SELLERS[number]
```

---

## 9. Key Utilities

All in `src/lib/utils.ts`. **Use these everywhere. Never reimplement.**

| Function | Signature | Returns |
|----------|-----------|---------|
| `fmt` | `(value: number) => string` | BRL currency (e.g. `R$ 12,50`) |
| `formatDate` | `(dateStr: string) => string` | YYYY-MM-DD to DD/MM/YYYY |
| `formatFullDate` | `(dateStr: string) => string` | Full PT-BR date with weekday |
| `today` | `() => string` | Current date as YYYY-MM-DD |
| `getStockStatus` | `(qty: number) => 'ok'\|'low'\|'empty'` | 0=empty, <=2=low, else ok |

---

## 10. Gotchas

- **Stock lives on `products` table** — there is no separate stock table. `quantity` field on `products` IS the stock.
- **Tailwind is installed but unused.** `index.css` uses `@import "tailwindcss"` but the actual styling is 100% CSS variables + inline styles.
- **TypeScript strict mode is ON** (`noUnusedLocals`, `noUnusedParameters`). Build fails on unused variables.
- **`context/` and `test/` dirs are empty** — context is not used, tests do not exist.
- **`App.css` is unused** — Vite boilerplate, leave it alone.
- **`mocks/index.ts` is unused** — not imported anywhere in production code.
- **Product images** can be HTTP URLs or emoji characters. Components fall back to emoji if no URL is set.
- **Stock adjustments are safe** — `stock.tsx` prevents delta adjustments from going below 0.
- **DB column mapping in `useSales.ts`** — `sold_at`, `product_id`, `unit_price` are renamed when mapping from DB rows to `Sale`/`SaleItem` types.
- **`addSale` invalidates products too** — because registering a sale decrements stock on the `products` table.
