"use client";

import styles from "./updates.module.css";
import NewsList from "../components/NewsList/NewsList";

export default function UpdatesPage() {
  return (
    <section className={styles.wrap}>
      <NewsList /> 
    </section>
  );
}