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
