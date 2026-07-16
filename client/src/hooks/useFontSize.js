import { useState, useEffect } from 'react';

const STORAGE_KEY = 'course-reader-font-size';
export const FONT_SIZE_MIN = 0;
export const FONT_SIZE_MAX = 3;
const DEFAULT_LEVEL = 1;

export function useFontSize() {
  const [level, setLevel] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved !== null ? parseInt(saved, 10) : DEFAULT_LEVEL;
      return Number.isInteger(parsed) && parsed >= FONT_SIZE_MIN && parsed <= FONT_SIZE_MAX
        ? parsed
        : DEFAULT_LEVEL;
    } catch {
      return DEFAULT_LEVEL;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(level));
    } catch {
      // localStorage unavailable — preference just won't persist, non-critical
    }
  }, [level]);

  const increase = () => setLevel((l) => Math.min(l + 1, FONT_SIZE_MAX));
  const decrease = () => setLevel((l) => Math.max(l - 1, FONT_SIZE_MIN));

  return { level, increase, decrease };
}