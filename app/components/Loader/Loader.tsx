import styles from "./Loader.module.css";

export default function Loader({label = "Loading..."}: {label?: string}) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.spinner} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
