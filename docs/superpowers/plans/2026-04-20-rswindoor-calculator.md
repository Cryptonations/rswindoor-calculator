# RSWindoor Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 14 mobile web app for calculating aluminum construction project profit/margin with Hebrew RTL interface.

**Architecture:** Single-page app with a `useCalculator` hook containing all state and formulas, pure presentational components receiving props, CSS Modules + CSS variables for styling.

**Tech Stack:** Next.js 14 (App Router), TypeScript, CSS Modules, Google Fonts (DM Mono)

---

## File Map

| File | Responsibility |
|------|---------------|
| `app/layout.tsx` | RTL html, DM Mono font, viewport meta |
| `app/globals.css` | CSS variables, base reset |
| `app/page.tsx` | Assembles all components, consumes `useCalculator` |
| `types/index.ts` | `CostItem`, `PercentItem` interfaces |
| `hooks/useCalculator.ts` | All state + all computed values + mutation functions |
| `hooks/useCalculator.test.ts` | Unit tests for all formulas |
| `components/Header.tsx` + `.module.css` | Sticky header |
| `components/CostItem.tsx` + `.module.css` | Single editable cost row |
| `components/CostList.tsx` + `.module.css` | All cost rows + percent rows + add button |
| `components/TotalCost.tsx` + `.module.css` | Full-width total card |
| `components/MarginCalculator.tsx` + `.module.css` | Block 2: % input → target price |
| `components/ScenarioReal.tsx` + `.module.css` | Block 3 left: real deal (gold) |
| `components/ScenarioTarget.tsx` + `.module.css` | Block 3 right: target price (blue, auto) |
| `components/DeltaBlock.tsx` + `.module.css` | Delta: green/red |

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: entire project in `C:\Users\vladi\rswindoor-calculator`

- [ ] **Step 1: Scaffold into existing directory**

The `docs/` folder already exists in this directory. Run from inside it:

```bash
cd C:\Users\vladi\rswindoor-calculator
npx create-next-app@14 . --typescript --no-tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

When prompted "Would you like to proceed?", answer `y`. It will create files alongside the existing `docs/` folder.

Expected output: `✓ Success! Created rswindoor-calculator`

- [ ] **Step 2: Remove boilerplate**

```bash
# Remove default Next.js boilerplate content
rm app/page.tsx app/globals.css
# Keep: app/layout.tsx (we'll replace it), public/ can stay
```

- [ ] **Step 3: Install DM Mono font (already available via next/font/google, no install needed)**

Verify Next.js version:
```bash
cat package.json | grep '"next"'
```
Expected: `"next": "14.x.x"`

- [ ] **Step 4: Create directory structure**

```bash
mkdir -p components hooks types
```

- [ ] **Step 5: Commit scaffold**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 project"
```

---

## Task 2: Globals, layout, and types

**Files:**
- Create: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `types/index.ts`

- [ ] **Step 1: Write `app/globals.css`**

```css
:root {
  --bg: #0f0f13;
  --card: #16161f;
  --border: #222230;
  --gold: #c8a84b;
  --blue: #5b8dd9;
  --green: #6db86d;
  --red: #e05c5c;
  --text: #e8e4d9;
  --muted: #888888;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
```

- [ ] **Step 2: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { DM_Mono } from 'next/font/google'
import './globals.css'

const dmMono = DM_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RSWindoor — מחשבון רווח',
  description: 'מחשבון רווח ומרווח לפרויקטי אלומיניום',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={dmMono.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Write `types/index.ts`**

```ts
export interface CostItem {
  id: number
  key: string
  label: string
  value: string | number
}

export interface PercentItem {
  id: number
  key: string
  label: string
  percent: number
}
```

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx types/index.ts
git commit -m "chore: add globals, layout, types"
```

---

## Task 3: useCalculator hook (TDD)

**Files:**
- Create: `hooks/useCalculator.ts`
- Create: `hooks/useCalculator.test.ts`

- [ ] **Step 1: Install testing dependencies**

```bash
npm install --save-dev jest @testing-library/react @testing-library/react-hooks jest-environment-jsdom @types/jest
```

- [ ] **Step 2: Add jest config to `package.json`**

Add inside `package.json` (alongside existing `"scripts"`):

```json
"jest": {
  "testEnvironment": "jsdom",
  "transform": {
    "^.+\\.(ts|tsx)$": ["babel-jest", { "presets": ["next/babel"] }]
  },
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/$1"
  }
},
"scripts": {
  "test": "jest"
}
```

(Merge with existing `scripts` — don't replace `dev`/`build`/`start`.)

- [ ] **Step 3: Write failing tests in `hooks/useCalculator.test.ts`**

```ts
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

