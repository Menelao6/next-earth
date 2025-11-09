// components/landing/ImpactStats.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ImpactStats.module.css';

const stats = [
  { value: 1.2, suffix: 'M+', label: 'climate volunteers worldwide' },
  { value: 800, suffix: 'K+', label: 'new green jobs this year' },
  { value: 140, suffix: '+', label: 'high-risk countries tracked' },
  { value: 35, suffix: '%', label: 'faster to a role, in tests' },
];

export default function ImpactStats() {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateNumbers();
            
            // Animate cards
            const cards = entry.target.querySelectorAll(`.${styles.statCard}`);
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add(styles.animateIn);
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const animateNumbers = () => {
    stats.forEach((stat, index) => {
      const duration = 800;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = Math.min(current, stat.value);
          return newValues;
        });

        if (current >= stat.value) clearInterval(timer);
      }, duration / steps);
    });
  };

  return (
    <section ref={sectionRef} className={styles.statsSection}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={styles.statCard}
          >
            <div className={styles.statValue}>
              {animatedValues[index].toFixed(stat.value % 1 === 0 ? 0 : 1)}
              {stat.suffix}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}