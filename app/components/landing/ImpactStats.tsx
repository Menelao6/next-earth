// components/landing/ImpactStats.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ImpactStats.module.css';

interface Stat {
  icon: string;
  value: number;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { icon: '🌱', value: 1.2, suffix: 'M+', label: 'Climate volunteers worldwide' },
  { icon: '⚙️', value: 800, suffix: 'K+', label: 'Green jobs created this year' },
  { icon: '🌍', value: 140, suffix: '+', label: 'Countries facing high-risk zones' },
  { icon: '🚀', value: 45, suffix: '%', label: 'Increase in climate action participation' }
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
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateNumbers = () => {
    stats.forEach((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const stepValue = stat.value / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = Math.min(stepValue * currentStep, stat.value);
          return newValues;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);
    });
  };

  return (
    <section ref={sectionRef} className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statValue}>
                {animatedValues[index].toFixed(stat.value % 1 === 0 ? 0 : 1)}
                {stat.suffix}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}