describe('useCalculator', () => {
  it('starts with totalCost of 0', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.totalCost).toBe(0)
  })

  it('sums base items correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '10000') }) // אלומיניום
    act(() => { result.current.updateItem(2, '5000') })  // פירזול
    // baseTotal = 15000, percentTotal = 15000 * 0.10 + 15000 * 0.10 = 3000
    // totalCost = 18000
    expect(result.current.totalCost).toBe(18000)
  })

  it('calculates targetPrice correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '90000') })
    // baseTotal = 90000, percentTotal = 18000, totalCost = 108000
    // targetMargin default = 25
    // targetPrice = 108000 / (1 - 0.25) = 144000
    expect(result.current.totalCost).toBe(108000)
    expect(result.current.targetPrice).toBeCloseTo(144000, 0)
  })

  it('calculates realMargin correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '90000') }) // totalCost = 108000
    act(() => { result.current.setClientPrice('135000') })
    // realProfit = 135000 - 108000 = 27000
    // realMargin = (27000 / 135000) * 100 = 20
    expect(result.current.realMargin).toBeCloseTo(20, 1)
  })

  it('calculates delta correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '90000') }) // totalCost=108000, targetPrice=144000
    act(() => { result.current.setClientPrice('130000') })
    // delta = 144000 - 130000 = 14000
    expect(result.current.delta).toBeCloseTo(14000, 0)
  })

  it('addExtraItem increases totalCost', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.addExtraItem('בונוס') })
    const newId = result.current.extraItems[0].id
    act(() => { result.current.updateExtraItem(newId, '5000') })
    // baseTotal = 5000, percentTotal = 1000, totalCost = 6000
    expect(result.current.totalCost).toBe(6000)
  })

  it('removeExtraItem decreases totalCost', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.addExtraItem('בונוס') })
    const id = result.current.extraItems[0].id
    act(() => { result.current.updateExtraItem(id, '5000') })
    act(() => { result.current.removeExtraItem(id) })
    expect(result.current.totalCost).toBe(0)
  })

  it('updatePercentItem changes percentTotal', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.updateItem(1, '10000') })
    act(() => { result.current.updatePercentItem(8, 20) }) // התקנה → 20%
    // baseTotal=10000, percentTotal = 10000*0.20 + 10000*0.10 = 3000, totalCost=13000
    expect(result.current.totalCost).toBe(13000)
  })
})
```

- [ ] **Step 4: Run tests — confirm they FAIL**

```bash
npx jest hooks/useCalculator.test.ts
```

Expected: `Cannot find module './useCalculator'`

- [ ] **Step 5: Implement `hooks/useCalculator.ts`**

```ts
import { useState, useMemo } from 'react'
import type { CostItem, PercentItem } from '@/types'

const DEFAULT_ITEMS: CostItem[] = [
  { id: 1, key: 'aluminum',     label: 'אלומיניום',          value: 0 },
  { id: 2, key: 'hardware',     label: 'פירזול כולל גלילה',  value: 0 },
  { id: 3, key: 'glass',        label: 'זכוכית',             value: 0 },
  { id: 4, key: 'frames',       label: 'משקופים עיוורים',    value: 0 },
  { id: 5, key: 'commission',   label: 'עמלה',               value: 0 },
  { id: 6, key: 'subcontractor',label: 'קבלן משנה',          value: 0 },
  { id: 7, key: 'extras',       label: 'חריגים',             value: 0 },
]

const DEFAULT_PERCENT_ITEMS: PercentItem[] = [
  { id: 8, key: 'install',    label: 'התקנה', percent: 10 },
  { id: 9, key: 'production', label: 'ייצור', percent: 10 },
]

