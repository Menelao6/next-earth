// components/landing/PathSelector.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PathSelector.module.css';

const paths = [
  {
    id: 'hospitals',
    title: 'Help Hospitals',
    description: 'Support climate-driven health responses.',
    emoji: '🏥'
  },
  {
    id: 'communities',
    title: 'Support Communities',
    description: 'Post-disaster relief & rebuild.',
    emoji: '🤝'
  },
  {
    id: 'workforce',
    title: 'Join Green Workforce',
    description: 'Solar, water, forestry & climate-smart roles.',
    emoji: '💼'
  },
];

export default function PathSelector() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [animatedCards, setAnimatedCards] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedCards) {
            setAnimatedCards(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animatedCards]);

  const handlePathSelect = (pathId: string) => {
    setSelectedPath(selectedPath === pathId ? null : pathId);
  };

  const handleContinue = () => {
    if (selectedPath) {
      router.push('/matches');
    }
  };

  return (
    <section id="choose-path" className={styles.pathSection} ref={sectionRef}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Choose your path</h2>
        <p className={styles.sectionSubtitle}>
          Select how you'd like to make an impact.
        </p>
      </div>

      <div className={styles.pathsGrid}>
        {paths.map((path, index) => (
          <button
            key={path.id}
            className={`${styles.pathCard} ${
              animatedCards ? styles.animateIn : ''
            } ${selectedPath === path.id ? styles.selected : ''}`}
            style={{ transitionDelay: animatedCards ? `${index * 150}ms` : '0ms' }}
            onClick={() => handlePathSelect(path.id)}
          >
            <div className={styles.pathEmoji}>{path.emoji}</div>
            <h3 className={styles.pathTitle}>{path.title}</h3>
            <p className={styles.pathDescription}>{path.description}</p>
            
            {selectedPath === path.id && (
              <div className={styles.checkmark}>
                <svg 
                  className={styles.checkmarkIcon} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className={`${styles.continueContainer} ${
        selectedPath ? styles.visible : styles.hidden
      }`}>
        <button
          onClick={handleContinue}
          disabled={!selectedPath}
          className={styles.continueButton}
        >
          Continue with {paths.find(p => p.id === selectedPath)?.title} →
        </button>
      </div>
    </section>
  );
}