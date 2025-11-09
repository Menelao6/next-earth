// components/landing/HowItWorks.tsx
'use client';

import { useEffect } from 'react';
import styles from './HowItWorks.module.css';

const steps = [
  {
    title: 'Pick a path',
    description: 'what kind of impact you want.',
    emoji: '🎯'
  },
  {
    title: 'Tell us your skills',
    description: 'country, age, and strengths.',
    emoji: '📝'
  },
  {
    title: 'Get matches',
    description: '3–5 roles, with reasons based on local risk data.',
    emoji: '🔍'
  },
  {
    title: 'Take action',
    description: 'micro-learning or volunteering links.',
    emoji: '⚡'
  },
];

export default function HowItWorks() {
  useEffect(() => {
    const elements = document.querySelectorAll(`.${styles.stepItem}`);
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add(styles.animateIn);
      }, index * 80);
    });
  }, []);

  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>How it works</h2>
      </div>

      <div className={styles.stepsContainer}>
        <div className={styles.connectingLine} />
        
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={styles.stepItem}
            >
              <div className={styles.stepNumberContainer}>
                <div className={styles.stepIcon}>
                  <span>{step.emoji}</span>
                </div>
                <div className={styles.stepNumber}>{index + 1}</div>
              </div>

              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}