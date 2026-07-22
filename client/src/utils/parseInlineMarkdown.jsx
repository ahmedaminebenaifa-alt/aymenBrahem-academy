import React from 'react';

export function parseInlineMarkdown(text) {
  const nodes = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined) {
      nodes.push(
        <a
          key={key++}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline decoration-primary/30 decoration-2 underline-offset-4 rounded-sm px-0.5 transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:decoration-on-primary-container hover:text-on-primary-container hover:bg-primary/[0.06] focus:outline-none"
        >
          {match[1]}
        </a>
      );
    } else if (match[3] !== undefined) {
      nodes.push(<strong key={key++} className="font-bold">{parseInlineMarkdown(match[3])}</strong>);
    } else if (match[4] !== undefined) {
      nodes.push(<em key={key++} className="italic">{parseInlineMarkdown(match[4])}</em>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}