// app/page.tsx - UPDATED
'use client';

import { useEffect, useRef } from 'react';
import HeroSection from './components/landing/HeroSection';
import ImpactStats from './components/landing/ImpactStats';
import PathSelector from './components/landing/PathSelector';
import AboutSection from './components/landing/AboutSection';
import styles from './landing.module.css';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add floating particles background
    const createParticles = () => {
      const container = containerRef.current;
      if (!container) return;

      // Clear existing particles
      const existingParticles = container.querySelectorAll(`.${styles.floatingParticle}`);
      existingParticles.forEach(particle => particle.remove());

      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = styles.floatingParticle;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        container.appendChild(particle);
      }
    };

    createParticles();

    // Prevent scroll bounce/overscroll
    const preventScrollBounce = (e: TouchEvent) => {
      if (window.scrollY === 0 && e.cancelable) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScrollBounce, { passive: false });

    return () => {
      const container = containerRef.current;
      if (container) {
        const particles = container.querySelectorAll(`.${styles.floatingParticle}`);
        particles.forEach(particle => particle.remove());
      }
      document.removeEventListener('touchmove', preventScrollBounce);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.landingContainer}>
      <div className={styles.contentWrapper}>
        <HeroSection />
        <ImpactStats />
        <PathSelector />
        <AboutSection />
      </div>
    </div>
  );
}