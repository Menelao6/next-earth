'use client';

import { useState } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Renewus</span>
        </Link>

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/profile" className={styles.navLink}>
            Your Profile
          </Link>
          <Link href="/suggestions" className={styles.navLink}>
            Recommendations
          </Link>
          <Link href="/updates" className={styles.navLink}>
            Updates
          </Link>
        </nav>
      </div>
    </header>
  );
}
