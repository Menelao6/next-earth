"use client";

import { useEffect, useState } from "react";
import styles from "./updates.module.css";
import Loader from "../components/Loader/Loader";
import NewsList from "../components/NewsList/NewsList";
import { useAppState } from "../lib/useAppState";
import { getNews, NewsResponse } from "../lib/api";

export default function UpdatesPage() {
  const { state } = useAppState();
  const [data, setData] = useState<NewsResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const res = await getNews({ country: state.country || "Philippines", topic: "climate" });
        setData(res);
      } catch (e: any) {
        setErr(e?.message || "Failed to load updates");
      }
    })();
  }, [state.country]);

  return (
    <section className={styles.wrap}>
      <h2 className={styles.h}>Updates & Opportunities</h2>
      {!data && !err && <Loader />}
      {err && <p className={styles.err}>{err}</p>}
      {data && <NewsList items={data.items} />}
    </section>
  );
}
