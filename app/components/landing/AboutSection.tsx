// components/landing/AboutSection.tsx
'use client';

import { useRef, useEffect } from 'react';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animateIn);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (stepsRef.current) observer.observe(stepsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div ref={sectionRef} className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>Our Mission</h2>
            <p className={styles.description}>
              Next Earth empowers people everywhere — especially youth in climate-vulnerable regions — 
              to find green jobs, community roles, and learning paths that make real impact. 
              We bridge the gap between intention and action through AI-powered matching and 
              community-driven initiatives.
            </p>
            <p className={styles.description}>
              Together, we're building a sustainable future where every individual has the tools 
              and opportunities to contribute meaningfully to climate solutions.
            </p>
          </div>
          
          <div className={styles.visual}>
            <div className={styles.globeAnimation}>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.core}></div>
            </div>
          </div>
        </div>

        <div ref={stepsRef} className={styles.stepsSection}>
          <h3 className={styles.stepsTitle}>How It Works</h3>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Choose Your Path</h4>
                <p>Select from volunteer, career, education, or innovation paths</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Tell Us Your Skills</h4>
                <p>Share your expertise, interests, and availability</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>See Your Matches</h4>
                <p>Get personalized recommendations based on your profile</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h4>Take Action</h4>
                <p>Join initiatives, apply for roles, or start learning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}