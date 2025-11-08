import styles from "./EmptyState.module.css";

export default function EmptyState({
  title = "Nothing to show yet",
  message = "Try adjusting your filters or come back later."
}: { title?: string; message?: string }) {
  return (
    <div className={styles.box} role="status">
      <div className={styles.icon} aria-hidden>☁️</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.msg}>{message}</p>
    </div>
  );
}
