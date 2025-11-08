// components/landing/HeroSection.tsx
'use client';

import { useRef, useEffect } from 'react';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  onCtaClick?: () => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animateIn);
          }
        });
      },
      { threshold: 0.1 }
    );

    [titleRef, subtitleRef, ctaRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const pathSection = document.getElementById('choose-path');
      pathSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.orbitingSphere}></div>
        <div className={styles.pulseRing}></div>
      </div>
      
      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.title}>
          Next Earth
          <span className={styles.titleGlow}></span>
        </h1>
        
        <p ref={subtitleRef} className={styles.subtitle}>
          AI that connects your skills to real climate action.
        </p>
        
        <button
          ref={ctaRef}
          className={styles.ctaButton}
          onClick={handleCtaClick}
        >
          <span className={styles.ctaText}>Find Your Path</span>
          <div className={styles.ctaSparkle}></div>
        </button>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollArrow}></div>
      </div>
    </section>
  );
}