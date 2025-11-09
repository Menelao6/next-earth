import { useState } from 'react';
import SkillChips from '../SkillChips/SkillChips';
import styles from './ProfileSetup.module.css';

interface ProfileSetupProps {
  country: string;
  age: number | undefined;
  skills: string[];
  onCountryChange: (country: string) => void;
  onAgeChange: (age: number | undefined) => void;
  onSkillsChange: (skills: string[]) => void;
}

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  // ... rest of countries (same as before)
].sort();

export default function ProfileSetup({
  country,
  age,
  skills,
  onCountryChange,
  onAgeChange,
  onSkillsChange
}: ProfileSetupProps) {
  const [countrySearch, setCountrySearch] = useState(country || '');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [ageInput, setAgeInput] = useState(age?.toString() || '');

  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountrySelect = (selectedCountry: string) => {
    onCountryChange(selectedCountry);
    setCountrySearch(selectedCountry);
    setShowCountryDropdown(false);
  };

  const handleCountrySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountrySearch(value);
    setShowCountryDropdown(true);
    
    if (COUNTRIES.includes(value)) {
      onCountryChange(value);
    } else {
      onCountryChange('');
    }
  };

  const handleAgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAgeInput(value);
    
    const ageValue = parseInt(value);
    if (!isNaN(ageValue) && ageValue >= 1 && ageValue <= 100) {
      onAgeChange(ageValue);
    } else if (value === '') {
      onAgeChange(undefined);
    }
  };

  const handleAgeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAgeInput(value);
    if (value) {
      onAgeChange(parseInt(value));
    } else {
      onAgeChange(undefined);
    }
  };

  const isProfileComplete = country && age && skills.length > 0;

  return (
    <div className={styles.profileSetup}>
      <div className={styles.header}>
        <h2 className={styles.title}>Complete Your Profile</h2>
        <p className={styles.subtitle}>
          Tell us about yourself to get personalized climate action recommendations
        </p>
        
        {isProfileComplete && (
          <div className={styles.completionBadge}>
            <span>✅</span>
            <span>Profile Complete - Ready to find matches!</span>
          </div>
        )}
      </div>

      <div className={styles.formGrid}>
        {/* Country Field */}
        <div className={styles.field}>
          <label className={styles.label}>
            <span className={styles.labelText}>Your Country</span>
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.fieldDescription}>
            We'll use this to show climate risks and opportunities in your region
          </p>
          <div className={styles.countrySearchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Start typing your country..."
              value={countrySearch}
              onChange={handleCountrySearchChange}
              onFocus={() => setShowCountryDropdown(true)}
            />
            {showCountryDropdown && filteredCountries.length > 0 && (
              <div className={styles.countryDropdown}>
                {filteredCountries.slice(0, 8).map((countryOption) => (
                  <button
                    key={countryOption}
                    className={styles.countryOption}
                    onClick={() => handleCountrySelect(countryOption)}
                  >
                    {countryOption}
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
            <span className={styles.labelText}>Your Age</span>
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.fieldDescription}>
            Helps us recommend age-appropriate opportunities and training
          </p>
          <div className={styles.ageInputContainer}>
            <input
              type="number"
              className={styles.ageInput}
              placeholder="Enter your age"
              value={ageInput}
              onChange={handleAgeInputChange}
              min={1}
              max={100}
            />
            <span className={styles.ageOr}>or select:</span>
            <select
              className={styles.ageSelect}
              value={ageInput}
              onChange={handleAgeSelectChange}
            >
              <option value="">Choose age</option>
              {Array.from({ length: 100 }, (_, i) => i + 1).map(ageOption => (
                <option key={ageOption} value={ageOption}>{ageOption}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills Field */}
        <div className={styles.field}>
          <label className={styles.label}>
            <span className={styles.labelText}>Your Skills</span>
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.fieldDescription}>
            What are you good at? We'll match these with climate action needs
          </p>
          <SkillChips
            value={skills}
            onChange={onSkillsChange}
            placeholder="e.g., first aid, organizing, carpentry, teaching..."
          />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>Profile Progress</span>
          <span>{isProfileComplete ? '100%' : 'Incomplete'}</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${((!!country ? 1 : 0) + (!!age ? 1 : 0) + (skills.length > 0 ? 1 : 0)) / 3 * 100}%` 
            }}
          />
        </div>
        <div className={styles.progressSteps}>
          <div className={`${styles.progressStep} ${country ? styles.completed : ''}`}>
            <span>📍 Country</span>
          </div>
          <div className={`${styles.progressStep} ${age ? styles.completed : ''}`}>
            <span>🎂 Age</span>
          </div>
          <div className={`${styles.progressStep} ${skills.length > 0 ? styles.completed : ''}`}>
            <span>🛠️ Skills</span>
          </div>
        </div>
      </div>
    </div>
  );
}