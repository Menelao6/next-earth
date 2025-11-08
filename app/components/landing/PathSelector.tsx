// components/landing/PathSelector.tsx
'use client';

import { useState } from 'react';
import styles from './PathSelector.module.css';

interface Path {
  id: string;
  emoji: string;
  title: string;
  description: string;
  gradient: string;
}

const paths: Path[] = [
  {
    id: 'volunteer',
    emoji: '🤝',
    title: 'Community Volunteer',
    description: 'Join local climate initiatives and make direct impact in your community through hands-on projects and awareness campaigns.',
    gradient: 'linear-gradient(135deg, rgba(45, 122, 79, 0.2), rgba(31, 89, 56, 0.15))'
  },
  {
    id: 'career',
    emoji: '💼',
    title: 'Green Career',
    description: 'Discover sustainable job opportunities and build a career focused on environmental protection and climate solutions.',
    gradient: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(2, 132, 199, 0.15))'
  },
  {
    id: 'education',
    emoji: '📚',
    title: 'Climate Education',
    description: 'Learn about climate science, sustainable practices, and become an advocate for environmental awareness.',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.15))'
  },
  {
    id: 'innovation',
    emoji: '💡',
    title: 'Tech & Innovation',
    description: 'Leverage technology and innovation to develop solutions for climate challenges and sustainable development.',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.15))'
  }
];

export default function PathSelector() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handlePathSelect = (pathId: string) => {
    setSelectedPath(selectedPath === pathId ? null : pathId);
  };

  return (
    <section id="choose-path" className={styles.pathSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Choose Your Path</h2>
          <p className={styles.subheading}>
            Select how you'd like to make an impact on climate action.
          </p>
        </div>

        <div className={styles.grid}>
          {paths.map((path) => (
            <button
              key={path.id}
              className={`${styles.card} ${
                selectedPath === path.id ? styles.active : ''
              }`}
              onClick={() => handlePathSelect(path.id)}
              style={{ '--card-gradient': path.gradient } as React.CSSProperties}
            >
              <div className={styles.cardInner}>
                <span className={styles.emoji}>{path.emoji}</span>
                <div className={styles.content}>
                  <span className={styles.title}>{path.title}</span>
                  <span className={styles.desc}>{path.description}</span>
                </div>
                
                {selectedPath === path.id && (
                  <div className={styles.checkmark}>
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        fill="currentColor"
                        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedPath && (
          <div className={styles.ctaContainer}>
            <button className={styles.continueButton}>
              Continue with {paths.find(p => p.id === selectedPath)?.title}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}