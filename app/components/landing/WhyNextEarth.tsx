// components/landing/WhyNextEarth.tsx
'use client';

import { useEffect } from 'react';
import styles from './WhyNextEarth.module.css';

const features = [
  'Data-backed matches',
  'Transparent "why"',
  'Micro-learning on day one'
];

export default function WhyNextEarth() {
  useEffect(() => {
    // Animate features
    const featureChips = document.querySelectorAll(`.${styles.featureChip}`);
    featureChips.forEach((chip, index) => {
      setTimeout(() => {
        chip.classList.add(styles.animateIn);
      }, index * 50 + 300);
    });
  }, []);

  return (
    <section className={styles.whySection}>
      <div className={styles.contentGrid}>
        {/* Left Content */}
        <div className={styles.textContent}>
          <div className="fade-slide-up">
            <h2 className={styles.sectionTitle}>
              Built for climate action & equality
            </h2>
            
            <div className={styles.description}>
              <p>
                Next Earth helps people—especially youth in climate-vulnerable regions—discover meaningful roles backed by real climate data.
              </p>
              <p>
                We turn skills into impact, fairly and transparently.
              </p>
            </div>
          </div>

          {/* Feature Chips */}
          <div className={styles.featuresContainer}>
            {features.map((feature, index) => (
              <span
                key={feature}
                className={styles.featureChip}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className={`fade-slide-up ${styles.visualContainer}`}>
          <div className={styles.gradientBackground} />
          <div className={styles.glassMap}>
            <div className={styles.mapContainer}>
              <div className={styles.mapContent}>
                <div className={styles.mapEmoji}>🗺️</div>
                <p className={styles.mapText}>Climate risk visualization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}