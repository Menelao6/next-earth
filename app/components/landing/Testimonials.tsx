// components/landing/Testimonials.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    quote: "I found a rebuild role I didn't know I could do.",
    name: "Aisha",
    location: "Kenya"
  },
  {
    quote: "The matching process connected me to local climate projects instantly.",
    name: "Carlos",
    location: "Brazil"
  },
  {
    quote: "Finally, a platform that understands both skills and local needs.",
    name: "Maya",
    location: "Bangladesh"
  },
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.testimonials}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Real stories, real impact</h2>
      </div>

      <div className={styles.testimonialsContainer}>
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`${styles.testimonialCard} ${
              index === currentTestimonial ? styles.active : styles.inactive
            }`}
          >
            <div className={styles.testimonialEmoji}>💬</div>
            <blockquote className={styles.testimonialQuote}>
              "{testimonial.quote}"
            </blockquote>
            <div className={styles.testimonialAuthor}>
              {testimonial.name}, {testimonial.location}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dotsContainer}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonial(index)}
            className={`${styles.dot} ${
              index === currentTestimonial ? styles.active : styles.inactive
            }`}
          />
        ))}
      </div>
    </section>
  );
}