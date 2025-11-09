// components/RoleCard/RoleCard.tsx
import styles from './RoleCard.module.css';

interface RoleCardProps {
  role: {
    id: string;
    title: string;
    score: number;
    tags: string[];
    microlearning: { title: string; link: string }[];
    why: string;
  };
  index: number;
}

export default function RoleCard({ role, index }: RoleCardProps) {
  return (
    <div 
      className={styles.roleCard}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{role.title}</h3>
        <div className={styles.score}>
          {Math.round(role.score * 100)}% match
        </div>
      </div>
      
      <div className={styles.why}>
        {role.why}
      </div>
      
      <div className={styles.tags}>
        {role.tags.map(tag => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      
      {role.microlearning.length > 0 && (
        <div className={styles.learning}>
          <h4 className={styles.learningTitle}>Quick Learning</h4>
          <div className={styles.learningLinks}>
            {role.microlearning.map((item, i) => (
              <a 
                key={i}
                href={item.link}
                className={styles.learningLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title} →
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}