"use client";

import styles from "./PathCards.module.css";

export type PathChoice = "help_hospitals" | "post_disaster" | "green_workforce";

export interface PathCardsProps {
  selected?: PathChoice;
  onSelect: (p: PathChoice) => void;
}

const CARDS: { 
  key: PathChoice; 
  title: string; 
  desc: string; 
  emoji: string;
  gradient: string;
}[] = [
  { 
    key: "help_hospitals", 
    title: "Help Hospitals", 
    desc: "Support climate-driven health responses and emergency care.", 
    emoji: "🏥",
    gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))"
  },
  { 
    key: "post_disaster", 
    title: "Support Communities", 
    desc: "Contribute to post-disaster relief, rebuild, and resilience.", 
    emoji: "🤝",
    gradient: "linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(2, 132, 199, 0.1))"
  },
  { 
    key: "green_workforce", 
    title: "Join Green Workforce", 
    desc: "Solar, water, forestry & climate-smart roles for a sustainable future.", 
    emoji: "🌱",
    gradient: "linear-gradient(135deg, rgba(45, 122, 79, 0.15), rgba(31, 89, 56, 0.1))"
  },
];

export default function PathCards({ selected, onSelect }: PathCardsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Choose Your Path</h2>
        <p className={styles.subheading}>
          Select how you'd like to make an impact on climate action
        </p>
      </div>
      
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
              style={{ '--card-gradient': card.gradient } as React.CSSProperties}
            >
              <div className={styles.cardInner}>
                <span className={styles.emoji} aria-hidden="true">{card.emoji}</span>
                <div className={styles.content}>
                  <span className={styles.title}>{card.title}</span>
                  <span className={styles.desc}>{card.desc}</span>
                </div>
                {isActive && (
                  <div className={styles.checkmark} aria-hidden="true">
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 20 20" 
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="4,10 8,14 16,6" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}