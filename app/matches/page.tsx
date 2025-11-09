// app/matches/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '../lib/useAppState';
import SkillChips from '../components/SkillChips/SkillChips';
import RoleCard from '../components/RoleCard/RoleCard';
import RiskBars from '../components/RiskBars/RiskBars';
import styles from './profile.module.css';

const COUNTRIES = ["Philippines", "Kenya", "India", "Bangladesh", "Indonesia", "Vietnam", "Nigeria", "Brazil"];
const PATHS = [
  { id: 'help_hospitals', name: 'Help Hospitals', emoji: '🏥' },
  { id: 'support_communities', name: 'Support Communities', emoji: '🤝' },
  { id: 'join_workforce', name: 'Join Green Workforce', emoji: '💼' }
];

interface Recommendation {
  id: string;
  title: string;
  score: number;
  tags: string[];
  microlearning: { title: string; link: string }[];
  why: string;
}

interface MatchResponse {
  countryRisk: {
    flood: number;
    cyclone: number;
    heat: number;
    source: string;
  };
  recommendations: Recommendation[];
}

export default function MatchesPage() {
  const { state, setState } = useAppState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResponse | null>(null);
  const [filters, setFilters] = useState({
    equity: false,
    beginner: false,
    categories: [] as string[]
  });

  // Debounced API call
  useEffect(() => {
    if (!state.country || !state.age || !state.path) return;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: state.path,
            country: state.country,
            age: state.age,
            skills: state.skills,
            flags: filters,
            filters: { categories: filters.categories }
          })
        });

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, filters]);

  const handlePathSelect = (pathId: string) => {
    setState({ ...state, path: pathId as any });
  };

  const handleReset = () => {
    setState({ skills: [] });
    setFilters({ equity: false, beginner: false, categories: [] });
    setResults(null);
  };

  const selectedPathName = PATHS.find(p => p.id === state.path)?.name;

  return (
    <div className={styles.matchesPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            Matches {state.country && `for ${state.country}`}
            {selectedPathName && ` · Path: ${selectedPathName}`}
            {results && ` · ${results.recommendations.length} results`}
          </h1>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Left Panel - Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            {/* Path Selector */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Choose Your Path</h3>
              <div className={styles.pathSelector}>
                {PATHS.map((path) => (
                  <button
                    key={path.id}
                    className={`${styles.pathOption} ${
                      state.path === path.id ? styles.pathOptionSelected : ''
                    }`}
                    onClick={() => handlePathSelect(path.id)}
                  >
                    <span className={styles.pathEmoji}>{path.emoji}</span>
                    <span className={styles.pathName}>{path.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Your Profile</h3>
              
              <label className={styles.field}>
                <span className={styles.label}>Country</span>
                <select
                  className={styles.select}
                  value={state.country || ''}
                  onChange={(e) => setState({ ...state, country: e.target.value })}
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Age</span>
                <select
                  className={styles.select}
                  value={state.age || ''}
                  onChange={(e) => setState({ ...state, age: Number(e.target.value) })}
                >
                  <option value="">Select age</option>
                  {Array.from({ length: 46 }, (_, i) => i + 15).map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </label>

              <div className={styles.field}>
                <span className={styles.label}>Skills</span>
                <SkillChips
                  value={state.skills}
                  onChange={(skills) => setState({ ...state, skills })}
                  placeholder="e.g., first aid, organizing, carpentry"
                />
              </div>
            </div>

            {/* Filters */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Filters</h3>
              
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.equity}
                  onChange={(e) => setFilters({ ...filters, equity: e.target.checked })}
                />
                <span>High-risk / low connectivity areas</span>
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filters.beginner}
                  onChange={(e) => setFilters({ ...filters, beginner: e.target.checked })}
                />
                <span>Beginner friendly only</span>
              </label>

              <div className={styles.categoryFilters}>
                <span className={styles.label}>Categories</span>
                <div className={styles.categoryGrid}>
                  {['Physical tasks', 'Logistics', 'Energy', 'Water', 'Healthcare', 'Education'].map(category => (
                    <label key={category} className={styles.categoryCheckbox}>
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...filters.categories, category]
                            : filters.categories.filter(c => c !== category);
                          setFilters({ ...filters, categories: newCategories });
                        }}
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button className={styles.resetButton} onClick={handleReset}>
              Reset All
            </button>
          </div>
        </aside>

        {/* Right Panel - Results */}
        <main className={styles.main}>
          <div className={styles.resultsContent}>
            {/* Loading State */}
            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <p>Finding your best matches...</p>
              </div>
            )}

            {/* Risk Snapshot */}
            {results?.countryRisk && (
              <div className={styles.riskSection}>
                <h3 className={styles.riskTitle}>
                  Climate Risk Snapshot • {results.countryRisk.source}
                </h3>
                <RiskBars risk={results.countryRisk} />
              </div>
            )}

            {/* Recommendations */}
            {results && !loading && (
              <div className={styles.recommendations}>
                <div className={styles.recommendationsHeader}>
                  <h2>Your Matches</h2>
                  <button className={styles.saveButton}>
                    Save Plan
                  </button>
                </div>

                <div className={styles.roleGrid}>
                  {results.recommendations.map((role, index) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!results && !loading && (
              <div className={styles.emptyState}>
                <div className={styles.emptyEmoji}>🌍</div>
                <h3>Ready to find your climate action path?</h3>
                <p>Fill out your profile on the left to see personalized recommendations.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}