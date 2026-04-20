import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.sub}>RSWindoor</div>
      <div className={styles.title}>מחשבון רווח</div>
    </header>
  )
}
