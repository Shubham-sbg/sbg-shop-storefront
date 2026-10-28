import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.topRow}>
          <div className={styles.brandCol}>
            <div className={styles.logo}>
              <span className={styles.brandTitle}>SBG</span>
              <span className={styles.brandSubtitle}>SHOP</span>
            </div>
            <p className={styles.tagline}>
              EVERY MOVE MATTERS. High-performance athletic apparel engineered with precision.
            </p>
          </div>

          <div className={styles.linksCol}>
            <span className={styles.colHeader}>SHOP</span>
            <Link href="/#showroom" className={styles.footerLink}>Showroom</Link>
            <Link href="/#jerseys" className={styles.footerLink}>Jerseys</Link>
            <Link href="/cart" className={styles.footerLink}>Cart</Link>
          </div>

          <div className={styles.linksCol}>
            <span className={styles.colHeader}>SUPPORT</span>
            <Link href="/orders" className={styles.footerLink}>Track Order</Link>
            <Link href="/returns" className={styles.footerLink}>Returns & Exchanges</Link>
            <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
          </div>

          <div className={styles.linksCol}>
            <span className={styles.colHeader}>LEGAL</span>
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/refund" className={styles.footerLink}>Refund Policy</Link>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © 2026 SBG SHOP. All rights reserved. Made in India.
          </p>
          <p className={styles.disclaimer}>
            Virtual Showroom Edition v1.1. Real payment processing is currently in test mode.
          </p>
        </div>
      </div>
    </footer>
  );
}
