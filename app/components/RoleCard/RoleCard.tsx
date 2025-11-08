import styles from "./RoleCard.module.css";

export interface RoleCardProps {
  title: string;
  score: number; // 0..1
  microlearning: { title: string; link: string }[];
  children?: React.ReactNode; // WhyBox goes here
  onClickStep?: (title: string) => void;
}

export default function RoleCard({
  title,
  score,
  microlearning,
  children,
  onClickStep
}: RoleCardProps) {
  const pct = Math.round((score ?? 0) * 100);

  return (
    <article className={styles.card} aria-labelledby={`${title}-h`}>
      <div className={styles.header}>
        <h3 id={`${title}-h`} className={styles.title}>{title}</h3>
        <span className={styles.score} aria-label={`Match score ${pct}%`}>
          {pct}% match
        </span>
      </div>

      <div className={styles.body}>
        {children}
        <div className={styles.steps}>
          {microlearning?.slice(0,3).map((m) => (
            <a
              key={m.title}
              className={styles.step}
              href={m.link}
              target="_blank"
              rel="noreferrer"
              onClick={() => onClickStep?.(m.title)}
            >
              {m.title}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
