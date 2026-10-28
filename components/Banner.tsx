import styles from "./Banner.module.css";

export default function Banner() {
  return (
    <aside className={styles.banner} aria-label="Store Mode Notification">
      <div className={styles.inner}>
        <span className={styles.dot} />
        <span className={styles.label}>VIRTUAL SHOWROOM</span>
        <span className={styles.separator}>•</span>
        <span className={styles.text}>AUTUMN / WINTER 2026</span>
        <span className={styles.separator}>•</span>
        <span className={styles.badge}>DEMO MODE (TEST ORDERING)</span>
      </div>
    </aside>
  );
}
