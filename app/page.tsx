'use client';

import { useEffect, useRef } from 'react';
import HeroSection from './components/landing/HeroSection';
import ImpactStats from './components/landing/ImpactStats';
import PathSelector from './components/landing/PathSelector';
import AboutSection from './components/landing/AboutSection';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createParticles = () => {
      const container = containerRef.current;
      if (!container) return;

      const existingParticles = container.querySelectorAll('.floating-particle');
      existingParticles.forEach(particle => particle.remove());

      for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(45, 122, 79, 0.6);
          border-radius: 50%;
          pointer-events: none;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation: float 20s infinite linear;
          animation-delay: ${Math.random() * 20}s;
          z-index: 1;
        `;
        container.appendChild(particle);
      }
    };

    createParticles();

    return () => {
      const container = containerRef.current;
      if (container) {
        const particles = container.querySelectorAll('.floating-particle');
        particles.forEach(particle => particle.remove());
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        overflowX: 'hidden',
      }}
    >
      {/* Add float animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      
      <HeroSection />
      <ImpactStats />
      <PathSelector />
      <AboutSection />
    </div>
  );
}