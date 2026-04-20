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
