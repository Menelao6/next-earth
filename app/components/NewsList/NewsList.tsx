import styles from "./NewsList.module.css";

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string; // ISO
}

export default function NewsList({ items }: { items: NewsItem[] }) {
  if (!items?.length) {
    return <p className={styles.empty}>No updates yet.</p>;
  }
  return (
    <ul className={styles.list} aria-live="polite">
      {items.map((n) => (
        <li key={n.url} className={styles.item}>
          <a className={styles.link} href={n.url} target="_blank" rel="noreferrer">
            <span className={styles.title}>{n.title}</span>
            <span className={styles.meta}>
              {n.source} • {new Date(n.publishedAt).toLocaleString()}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
