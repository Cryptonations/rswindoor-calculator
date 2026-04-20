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
