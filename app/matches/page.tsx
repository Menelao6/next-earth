'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '../lib/useAppState';
import SkillChips from '../components/SkillChips/SkillChips';
import RoleCard from '../components/RoleCard/RoleCard';
import RiskBars from '../components/RiskBars/RiskBars';
import styles from './profile.module.css';

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
  "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe"
].sort();

const PATHS = [
  { 
    id: 'help_hospitals', 
    name: 'Help Hospitals', 
    emoji: '🏥',
    description: 'Support healthcare systems in climate-vulnerable areas',
    idealFor: ['Medical professionals', 'Logistics experts', 'Technical support']
  },
  { 
    id: 'support_communities', 
    name: 'Support Communities', 
    emoji: '🤝',
    description: 'Work directly with communities on resilience building',
    idealFor: ['Community organizers', 'Educators', 'Construction workers']
  },
  { 
    id: 'join_workforce', 
    name: 'Join Green Workforce', 
    emoji: '💼',
    description: 'Transition into climate-focused careers and opportunities',
    idealFor: ['Career changers', 'Students', 'Professionals seeking impact']
  }
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
  
  // State for searchable country dropdown
  const [countrySearch, setCountrySearch] = useState(state.country || '');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // State for age input
  const [ageInput, setAgeInput] = useState(state.age?.toString() || '');

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Debounced API call - ORIGINAL LOGIC
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

  // ORIGINAL HANDLERS
  const handlePathSelect = (pathId: string) => {
    setState({ ...state, path: pathId as any });
  };

  const handleCountrySelect = (country: string) => {
    setState({ ...state, country });
    setCountrySearch(country);
    setShowCountryDropdown(false);
  };

  const handleCountrySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountrySearch(value);
    setShowCountryDropdown(true);
    
    // If the input matches a country exactly, select it
    if (COUNTRIES.includes(value)) {
      setState({ ...state, country: value });
    } else {
      setState({ ...state, country: '' });
    }
  };

  const handleAgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAgeInput(value);
    
    // Only update state if it's a valid number between 15 and 100
    const age = parseInt(value);
    if (!isNaN(age) && age >= 15 && age <= 100) {
      setState({ ...state, age });
    } else if (value === '') {
      setState({ ...state, age: undefined });
    }
  };

  const handleAgeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAgeInput(value);
    if (value) {
      const age = parseInt(value);
      setState({ ...state, age });
    } else {
      setState({ ...state, age: undefined });
    }
  };

  const handleReset = () => {
    setState({ skills: [] });
    setFilters({ equity: false, beginner: false, categories: [] });
    setResults(null);
    setCountrySearch('');
    setAgeInput('');
  };

  const selectedPathName = PATHS.find(p => p.id === state.path)?.name;
  const isSetupComplete = state.path && state.country && state.age && state.skills.length > 0;

  return (
    <div className={styles.matchesPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {state.country && `Matches for ${state.country}`}
            {!state.country && 'Find Your Climate Action Path'}
            {selectedPathName && ` · ${selectedPathName}`}
            {results && ` · ${results.recommendations.length} results`}
          </h1>
          <p className={styles.subtitle}>
            Discover personalized opportunities to make a difference based on your skills and interests
          </p>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Left Panel - Setup & Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            {/* Path Selector with Enhanced UI */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>1. Choose Your Path</h3>
              <p className={styles.sectionDescription}>
                Select how you want to make an impact
              </p>
              <div className={styles.pathSelector}>
                {PATHS.map((path) => (
                  <button
                    key={path.id}
                    className={`${styles.pathOption} ${
                      state.path === path.id ? styles.pathOptionSelected : ''
                    }`}
                    onClick={() => handlePathSelect(path.id)}
                  >
                    <div className={styles.pathHeader}>
                      <span className={styles.pathEmoji}>{path.emoji}</span>
                      <span className={styles.pathName}>{path.name}</span>
                      {state.path === path.id && (
                        <div className={styles.selectedIndicator}>✓</div>
                      )}
                    </div>
                    <p className={styles.pathDescription}>{path.description}</p>
                    <div className={styles.idealFor}>
                      <strong>Ideal for:</strong> {path.idealFor.join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Setup with Enhanced UI */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>2. Your Profile</h3>
              <p className={styles.sectionDescription}>
                Tell us about yourself for personalized matches
              </p>
              
              {/* Progress Indicator */}
              {state.path && (
                <div className={styles.progressSection}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ 
                        width: `${((state.country ? 1 : 0) + (state.age ? 1 : 0) + (state.skills.length > 0 ? 1 : 0)) / 3 * 100}%` 
                      }}
                    />
                  </div>
                  <div className={styles.progressText}>
                    Profile: {state.country && state.age && state.skills.length > 0 ? 'Complete' : 'Incomplete'}
                  </div>
                </div>
              )}
              
              {/* Country Field */}
              <div className={styles.field}>
                <label className={styles.label}>
                  <span>Country</span>
                  {state.country && <span className={styles.completeIndicator}>✓</span>}
                </label>
                <p className={styles.fieldDescription}>We'll show climate risks and opportunities in your region</p>
                <div className={styles.countrySearchContainer}>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search for a country..."
                    value={countrySearch}
                    onChange={handleCountrySearchChange}
                    onFocus={() => setShowCountryDropdown(true)}
                  />
                  {showCountryDropdown && filteredCountries.length > 0 && (
                    <div className={styles.countryDropdown}>
                      {filteredCountries.slice(0, 8).map((country) => (
                        <button
                          key={country}
                          className={styles.countryOption}
                          onClick={() => handleCountrySelect(country)}
                        >
                          {country}
                        </button>
                      ))}
                      {filteredCountries.length > 8 && (
                        <div className={styles.dropdownNote}>
                          {filteredCountries.length - 8} more countries...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Age Field */}
              <div className={styles.field}>
                <label className={styles.label}>
                  <span>Age</span>
                  {state.age && <span className={styles.completeIndicator}>✓</span>}
                </label>
                <p className={styles.fieldDescription}>Helps us recommend age-appropriate opportunities</p>
                <div className={styles.ageInputContainer}>
                  <input
                    type="number"
                    className={styles.ageInput}
                    placeholder="Enter your age"
                    value={ageInput}
                    onChange={handleAgeInputChange}
                    min={15}
                    max={100}
                  />
                  <span className={styles.ageOr}>or</span>
                  <select
                    className={styles.ageSelect}
                    value={ageInput}
                    onChange={handleAgeSelectChange}
                  >
                    <option value="">Select age</option>
                    {Array.from({ length: 86 }, (_, i) => i + 15).map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills Field */}
              <div className={styles.field}>
                <label className={styles.label}>
                  <span>Skills</span>
                  {state.skills.length > 0 && <span className={styles.completeIndicator}>✓</span>}
                </label>
                <p className={styles.fieldDescription}>What are you good at? We'll match these with climate action needs</p>
                <SkillChips
                  value={state.skills}
                  onChange={(skills) => setState({ ...state, skills })}
                  placeholder="e.g., first aid, organizing, carpentry"
                />
              </div>
            </div>

            {/* Filters - ORIGINAL LOGIC */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>3. Refine Results</h3>
              <p className={styles.sectionDescription}>
                Filter your matches to find the perfect opportunity
              </p>
              
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

        {/* Right Panel - Results - ORIGINAL LOGIC */}
        <main className={styles.main}>
          <div className={styles.resultsContent}>
            {/* Loading State */}
            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <p>Finding your best matches...</p>
                {state.country && (
                  <p className={styles.loadingSubtext}>
                    Analyzing climate needs in {state.country}
                  </p>
                )}
              </div>
            )}

            {/* Setup Guidance */}
            {!isSetupComplete && !loading && (
              <div className={styles.setupGuide}>
                <div className={styles.guideEmoji}>🎯</div>
                <h3>Complete your profile to see matches</h3>
                <p>Fill out the information on the left to discover personalized climate action opportunities.</p>
                <div className={styles.guideSteps}>
                  <div className={styles.guideStep}>
                    <span className={styles.stepNumber}>1</span>
                    <div className={styles.stepContent}>
                      <strong>Choose your path</strong>
                      <p>Select how you want to contribute to climate action</p>
                    </div>
                  </div>
                  <div className={styles.guideStep}>
                    <span className={styles.stepNumber}>2</span>
                    <div className={styles.stepContent}>
                      <strong>Tell us about yourself</strong>
                      <p>Add your country, age, and skills for personalized matches</p>
                    </div>
                  </div>
                  <div className={styles.guideStep}>
                    <span className={styles.stepNumber}>3</span>
                    <div className={styles.stepContent}>
                      <strong>Get your matches</strong>
                      <p>Receive tailored climate action recommendations</p>
                    </div>
                  </div>
                </div>
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
                  <div className={styles.resultsInfo}>
                    <span>{results.recommendations.length} opportunities found</span>
                    <button className={styles.saveButton}>
                      Save Plan
                    </button>
                  </div>
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

            {/* Empty State when setup complete but no results */}
            {isSetupComplete && !results && !loading && (
              <div className={styles.readyState}>
                <div className={styles.readyEmoji}>🚀</div>
                <h3>Ready to find your matches!</h3>
                <p>We're analyzing your profile to find the best climate action opportunities for you.</p>
                <p>Matches will appear here momentarily...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}