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
        const data = await res.json();
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
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Latest Climate News</h2>
          <p className={styles.subtitle}>
            Stay informed with real-time updates on climate events and disasters
          </p>
        </div>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              name="keyword"
              placeholder="Search climate topics (e.g., flood, earthquake, wildfire)"
              className={styles.input}
              defaultValue={keyword}
            />
            <button type="submit" className={styles.searchButton}>
              <span>Search</span>
              <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>

        <div className={styles.content}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading latest news...</p>
            </div>
          )}
          
          {error && (
            <div className={styles.error}>
              <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            items.length === 0 ? (
              <div className={styles.empty}>
                <svg className={styles.emptyIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>No news found for "{keyword}". Try a different search term.</p>
              </div>
            ) : (
              <div className={styles.newsGrid}>
                {items.map((item, index) => (
                  <article key={item.url} className={styles.newsCard}>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.cardLink}
                    >
                      <div className={styles.cardContent}>
                        <h3 className={styles.newsTitle}>{item.title}</h3>
                        <div className={styles.newsMeta}>
                          <span className={styles.source}>{item.source}</span>
                          <span className={styles.dot}>•</span>
                          <time className={styles.time}>
                            {new Date(item.publishedAt).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </time>
                        </div>
                      </div>
                      <div className={styles.cardAction}>
                        <svg className={styles.externalIcon} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}