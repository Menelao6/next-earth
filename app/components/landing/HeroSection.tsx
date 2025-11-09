// components/landing/HeroSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create particles
    if (particlesRef.current) {
      for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = styles.particle;
        particle.style.cssText = `
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          left: ${Math.random() * 100}%;
          animation-delay: ${Math.random() * 20}s;
          opacity: ${Math.random() * 0.3 + 0.1};
        `;
        particlesRef.current.appendChild(particle);
      }
    }

    // Animate hero content
    if (heroRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const elements = entry.target.querySelectorAll('.fade-slide-up');
              elements.forEach((el, index) => {
                setTimeout(() => {
                  el.classList.add('animate-in');
                }, index * 150);
              });
            }
          });
        },
        { threshold: 0.1 }
      );

      if (heroRef.current) observer.observe(heroRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className={styles.hero}>
      {/* Background Images */}
      <div className={styles.backgroundContainer}>
        <div className={styles.backgroundOverlay}></div>
      </div>
      
      <div ref={particlesRef} className={styles.particlesContainer} />
      
      <div className={styles.heroContent}>
        <div className={styles.heroGrid}>
          {/* Left Content */}
          <div className="fade-slide-up">
            <div className={styles.badgeContainer}>
              <div className={styles.badgeIcon}>
                <span>🌍</span>
              </div>
              <span className={styles.badgeText}>
                Powered by ASDI & NOAA data • Built for equity
              </span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Next Earth
            </h1>
            
            <p className={styles.heroSubtitle}>
              AI that connects your skills to real climate action—volunteer, learn, or start a green career.
            </p>

            <div className={styles.buttonContainer}>
              <button
                onClick={() => scrollToSection('choose-path')}
                className={styles.primaryButton}
              >
                Find your path →
              </button>
              
              <button
                onClick={() => scrollToSection('how-it-works')}
                className={styles.secondaryButton}
              >
                How it works
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className={`fade-slide-up ${styles.visualContainer}`}>
            <div className={styles.gradientOrb} />
            <div className={styles.glassGlobe}>
              <div className={styles.globe}>
                <div className={styles.globeInner}>
                  <span className={styles.globeEmoji}>🌎</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}