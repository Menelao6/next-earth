// components/landing/DataSources.tsx
'use client';

import { useEffect } from 'react';
import styles from './DataSources.module.css';

const partners = [
  { name: 'ASDI', logo: '🌐' },
  { name: 'NOAA', logo: '🌊' },
  { name: 'ReliefWeb', logo: '🔄' },
  { name: 'OpenStreetMap', logo: '🗺️' },
];

export default function DataSources() {
  useEffect(() => {
    const logos = document.querySelectorAll(`.${styles.partnerLogo}`);
    logos.forEach((logo, index) => {
      setTimeout(() => {
        logo.classList.add(styles.animateIn);
      }, index * 100);
    });
  }, []);

  return (
    <section className={styles.dataSources}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Data sources & ecosystem partners</h3>
        <p className={styles.sectionSubtitle}>
          Prototype uses a curated subset for demo accuracy.
        </p>
      </div>

      <div className={styles.partnersGrid}>
        {partners.map((partner) => (
          <div
            key={partner.name}
            className={styles.partnerLogo}
          >
            <div className={styles.partnerEmoji}>{partner.logo}</div>
            <div className={styles.partnerName}>{partner.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}