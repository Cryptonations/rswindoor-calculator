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
            min="0"
            max="100"
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
