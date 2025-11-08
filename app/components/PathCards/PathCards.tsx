"use client";

import styles from "./PathCards.module.css";

export type PathChoice = "help_hospitals" | "post_disaster" | "green_workforce";

export interface PathCardsProps {
  selected?: PathChoice;
  onSelect: (p: PathChoice) => void;
}

const CARDS: { key: PathChoice; title: string; desc: string; emoji: string }[] = [
  { key: "help_hospitals", title: "Help Hospitals", desc: "Support climate-driven health responses.", emoji: "🏥" },
  { key: "post_disaster", title: "Support Communities", desc: "Contribute to post-disaster relief & rebuild.", emoji: "🤝" },
  { key: "green_workforce", title: "Join Green Workforce", desc: "Solar, water, forestry & climate-smart roles.", emoji: "🌱" },
];

export default function PathCards({ selected, onSelect }: PathCardsProps) {
  return (
    <div className={styles.grid} role="list">
      {CARDS.map(card => {
        const isActive = selected === card.key;
        return (
          <button
            key={card.key}
            role="listitem"
            type="button"
            className={`${styles.card} ${isActive ? styles.active : ""}`}
            onClick={() => onSelect(card.key)}
            aria-pressed={isActive}
          >
            <span className={styles.emoji} aria-hidden>{card.emoji}</span>
            <span className={styles.title}>{card.title}</span>
            <span className={styles.desc}>{card.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
