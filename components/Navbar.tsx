"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./Navbar.module.css";

function NavbarContent() {
  const { totalCount } = useCart();
  const pathname = usePathname();

  return (
    <header className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Left: Brand Identity */}
        <Link href="/" className={styles.brandGroup} aria-label="SBG Virtual Showroom">
          <div className={styles.crestIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.25 3.5 10 8 11 4.5-1 8-5.75 8-11V6l-8-4z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 7l-3.5 3.5h7L12 7z" fill="var(--brand-gold)" />
              <path d="M12 10.5v6" stroke="var(--brand-gold)" strokeWidth="1.8" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.title}>SBG</span>
            <span className={styles.badge}>SHOWROOM</span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className={styles.centerPill} aria-label="Main Navigation">
          <Link
            href="/"
            className={pathname === "/" ? styles.activeRoom : styles.subRoom}
          >
            3D SHOWROOM
          </Link>
          <span className={styles.dot}>/</span>
          <Link
            href="/products"
            className={pathname.startsWith("/products") ? styles.activeRoom : styles.subRoom}
          >
            COLLECTION
          </Link>
          <span className={styles.dot}>/</span>
          <Link
            href="/about"
            className={pathname === "/about" ? styles.activeRoom : styles.subRoom}
          >
            ABOUT
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className={styles.actionsGroup}>
          <Link href="/cart" className={styles.cartAction} aria-label={`Shopping Bag (${totalCount} items)`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className={styles.cartLabel}>BAG</span>
            {totalCount > 0 && <span className={styles.cartCount}>{totalCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<header className={styles.navbar} />}>
      <NavbarContent />
    </Suspense>
  );
}
