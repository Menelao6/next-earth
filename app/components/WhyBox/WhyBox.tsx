import styles from "./WhyBox.module.css";

export default function WhyBox({
  text,
  sourceLabel = "ASDI/NOAA"
}: { text: string; sourceLabel?: string }) {
  return (
    <div className={styles.box}>
      <div className={styles.tag}>Why this fits</div>
      <p className={styles.text}>{text}</p>
      <div className={styles.source}>Data: {sourceLabel}</div>
    </div>
  );
}
