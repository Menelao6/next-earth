"use client";

import { useEffect, useState } from "react";
import styles from "./NewsList.module.css";

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

export default function NewsList() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [keyword, setKeyword] = useState("disaster");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/news?keyword=${encodeURIComponent(keyword)}`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();           // expect { items: NewsItem[] }
        setItems(Array.isArray(data) ? data : data.items ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [keyword]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newKeyword = formData.get("keyword")?.toString().trim() || "disaster";
    setKeyword(newKeyword);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Latest Disaster News</h1>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          name="keyword"
          placeholder="Search (e.g., flood, earthquake, wildfire)"
          className={styles.input}
          defaultValue={keyword}
        />
        <button type="submit" className={styles.button}>Search</button>
      </form>

      {loading && <p className={styles.status}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && (
        items.length === 0 ? (
          <p className={styles.empty}>No updates yet.</p>
        ) : (
          <ul className={styles.list} aria-live="polite">
            {items.map((n) => (
              <li key={n.url} className={styles.item}>
                <a className={styles.link} href={n.url} target="_blank" rel="noreferrer">
                  <span className={styles.title}>{n.title}</span>
                  <span className={styles.meta}>
                    {n.source} •{" "}
                    {new Date(n.publishedAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
