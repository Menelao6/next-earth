"use client";

import { useEffect, useState } from "react";
import styles from "./updates.module.css";
import Loader from "../components/Loader/Loader";
import NewsList, { NewsItem } from "../components/NewsList/NewsList";
import { useAppState } from "../lib/useAppState";
import { getNews, NewsResponse } from "../lib/api";

export default function UpdatesPage() {
  return (
    <section className={styles.wrap}>
      <h2 className={styles.h}>Updates & Opportunities</h2>
      <NewsList /> 
    </section>
  );
}