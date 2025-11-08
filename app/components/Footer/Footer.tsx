import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.brandText}>Renewus</span>
          <p className={styles.tagline}>AI-powered climate action navigator</p>
        </div>

        <div className={styles.links}>
          <a 
            href="https://docs.lovable.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            About
          </a>
          <a 
            href="https://docs.lovable.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            Privacy
          </a>
          <a 
            href="https://docs.lovable.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.link}
          >
            Contact
          </a>
        </div>

        <div className={styles.copyright}>
          <p>© {currentYear} Renewus. Built for climate resilience.</p>
        </div>
      </div>
    </footer>
  );
}
