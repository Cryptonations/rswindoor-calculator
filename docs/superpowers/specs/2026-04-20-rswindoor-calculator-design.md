# RSWindoor Calculator — Design Spec
**Date:** 2026-04-20
**Version:** 1.0
**Status:** Approved

---

## Overview

Mobile web app replacing an Excel spreadsheet for calculating profit and margin on aluminum construction projects. Hebrew RTL interface, dark theme, instant recalculation.

**Path:** `C:\Users\vladi\rswindoor-calculator`
**Stack:** Next.js 14 (App Router) + TypeScript + CSS Modules + CSS variables
**Deploy:** Vercel (`rswindoor-calculator.vercel.app`)

---

## Architecture

**Approach:** Component-per-block + single logic hook.

```
app/
├── layout.tsx          # RTL, DM Mono font, dark bg, viewport meta
├── page.tsx            # Assembles all components, passes data from hook
└── globals.css         # CSS variables: --bg, --card, --gold, --blue, etc.
components/
├── Header.tsx          # "RSWindoor / מחשבון רווח"
├── CostItem.tsx        # Single cost row (label + ₪ input)
├── CostList.tsx        # All cost rows + percent items + add button
├── TotalCost.tsx       # Total costs — full width
├── MarginCalculator.tsx # Block 2: enter % → see target price
├── ScenarioReal.tsx    # Block 3 left: real deal (gold)
├── ScenarioTarget.tsx  # Block 3 right: target price (blue, auto)
└── DeltaBlock.tsx      # Delta: green/red
hooks/
└── useCalculator.ts    # All state + all formulas
types/
└── index.ts            # CostItem, PercentItem, CalculatorState
```

**Data flow:** `useCalculator` → `page.tsx` → props to each component. No Context or Redux needed.

---

## Data Model

```ts
interface CostItem {
  id: number
  key: string
  label: string
  value: string | number
}

interface PercentItem {
  id: number
  key: string
  label: string
  percent: number
}
```

**Initial state:**
- `items`: 7 fixed rows (אלומיניום, פירזול כולל גלילה, זכוכית, משקופים עיוורים, עמלה, קבלן משנה, חריגים) — all value 0
- `percentItems`: [התקנה 10%, ייצור 10%]
- `extraItems`: [] (user-added)
- `clientPrice`: "" 
- `targetMargin`: 25

---

## Formulas

```
baseTotal    = Σ items.value + Σ extraItems.value
percentTotal = Σ (baseTotal × percent / 100)
totalCost    = baseTotal + percentTotal

targetPrice  = totalCost / (1 − targetMargin / 100)
targetProfit = targetPrice − totalCost

realPrice    = parseFloat(clientPrice) || 0
realProfit   = realPrice − totalCost
realMargin   = realPrice > 0 ? (realProfit / realPrice) × 100 : 0

delta        = targetPrice − realPrice
```

**Margin color threshold:** dynamic — green if `realMargin ≥ targetMargin`, red if below.

---

## UX Layout (mobile, top to bottom)

```
┌─────────────────────────┐
│ Header (sticky)         │  RSWindoor / מחשבון רווח
├─────────────────────────┤
│ BLOCK 1: הוצאות         │  7 cards + % items + "+ הוסף סעיף"
├─────────────────────────┤
│ סה"כ הוצאות (full-width)│  large, live update
├─────────────────────────┤
│ BLOCK 2: מחשבון מרווח  │  input % → shows target price
├─────────────────────────┤
│ BLOCK 3: [gold] [blue]  │  grid 1fr 1fr
│  עסקה אמיתית | מחיר יעד │
├─────────────────────────┤
│ Delta (full-width)      │  green/red, shown only when realPrice > 0
└─────────────────────────┘
```

**Behaviour:**
- No "Calculate" button — instant recalc on every `onChange`
- Delta hidden until real price entered
- Add item: dashed-border button → inline input + ✓/✕ buttons
- Percent items show computed ₪ amount + editable % field

---

## Design System

| Variable    | Value     | Usage                    |
|-------------|-----------|--------------------------|
| `--bg`      | `#0f0f13` | Page background          |
| `--card`    | `#16161f` | Cards                    |
| `--border`  | `#222230` | Borders                  |
| `--gold`    | `#c8a84b` | Real deal inputs         |
| `--blue`    | `#5b8dd9` | Target margin            |
| `--green`   | `#6db86d` | Margin ≥ target          |
| `--red`     | `#e05c5c` | Margin < target          |
| `--text`    | `#e8e4d9` | Primary text             |
| `--muted`   | `#888888` | Labels                   |
| Font        | `DM Mono` | Entire interface         |

RTL (`dir="rtl"`), numbers right-aligned, dark theme only.

---

## Out of Scope (v1.0)

- No localStorage persistence
- No saved calculations
- No history
- No WhatsApp export
- No Tailwind CSS (deferred to later)
