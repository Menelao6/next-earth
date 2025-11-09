import styles from './PathSelector.module.css';

interface Path {
  id: string;
  name: string;
  emoji: string;
  description: string;
  idealFor: string[];
  timeCommitment: string;
}

interface PathSelectorProps {
  selectedPath: string | null;
  onPathSelect: (pathId: string) => void;
}

const PATHS: Path[] = [
  {
    id: 'help_hospitals',
    name: 'Help Hospitals',
    emoji: '🏥',
    description: 'Support healthcare systems in climate-vulnerable areas with medical, technical, or logistical skills',
    idealFor: ['Medical professionals', 'Logistics experts', 'Technical support staff'],
    timeCommitment: '2-20 hours/week'
  },
  {
    id: 'support_communities',
    name: 'Support Communities',
    emoji: '🤝',
    description: 'Work directly with communities on resilience building, disaster response, and adaptation projects',
    idealFor: ['Community organizers', 'Educators', 'Construction workers', 'First responders'],
    timeCommitment: 'Flexible hours'
  },
  {
    id: 'join_workforce',
    name: 'Join Green Workforce',
    emoji: '💼',
    description: 'Transition into climate-focused careers in renewable energy, sustainability, and environmental protection',
    idealFor: ['Career changers', 'Students', 'Professionals seeking impact'],
    timeCommitment: 'Full-time opportunities'
  }
];

export default function PathSelector({ selectedPath, onPathSelect }: PathSelectorProps) {
  return (
    <div className={styles.pathSelector}>
      <div className={styles.header}>
        <h2 className={styles.title}>Choose Your Climate Action Path</h2>
        <p className={styles.subtitle}>
          Select how you want to make an impact. Your choice will personalize the opportunities we show you.
        </p>
      </div>

      <div className={styles.pathsGrid}>
        {PATHS.map((path) => (
          <div
            key={path.id}
            className={`${styles.pathCard} ${
              selectedPath === path.id ? styles.pathCardSelected : ''
            }`}
            onClick={() => onPathSelect(path.id)}
          >
            <div className={styles.pathHeader}>
              <span className={styles.pathEmoji}>{path.emoji}</span>
              <h3 className={styles.pathName}>{path.name}</h3>
              <div className={styles.selectionIndicator}>
                {selectedPath === path.id ? '✓' : '+'}
              </div>
            </div>
            
            <p className={styles.pathDescription}>{path.description}</p>
            
            <div className={styles.pathDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Ideal for:</span>
                <span className={styles.detailValue}>
                  {path.idealFor.join(', ')}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Time:</span>
                <span className={styles.detailValue}>{path.timeCommitment}</span>
              </div>
            </div>
            
            <div className={styles.pathAction}>
              {selectedPath === path.id ? (
                <span className={styles.selectedText}>Selected</span>
              ) : (
                <span className={styles.selectText}>Select this path</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPath && (
        <div className={styles.selectedPathInfo}>
          <div className={styles.selectedBadge}>
            <span>🎯</span>
            <span>Ready to continue with {PATHS.find(p => p.id === selectedPath)?.name}</span>
          </div>
          <p className={styles.continueHint}>
            Complete your profile below to see personalized matches for this path
          </p>
        </div>
      )}
    </div>
  );
}