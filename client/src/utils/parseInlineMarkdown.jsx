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
      // [text](url) — link text itself can't contain further markdown here, kept simple
      nodes.push(
        <a
          key={key++}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#025c3a] underline decoration-[#025c3a]/30 decoration-2 underline-offset-4 rounded-sm px-0.5 transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:decoration-[#025c3a] hover:text-[#012d1d] hover:bg-[#025c3a]/[0.06] focus:outline-none"
        >
          {match[1]}
        </a>
      );
    } else if (match[3] !== undefined) {
      // **bold** — recursively parse inner content so nested links/italics still work
      nodes.push(<strong key={key++} className="font-bold">{parseInlineMarkdown(match[3])}</strong>);
    } else if (match[4] !== undefined) {
      // *italic* — same recursion
      nodes.push(<em key={key++} className="italic">{parseInlineMarkdown(match[4])}</em>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}