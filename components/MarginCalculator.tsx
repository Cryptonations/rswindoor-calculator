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
              min="0"
              max="99"
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
