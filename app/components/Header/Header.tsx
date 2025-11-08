"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/suggestions", label: "Suggestions" },
  { href: "/updates", label: "Updates" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="Renewus home">
          <Image src="/logo.svg" width={28} height={28} alt="" />
          <span className={styles.brandText}>Renewus</span>
        </Link>

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
      </div>
    </header>
  );
}
