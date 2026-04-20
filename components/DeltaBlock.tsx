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
        background: surplus ? '#e8f5e8' : '#fce8e8',
        border: `1px solid ${surplus ? '#7ab87a' : '#c87878'}`,
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
