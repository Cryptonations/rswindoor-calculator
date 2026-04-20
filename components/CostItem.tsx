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
      {removable && onRemove && (
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
        min="0"
        placeholder="0"
      />
      <div className={styles.label}>{label}</div>
    </div>
  )
}
