// components/Footer/Footer.tsx - UPDATED (using our FooterCTA design)
'use client';

import { useRef, useEffect } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animateIn);
          }
        });
      },
      { threshold: 0.3 }
    );

    [sectionRef, titleRef, buttonRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    // Scroll to path selector section
    const pathSection = document.getElementById('choose-path');
    pathSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer ref={sectionRef} className={styles.footerCTA}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 ref={titleRef} className={styles.title}>
            Ready to take action? <span className={styles.earth}>🌎</span>
          </h2>
          <p className={styles.subtitle}>
            Start your journey toward a sustainable future today.
          </p>
          
          <button 
            ref={buttonRef} 
            className={styles.ctaButton}
            onClick={handleGetStarted}
          >
            Get Started
            <div className={styles.buttonSparkles}>
              <span className={styles.sparkle}></span>
              <span className={styles.sparkle}></span>
              <span className={styles.sparkle}></span>
            </div>
          </button>
        </div>
        
        <div className={styles.footer}>
          <p className={styles.copyright}>
            © 2024 Next Earth. Empowering climate action worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}