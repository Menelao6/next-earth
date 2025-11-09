// components/RiskBars/RiskBars.tsx
import styles from './RiskBars.module.css';

interface RiskBarsProps {
  risk: {
    flood: number;
    cyclone: number;
    heat: number;
    source: string;
  };
}

export default function RiskBars({ risk }: RiskBarsProps) {
  const getRiskLevel = (value: number) => {
    if (value >= 0.7) return 'high';
    if (value >= 0.4) return 'medium';
    return 'low';
  };

  const riskItems = [
    { label: 'Flood Risk', value: risk.flood, level: getRiskLevel(risk.flood) },
    { label: 'Cyclone Risk', value: risk.cyclone, level: getRiskLevel(risk.cyclone) },
    { label: 'Heat Stress', value: risk.heat, level: getRiskLevel(risk.heat) }
  ];

  return (
    <div className={styles.riskBars}>
      {riskItems.map(item => (
        <div key={item.label} className={styles.riskItem}>
          <div className={styles.riskLabel}>
            <span>{item.label}</span>
            <span className={styles.riskValue}>
              {Math.round(item.value * 100)}%
            </span>
          </div>
          <div className={styles.riskBar}>
            <div 
              className={`${styles.riskFill} ${styles[item.level]}`}
              style={{ width: `${item.value * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}