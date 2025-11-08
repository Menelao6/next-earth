"use client";

import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import SkillChips from "../components/SkillChips/SkillChips";
import { useAppState } from "../lib/useAppState";

const COUNTRIES = ["Philippines", "Kenya", "India"];

export default function ProfilePage() {
  const { state, setState } = useAppState();
  const router = useRouter();

  return (
    <section className={styles.wrap}>
      <h2 className={styles.h}>Tell us about you</h2>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Country</span>
          <select
            className={styles.input}
            value={state.country || ""}
            onChange={(e) => setState({ ...state, country: e.target.value })}
          >
            <option value="" disabled>Choose a country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Age</span>
          <select
            className={styles.input}
            value={state.age ?? ""}
            onChange={(e) => setState({ ...state, age: Number(e.target.value) })}
          >
            <option value="" disabled>Choose age</option>
            {Array.from({ length: 60 }, (_, i) => i + 15).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <div className={styles.fieldFull}>
          <span className={styles.label}>Skills</span>
          <SkillChips
            value={state.skills}
            onChange={(skills) => setState({ ...state, skills })}
            placeholder="e.g., first aid, organizing, carpentry"
          />
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Language (optional)</span>
          <input
            className={styles.input}
            value={state.language || ""}
            onChange={(e) => setState({ ...state, language: e.target.value })}
            placeholder="en"
          />
        </label>

        <label className={`${styles.field} ${styles.checkbox}`}>
          <input
            type="checkbox"
            checked={!!state.equityFlag}
            onChange={(e) => setState({ ...state, equityFlag: e.target.checked })}
          />
          <span>I’m in a high-risk / low-connectivity area</span>
        </label>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnGhost} onClick={() => router.push("/")}>Back</button>
        <button
          className={styles.btn}
          onClick={() => router.push("/suggestions")}
          disabled={!state.country || !state.age}
        >
          Get recommendations
        </button>
      </div>
    </section>
  );
}
