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
          min="0"
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
        style={{ background: good ? '#e8f5e8' : '#fce8e8' }}
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
