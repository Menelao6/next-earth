import styles from "./RiskBars.module.css";

export default function RiskBars({
  flood, cyclone, heat, source
}: { flood: number; cyclone: number; heat: number; source: string }) {
  const rows = [
    { key: "Flood", val: flood, cls: styles.flood },
    { key: "Cyclone", val: cyclone, cls: styles.cyclone },
    { key: "Heat", val: heat, cls: styles.heat }
  ];
  return (
    <section aria-label="Country risk snapshot" className={styles.wrap}>
      <h4 className={styles.h}>Risk snapshot</h4>
      <ul className={styles.list}>
        {rows.map(r => (
          <li key={r.key} className={styles.row}>
            <span className={styles.label}>{r.key}</span>
            <div className={styles.bar}>
              <div className={`${styles.fill} ${r.cls}`} style={{ width: `${Math.round(r.val*100)}%` }} />
            </div>
            <span className={styles.pct}>{Math.round(r.val*100)}%</span>
          </li>
        ))}
      </ul>
      <div className={styles.src}>Source: {source}</div>
    </section>
  );
}
