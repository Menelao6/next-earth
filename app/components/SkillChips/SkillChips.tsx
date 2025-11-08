"use client";

import { useRef, useState } from "react";
import styles from "./SkillChips.module.css";

interface SkillChipsProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
}

export default function SkillChips({
  value,
  onChange,
  placeholder = "Type a skill and press Enter…",
  max = 10,
}: SkillChipsProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addSkill(s: string) {
    const skill = s.trim();
    if (!skill) return;
    if (value.includes(skill.toLowerCase())) return;
    if (value.length >= max) return;
    onChange([...value, skill.toLowerCase()]);
    setInput("");
    inputRef.current?.focus();
  }

  function removeSkill(s: string) {
    onChange(value.filter(v => v !== s));
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.chips} aria-live="polite">
        {value.map((s) => (
          <span key={s} className={styles.chip}>
            {s}
            <button
              type="button"
              className={styles.x}
              aria-label={`Remove ${s}`}
              onClick={() => removeSkill(s)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill(input);
            } else if (e.key === "Backspace" && !input && value.length) {
              removeSkill(value[value.length - 1]);
            }
          }}
          placeholder={placeholder}
          aria-label="Add skills"
        />
      </div>
      <div className={styles.hint}>{value.length}/{max} skills</div>
    </div>
  );
}
