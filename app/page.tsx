"use client";

import { useRouter } from "next/navigation";
import PathCards, { PathChoice } from "./components/PathCards/PathCards";
import styles from "./landing.module.css";
import { useAppState } from "./lib/useAppState";

export default function LandingPage() {
  const { state, setState } = useAppState();
  const router = useRouter();

  function onSelect(path: PathChoice) {
    setState({ ...state, path });
  }

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.h1}>Renewus</h1>
        <p className={styles.tag}>AI that connects your skills to real climate action.</p>

        <div className={styles.cardsWrap}>
          <PathCards selected={state.path} onSelect={onSelect} />
        </div>

        <button
          className={styles.cta}
          disabled={!state.path}
          onClick={() => router.push("/profile")}
          aria-disabled={!state.path}
        >
          Continue
        </button>
      </div>
      <div className={styles.bg} aria-hidden />
    </section>
  );
}
