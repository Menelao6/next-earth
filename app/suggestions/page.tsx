"use client";

import { useEffect, useState } from "react";
import styles from "./suggestions.module.css";
import Loader from "../components/Loader/Loader";
import RoleCard from "../components/RoleCard/RoleCard";
import WhyBox from "../components/WhyBox/WhyBox";
import RiskBars from "../components/RiskBars/RiskBars";
import { useAppState } from "../lib/useAppState";
import { postRecommend, RecommendResponse } from "../lib/api";
import { useRouter } from "next/navigation";

export default function SuggestionsPage() {
  const { state } = useAppState();
  const router = useRouter();
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!state.path || !state.country || !state.age) {
      router.push("/profile");
      return;
    }
    (async () => {
      try {
        setErr(null);
        const res = await postRecommend({
          path: state.path,
          country: state.country,
          age: state.age,
          skills: state.skills,
          language: state.language,
          equityFlag: state.equityFlag,
        });
        setData(res);
      } catch (e: any) {
        setErr(e?.message || "Failed to load recommendations");
      }
    })();
  }, [state, router]);

  function copyPlan() {
    if (!data) return;
    const lines = data.recommendations.map((r, i) => `#${i+1} ${r.title}\n${r.why}\nSteps:\n${r.microlearning.map(m=>`- ${m.title}: ${m.link}`).join("\n")}`);
    const txt = `Renewus plan for ${state.country}\n\n${lines.join("\n\n")}`;
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.main}>
        <h2 className={styles.h}>Your recommendations</h2>

        {!data && !err && <Loader label="Finding your best matches…" />}
        {err && <p className={styles.err}>{err}</p>}

        <div className={styles.list}>
          {data?.recommendations.map((r) => (
            <RoleCard key={r.id} title={r.title} score={r.score} microlearning={r.microlearning}>
              <WhyBox text={r.why} />
            </RoleCard>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.btn} onClick={copyPlan}>
            {copied ? "Copied!" : "Save plan"}
          </button>
        </div>
      </div>

      <aside className={styles.side}>
        {data?.countryRisk && (
          <RiskBars
            flood={data.countryRisk.flood}
            cyclone={data.countryRisk.cyclone}
            heat={data.countryRisk.heat}
            source={data.countryRisk.source}
          />
        )}
      </aside>
    </section>
  );
}
