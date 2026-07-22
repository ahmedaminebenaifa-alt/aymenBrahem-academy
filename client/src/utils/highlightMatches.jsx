import React from 'react';

// Wraps every occurrence of any word in `query` inside `text` with a highlight span.
// Case-insensitive, multi-word — matches the same word-splitting logic the backend uses.
export function highlightMatches(text, query) {
  if (!query || !query.trim()) return text;

  const words = query.trim().split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return text;

  // Escape regex-special characters in each word, then join as alternatives
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

  const parts = text.split(pattern);

  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark
        key={i}
        className="bg-[var(--primary)]/15 text-[var(--primary)] rounded-sm px-0.5 font-bold"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}