export function useCalculator() {
  const [items, setItems]               = useState<CostItem[]>(DEFAULT_ITEMS)
  const [percentItems, setPercentItems] = useState<PercentItem[]>(DEFAULT_PERCENT_ITEMS)
  const [extraItems, setExtraItems]     = useState<CostItem[]>([])
  const [clientPrice, setClientPrice]   = useState('')
  const [targetMargin, setTargetMargin] = useState(25)

  const baseTotal = useMemo(
    () =>
      items.reduce((s, i) => s + (parseFloat(String(i.value)) || 0), 0) +
      extraItems.reduce((s, i) => s + (parseFloat(String(i.value)) || 0), 0),
    [items, extraItems],
  )

  const percentTotal = useMemo(
    () => percentItems.reduce((s, i) => s + baseTotal * (i.percent / 100), 0),
    [baseTotal, percentItems],
  )

  const totalCost    = baseTotal + percentTotal
  const targetPrice  = targetMargin < 100 ? totalCost / (1 - targetMargin / 100) : 0
  const targetProfit = targetPrice - totalCost
  const realPrice    = parseFloat(clientPrice) || 0
  const realProfit   = realPrice - totalCost
  const realMargin   = realPrice > 0 ? (realProfit / realPrice) * 100 : 0
  const delta        = targetPrice - realPrice

  const updateItem = (id: number, value: string) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, value } : i)))

  const updatePercentItem = (id: number, percent: number) =>
    setPercentItems(prev => prev.map(i => (i.id === id ? { ...i, percent } : i)))

  const addExtraItem = (label: string) =>
    setExtraItems(prev => [
      ...prev,
      { id: Date.now(), key: `extra-${Date.now()}`, label, value: 0 },
    ])

  const removeExtraItem = (id: number) =>
    setExtraItems(prev => prev.filter(i => i.id !== id))

  const updateExtraItem = (id: number, value: string) =>
    setExtraItems(prev => prev.map(i => (i.id === id ? { ...i, value } : i)))

  return {
    items, percentItems, extraItems,
    clientPrice, setClientPrice,
    targetMargin, setTargetMargin,
    baseTotal, totalCost,
    targetPrice, targetProfit,
    realPrice, realProfit, realMargin,
    delta,
    updateItem, updatePercentItem,
    addExtraItem, removeExtraItem, updateExtraItem,
  }
}
```

- [ ] **Step 6: Run tests — confirm they PASS**

```bash
npx jest hooks/useCalculator.test.ts
```

Expected: `7 passed, 7 total`

- [ ] **Step 7: Commit**

```bash
git add hooks/useCalculator.ts hooks/useCalculator.test.ts package.json
git commit -m "feat: add useCalculator hook with tests"
```

---

## Task 4: Header component

**Files:**
- Create: `components/Header.tsx`
- Create: `components/Header.module.css`

- [ ] **Step 1: Write `components/Header.module.css`**

```css
.header {
  background: var(--bg);
  border-bottom: 1px solid #1e1e2a;
  padding: 18px 20px 14px;
  position: sticky;
  top: 0;
  z-index: 20;
}

.sub {
  font-size: 10px;
  color: #555;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}
```

- [ ] **Step 2: Write `components/Header.tsx`**

```tsx
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.sub}>RSWindoor</div>
      <div className={styles.title}>מחשבון רווח</div>
    </header>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx components/Header.module.css
git commit -m "feat: add Header component"
```

---

## Task 5: CostItem component

**Files:**
- Create: `components/CostItem.tsx`
- Create: `components/CostItem.module.css`

- [ ] **Step 1: Write `components/CostItem.module.css`**

```css
.card {
  background: var(--card);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 8px;
  border: 1px solid #1e1e2a;
  display: flex;
  align-items: center;
  gap: 10px;
}

.symbol {
  color: #444;
  font-size: 13px;
  flex-shrink: 0;
}

.input {
  width: 110px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #2a2a3a;
  color: var(--text);
  font-size: 16px;
  font-family: inherit;
  text-align: left;
  padding: 2px 0;
  outline: none;
  direction: ltr;
}

