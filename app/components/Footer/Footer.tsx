import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <span>© {new Date().getFullYear()} Renewus</span>
        <span className={styles.dim}>Built for climate action & equality</span>
      </div>
    </footer>
  );
}
