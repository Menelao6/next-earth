"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Choose Your Path" },
  { href: "/suggestions", label: "Opportunities" },
  { href: "/updates", label: "Updates" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="Next Earth home">
          <Image src="/logo.png" width={32} height={32} alt="" priority />
          <span className={styles.brandText}>Next Earth</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.active : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavLink} ${
                pathname === item.href ? styles.mobileActive : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}