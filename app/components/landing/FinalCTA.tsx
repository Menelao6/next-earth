// components/landing/FinalCTA.tsx
'use client';

import { useEffect } from 'react';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-slide-up');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-in');
      }, index * 200);
    });
  }, []);

  const scrollToPaths = () => {
    const section = document.getElementById('choose-path');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.finalCTA}>
      <div className={styles.ctaContainer}>
        <div className="fade-slide-up">
          <h3 className={styles.ctaTitle}>Ready to take action?</h3>
        </div>

        <div className="fade-slide-up">
          <button
            onClick={scrollToPaths}
            className={styles.ctaButton}
          >
            Find your path →
          </button>
          
          <div>
            <button
              onClick={scrollToHowItWorks}
              className={styles.ctaLink}
            >
              Learn how it works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}