.label {
  flex: 1;
  font-size: 14px;
  color: #ccc;
  text-align: right;
}

.removeBtn {
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  font-size: 18px;
  padding: 0 4px;
  line-height: 1;
  flex-shrink: 0;
}

.removeBtn:hover {
  color: var(--red);
}
```

- [ ] **Step 2: Write `components/CostItem.tsx`**

```tsx
import styles from './CostItem.module.css'

interface Props {
  label: string
  value: string | number
  onChange: (value: string) => void
  removable?: boolean
  onRemove?: () => void
}

export default function CostItem({ label, value, onChange, removable, onRemove }: Props) {
  return (
    <div className={styles.card}>
      {removable && (
        <button className={styles.removeBtn} onClick={onRemove} aria-label="הסר">
          ×
        </button>
      )}
      <span className={styles.symbol}>₪</span>
      <input
        type="number"
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        inputMode="numeric"
      />
      <div className={styles.label}>{label}</div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/CostItem.tsx components/CostItem.module.css
git commit -m "feat: add CostItem component"
```

---

## Task 6: CostList component

**Files:**
- Create: `components/CostList.tsx`
- Create: `components/CostList.module.css`

- [ ] **Step 1: Write `components/CostList.module.css`**

```css
.sectionLabel {
  font-size: 10px;
  color: #666;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 20px 0 10px;
}

.pctCard {
  background: var(--card);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 8px;
  border: 1px solid #1e1e2a;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pctSymbol {
  color: #444;
  font-size: 13px;
  flex-shrink: 0;
}

.pctAmount {
  color: var(--muted);
  font-size: 14px;
  min-width: 70px;
  text-align: left;
  direction: ltr;
}

.pctInput {
  width: 50px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #2a2a3a;
  color: var(--gold);
  font-size: 16px;
  font-family: inherit;
  text-align: center;
  padding: 2px 0;
  outline: none;
}

.pctSign {
  color: var(--gold);
  font-size: 13px;
  flex-shrink: 0;
}

.pctLabel {
  flex: 1;
  font-size: 14px;
  color: #ccc;
  text-align: right;
}

.addBtn {
  width: 100%;
  background: transparent;
  border: 1px dashed #2a2a3a;
  border-radius: 10px;
  color: #555;
  padding: 10px;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  letter-spacing: 1px;
  margin-top: 4px;
}

.addBtn:hover {
  border-color: #444;
  color: #888;
}

.addRow {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.addInput {
  flex: 1;
  background: var(--card);
  border: 1px solid #333;
  border-radius: 8px;
  color: var(--text);
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  text-align: right;
}

.addConfirm {
  background: var(--gold);
  border: none;
  border-radius: 8px;
  color: var(--bg);
  padding: 10px 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.addCancel {
  background: #222;
  border: none;
  border-radius: 8px;
  color: var(--muted);
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
}
```

- [ ] **Step 2: Write `components/CostList.tsx`**

```tsx
import { useState } from 'react'
import type { CostItem, PercentItem } from '@/types'
import CostItemComponent from './CostItem'
import styles from './CostList.module.css'

function fmt(n: number) {
  return Math.round(n).toLocaleString('he-IL')
}

interface Props {
  items: CostItem[]
  percentItems: PercentItem[]
  extraItems: CostItem[]
  baseTotal: number
  onUpdateItem: (id: number, value: string) => void
  onUpdatePercent: (id: number, percent: number) => void
  onUpdateExtra: (id: number, value: string) => void
  onAddExtra: (label: string) => void
  onRemoveExtra: (id: number) => void
}

export default function CostList({
  items, percentItems, extraItems, baseTotal,
  onUpdateItem, onUpdatePercent, onUpdateExtra, onAddExtra, onRemoveExtra,
}: Props) {
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')

  function confirmAdd() {
    if (!newLabel.trim()) return
    onAddExtra(newLabel.trim())
    setNewLabel('')
    setAdding(false)
  }

  return (
    <div>
      <div className={styles.sectionLabel}>הוצאות</div>

      {items.map(item => (
        <CostItemComponent
          key={item.id}
          label={item.label}
          value={item.value}
          onChange={v => onUpdateItem(item.id, v)}
        />
      ))}

      {extraItems.map(item => (
        <CostItemComponent
          key={item.id}
          label={item.label}
          value={item.value}
          onChange={v => onUpdateExtra(item.id, v)}
          removable
          onRemove={() => onRemoveExtra(item.id)}
        />
      ))}

      <div className={styles.sectionLabel} style={{ marginTop: 16 }}>% מהסכום</div>

      {percentItems.map(item => (
        <div key={item.id} className={styles.pctCard}>
          <span className={styles.pctSymbol}>₪</span>
          <span className={styles.pctAmount}>{fmt(baseTotal * (item.percent / 100))}</span>
          <input
            type="number"
            className={styles.pctInput}
            value={item.percent}
            onChange={e => onUpdatePercent(item.id, parseFloat(e.target.value) || 0)}
            inputMode="decimal"
          />
          <span className={styles.pctSign}>%</span>
          <div className={styles.pctLabel}>{item.label}</div>
        </div>
      ))}

      {adding ? (
        <div className={styles.addRow}>
          <input
            autoFocus
            className={styles.addInput}
            placeholder="שם הסעיף..."
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && confirmAdd()}
          />
          <button className={styles.addConfirm} onClick={confirmAdd}>✓</button>
          <button className={styles.addCancel} onClick={() => setAdding(false)}>✕</button>
        </div>
      ) : (
        <button className={styles.addBtn} onClick={() => setAdding(true)}>
          + הוסף סעיף
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/CostList.tsx components/CostList.module.css
git commit -m "feat: add CostList component"
```

---

## Task 7: TotalCost component

**Files:**
- Create: `components/TotalCost.tsx`
- Create: `components/TotalCost.module.css`

- [ ] **Step 1: Write `components/TotalCost.module.css`**

```css
.card {
  background: #1a1a26;
  border-radius: 12px;
  padding: 14px 16px;
  margin: 16px 0;
  border: 1px solid #2a2a3a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  direction: ltr;
}
```

- [ ] **Step 2: Write `components/TotalCost.tsx`**

```tsx
import styles from './TotalCost.module.css'

interface Props {
  totalCost: number
}

function fmt(n: number) {
  return Math.round(n).toLocaleString('he-IL')
}

export default function TotalCost({ totalCost }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>סה"כ הוצאות</div>
      <div className={styles.value}>₪ {fmt(totalCost)}</div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/TotalCost.tsx components/TotalCost.module.css
git commit -m "feat: add TotalCost component"
```

---

## Task 8: MarginCalculator component (Block 2)

**Files:**
- Create: `components/MarginCalculator.tsx`
- Create: `components/MarginCalculator.module.css`

- [ ] **Step 1: Write `components/MarginCalculator.module.css`**

```css
.block {
  background: var(--card);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #2a2a3a;
}

.title {
  font-size: 10px;
  color: #666;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;
  text-align: center;
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 14px;
}

.inputGroup {
  text-align: center;
}

.inputLabel {
  font-size: 10px;
  color: #666;
  margin-bottom: 4px;
}

.inputWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.pctSign {
  color: var(--blue);
  font-size: 20px;
}

.input {
  width: 80px;
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--blue);
  color: var(--blue);
  font-size: 28px;
  font-weight: 700;
  font-family: inherit;
  text-align: center;
  padding: 2px 0;
  outline: none;
}

.arrow {
  color: #333;
  font-size: 24px;
}

.priceGroup {
  text-align: center;
}

.priceLabel {
  font-size: 10px;
  color: #666;
  margin-bottom: 4px;
}

.priceValue {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  direction: ltr;
}

.profit {
  text-align: center;
  font-size: 12px;
  color: #555;
}

.profitValue {
  color: var(--blue);
}
```

- [ ] **Step 2: Write `components/MarginCalculator.tsx`**

```tsx
import styles from './MarginCalculator.module.css'

interface Props {
  targetMargin: number
  targetPrice: number
  targetProfit: number
  onChangeMargin: (value: number) => void
}

function fmt(n: number) {
  return Math.round(n).toLocaleString('he-IL')
}

export default function MarginCalculator({ targetMargin, targetPrice, targetProfit, onChangeMargin }: Props) {
  return (
    <div className={styles.block}>
      <div className={styles.title}>מחשבון מרווח</div>
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>מרווח יעד</div>
          <div className={styles.inputWrap}>
            <span className={styles.pctSign}>%</span>
            <input
              type="number"
              className={styles.input}
              value={targetMargin}
              onChange={e => onChangeMargin(parseFloat(e.target.value) || 0)}
              inputMode="decimal"
            />
          </div>
        </div>
        <div className={styles.arrow}>←</div>
        <div className={styles.priceGroup}>
          <div className={styles.priceLabel}>מחיר ללקוח</div>
          <div className={styles.priceValue}>₪ {fmt(targetPrice)}</div>
        </div>
      </div>
      <div className={styles.profit}>
        רווח: <span className={styles.profitValue}>₪ {fmt(targetProfit)}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/MarginCalculator.tsx components/MarginCalculator.module.css
git commit -m "feat: add MarginCalculator component"
```

---

## Task 9: Block 3 — ScenarioReal, ScenarioTarget, DeltaBlock

**Files:**
- Create: `components/ScenarioReal.tsx` + `.module.css`
- Create: `components/ScenarioTarget.tsx` + `.module.css`
- Create: `components/DeltaBlock.tsx` + `.module.css`

- [ ] **Step 1: Write shared `components/Scenario.module.css`**

Both scenario cards share most styles. We'll use one CSS module for both.

```css
.card {
  background: var(--card);
  border-radius: 12px;
  padding: 14px 12px;
}

.cardGold {
  border: 1px solid rgba(200, 168, 75, 0.2);
}

.cardBlue {
  border: 1px solid rgba(91, 141, 217, 0.2);
}

.title {
  font-size: 9px;
  color: #666;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
  text-align: center;
}

.inputWrap {
  margin-bottom: 10px;
}

.inputLabel {
  font-size: 10px;
  color: #666;
  margin-bottom: 3px;
}

.inputGold {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--gold);
  color: var(--gold);
  font-size: 18px;
  font-weight: 700;
  font-family: inherit;
  text-align: left;
  padding: 2px 0;
  outline: none;
  direction: ltr;
  box-sizing: border-box;
}

.staticBlue {
  font-size: 18px;
  font-weight: 700;
  color: var(--blue);
  padding-bottom: 2px;
  border-bottom: 2px solid var(--blue);
  direction: ltr;
}

.row {
  margin-bottom: 6px;
}

.rowLabel {
  font-size: 10px;
  color: #666;
  margin-bottom: 1px;
}

.rowValue {
  font-size: 15px;
  font-weight: 600;
  direction: ltr;
  text-align: left;
}

.badge {
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  margin-top: 8px;
}

.badgeLabel {
  font-size: 9px;
  color: var(--muted);
  margin-bottom: 2px;
}

.badgeValue {
  font-size: 22px;
  font-weight: 700;
}
```

- [ ] **Step 2: Write `components/ScenarioReal.tsx`**

```tsx
import styles from './Scenario.module.css'

interface Props {
  clientPrice: string
  realProfit: number
  realMargin: number
  targetMargin: number
  onChangePrice: (value: string) => void
}

function fmt(n: number) {
  return Math.round(n).toLocaleString('he-IL')
}

function pct(n: number) {
  return isFinite(n) ? n.toFixed(1) : '0.0'
}

export default function ScenarioReal({ clientPrice, realProfit, realMargin, targetMargin, onChangePrice }: Props) {
  const good = realMargin >= targetMargin

  return (
    <div className={`${styles.card} ${styles.cardGold}`}>
      <div className={styles.title}>עסקה אמיתית</div>
      <div className={styles.inputWrap}>
        <div className={styles.inputLabel}>מחיר ללקוח ₪</div>
        <input
          type="number"
          className={styles.inputGold}
          value={clientPrice}
          onChange={e => onChangePrice(e.target.value)}
          placeholder="0"
          inputMode="numeric"
        />
      </div>
      <div className={styles.row}>
        <div className={styles.rowLabel}>רווח</div>
        <div
          className={styles.rowValue}
          style={{ color: realProfit >= 0 ? 'var(--green)' : 'var(--red)' }}
        >
          ₪ {fmt(realProfit)}
        </div>
      </div>
      <div
        className={styles.badge}
        style={{ background: good ? '#0f2a0f' : '#2a0f0f' }}
      >
        <div className={styles.badgeLabel}>מרווח</div>
        <div
          className={styles.badgeValue}
          style={{ color: good ? 'var(--green)' : 'var(--red)' }}
        >
          {pct(realMargin)}%
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write `components/ScenarioTarget.tsx`**

```tsx
import styles from './Scenario.module.css'

interface Props {
  targetPrice: number
  targetProfit: number
  targetMargin: number
}

function fmt(n: number) {
  return Math.round(n).toLocaleString('he-IL')
}

export default function ScenarioTarget({ targetPrice, targetProfit, targetMargin }: Props) {
  return (
    <div className={`${styles.card} ${styles.cardBlue}`}>
      <div className={styles.title}>מחיר יעד</div>
      <div className={styles.inputWrap}>
        <div className={styles.inputLabel}>מחיר ללקוח ₪</div>
        <div className={styles.staticBlue}>{fmt(targetPrice)}</div>
      </div>
      <div className={styles.row}>
        <div className={styles.rowLabel}>רווח</div>
        <div className={styles.rowValue} style={{ color: 'var(--blue)' }}>
          ₪ {fmt(targetProfit)}
        </div>
      </div>
      <div className={styles.badge} style={{ background: '#0f1a2a' }}>
        <div className={styles.badgeLabel}>מרווח</div>
        <div className={styles.badgeValue} style={{ color: 'var(--blue)' }}>
          {targetMargin.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write `components/DeltaBlock.module.css`**

```css
.card {
  border-radius: 12px;
  padding: 14px 16px;
  text-align: center;
}

.label {
  font-size: 10px;
  color: #666;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.value {
  font-size: 26px;
  font-weight: 700;
  direction: ltr;
}
```

- [ ] **Step 5: Write `components/DeltaBlock.tsx`**

```tsx
import styles from './DeltaBlock.module.css'

interface Props {
  delta: number
  realPrice: number
}

function fmt(n: number) {
  return Math.round(n).toLocaleString('he-IL')
}

export default function DeltaBlock({ delta, realPrice }: Props) {
  if (realPrice <= 0) return null

  const surplus = delta <= 0
  return (
    <div
      className={styles.card}
      style={{
        background: surplus ? '#0f1f0f' : '#1f0f0f',
        border: `1px solid ${surplus ? '#2d4a2d' : '#4a2d2d'}`,
      }}
    >
      <div className={styles.label}>
        {surplus ? 'עודף על מחיר היעד' : 'חסר עד מחיר היעד'}
      </div>
      <div
        className={styles.value}
        style={{ color: surplus ? 'var(--green)' : 'var(--red)' }}
      >
        {surplus ? '+' : '−'} ₪ {fmt(Math.abs(delta))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/ScenarioReal.tsx components/ScenarioTarget.tsx components/DeltaBlock.tsx components/Scenario.module.css components/DeltaBlock.module.css
git commit -m "feat: add Block 3 components (scenarios + delta)"
```

---

## Task 10: Assemble page.tsx

**Files:**
- Create: `app/page.tsx`
- Create: `app/page.module.css`

- [ ] **Step 1: Write `app/page.module.css`**

```css
.page {
  min-height: 100vh;
  padding-bottom: 48px;
}

.content {
  padding: 0 16px;
}

.sectionLabel {
  font-size: 10px;
  color: #666;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 20px 0 10px;
}

.scenariosGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}
```

- [ ] **Step 2: Write `app/page.tsx`**

```tsx
'use client'

import { useCalculator } from '@/hooks/useCalculator'
import Header from '@/components/Header'
import CostList from '@/components/CostList'
import TotalCost from '@/components/TotalCost'
import MarginCalculator from '@/components/MarginCalculator'
import ScenarioReal from '@/components/ScenarioReal'
import ScenarioTarget from '@/components/ScenarioTarget'
import DeltaBlock from '@/components/DeltaBlock'
import styles from './page.module.css'

export default function Page() {
  const calc = useCalculator()

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.content}>
        <CostList
          items={calc.items}
          percentItems={calc.percentItems}
          extraItems={calc.extraItems}
          baseTotal={calc.baseTotal}
          onUpdateItem={calc.updateItem}
          onUpdatePercent={calc.updatePercentItem}
          onUpdateExtra={calc.updateExtraItem}
          onAddExtra={calc.addExtraItem}
          onRemoveExtra={calc.removeExtraItem}
        />
        <TotalCost totalCost={calc.totalCost} />
        <MarginCalculator
          targetMargin={calc.targetMargin}
          targetPrice={calc.targetPrice}
          targetProfit={calc.targetProfit}
          onChangeMargin={calc.setTargetMargin}
        />
        <div className={styles.sectionLabel}>השוואה</div>
        <div className={styles.scenariosGrid}>
          <ScenarioReal
            clientPrice={calc.clientPrice}
            realProfit={calc.realProfit}
            realMargin={calc.realMargin}
            targetMargin={calc.targetMargin}
            onChangePrice={calc.setClientPrice}
          />
          <ScenarioTarget
            targetPrice={calc.targetPrice}
            targetProfit={calc.targetProfit}
            targetMargin={calc.targetMargin}
          />
        </div>
        <DeltaBlock delta={calc.delta} realPrice={calc.realPrice} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Run dev server to verify visually**

```bash
npm run dev
```

Open `http://localhost:3000` in a mobile-sized browser window (375px wide).

Verify:
- RTL layout (Hebrew text right-aligned)
- All 7 cost rows visible with ₪ inputs
- Percent items (התקנה/ייצור) show computed ₪ + editable %
- "+ הוסף סעיף" button with dashed border
- Total cost card updates on input change
- Margin calculator: change % → price updates instantly
- Two scenario cards side by side (gold/blue)
- Delta hidden until real price entered
- Delta green when real ≥ target, red when below

- [ ] **Step 4: Run tests to confirm logic still passes**

```bash
npx jest
```

Expected: `7 passed`

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/page.module.css
git commit -m "feat: assemble main page with all components"
```

---

## Task 11: Build verification + deploy setup

**Files:**
- No new files — verify production build

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

If TypeScript errors appear, fix them before proceeding.

- [ ] **Step 2: Create GitHub repository**

```bash
gh repo create rswindoor-calculator --public --source=. --remote=origin --push
```

Expected: Repository created at `https://github.com/<username>/rswindoor-calculator`

- [ ] **Step 3: Push to GitHub**

```bash
git push -u origin main
```

- [ ] **Step 4: Deploy to Vercel via CLI**

```bash
npx vercel --prod
```

Follow prompts:
- Link to existing project? **No**
- Project name: `rswindoor-calculator`
- Directory: `./`

Expected: `✅ Production: https://rswindoor-calculator.vercel.app`

- [ ] **Step 5: Verify on mobile**

Open the Vercel URL on an iPhone/mobile browser. Confirm:
- Interface loads correctly
- Hebrew RTL layout
- All inputs work
- Calculations correct

---

## Self-Review

**Spec coverage:**
- ✅ 7 fixed cost items (Task 3, Task 5)
- ✅ התקנה/ייצור as % of baseTotal (Task 3, Task 6)
- ✅ Add/remove extra items (Task 6)
- ✅ TotalCost full-width (Task 7)
- ✅ MarginCalculator Block 2 (Task 8)
- ✅ ScenarioReal gold + ScenarioTarget blue (Task 9)
- ✅ Delta green/red (Task 9)
- ✅ Delta hidden until real price entered (Task 9)
- ✅ Instant recalc, no button (all inputs use onChange)
- ✅ RTL Hebrew (layout.tsx)
- ✅ DM Mono font (layout.tsx)
- ✅ CSS variables (globals.css)
- ✅ Vercel deploy (Task 11)

**Placeholder scan:** No TBD/TODO found.

**Type consistency:** `CostItem`/`PercentItem` defined in `types/index.ts` Task 2, used consistently in hook (Task 3) and components (Tasks 5-9). `updateItem(id, value: string)` consistent throughout.
