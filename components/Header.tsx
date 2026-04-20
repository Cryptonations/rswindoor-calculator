import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.sub}>RSWindoor</div>
      <h1 className={styles.title}>מחשבון רווח</h1>
    </header>
  )
}
