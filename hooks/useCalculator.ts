import { useState, useMemo } from 'react'
import type { CostItem, PercentItem } from '@/types'

const DEFAULT_ITEMS: CostItem[] = [
  { id: 1, key: 'aluminum',      label: 'אלומיניום',          value: 0 },
  { id: 2, key: 'hardware',      label: 'פירזול כולל גלילה',  value: 0 },
  { id: 3, key: 'glass',         label: 'זכוכית',             value: 0 },
  { id: 4, key: 'frames',        label: 'משקופים עיוורים',    value: 0 },
  { id: 5, key: 'commission',    label: 'עמלה',               value: 0 },
  { id: 6, key: 'subcontractor', label: 'קבלן משנה',          value: 0 },
  { id: 7, key: 'extras',        label: 'חריגים',             value: 0 },
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
