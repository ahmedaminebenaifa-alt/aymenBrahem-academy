import { parseInlineMarkdown } from '../../../utils/parseInlineMarkdown.jsx';

const SIZE_SCALE = {
  0: { h1: 'text-2xl', h2: 'text-lg', h3: 'text-base', p: 'text-sm' },
  1: { h1: 'text-3xl lg:text-4xl', h2: 'text-xl', h3: 'text-lg', p: 'text-base' },
  2: { h1: 'text-4xl lg:text-5xl', h2: 'text-2xl', h3: 'text-xl', p: 'text-lg' },
  3: { h1: 'text-5xl', h2: 'text-3xl', h3: 'text-2xl', p: 'text-xl' },
};

function parseHeadingLevel(line) {
  const trimmed = line.trim();
  for (const level of [3, 2, 1]) {
    const marker = '#'.repeat(level);
    if (trimmed.startsWith(marker + ' ')) {
      return { level, text: trimmed.slice(marker.length + 1).trim() };
    }
    if (trimmed.endsWith(' ' + marker)) {
      return { level, text: trimmed.slice(0, -(marker.length + 1)).trim() };
    }
  }
  return null;
}

export function ContentTitle({ children, fontSizeLevel = 1 }) {
  const scale = SIZE_SCALE[fontSizeLevel] || SIZE_SCALE[1];
  return (
    <h1 className={`font-[Noto_Serif_Arabic] font-bold text-[var(--primary)] mb-6 leading-tight ${scale.h1}`}>
      {children}
    </h1>
  );
}

export default function ContentBody({ body, fontSizeLevel = 1 }) {
  const scale = SIZE_SCALE[fontSizeLevel] || SIZE_SCALE[1];
  const lines = body.split('\n');

  const blocks = [];
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      blocks.push({ type: 'list', items: currentList });
      currentList = null;
    }
  };

  lines.forEach((line) => {
    if (line.trim() === '') {
      flushList();
      return;
    }

    if (/^-\s+/.test(line.trim())) {
      if (!currentList) currentList = [];
      currentList.push(line.trim().replace(/^-\s+/, ''));
      return;
    }

    flushList();

    const heading = parseHeadingLevel(line);
    if (heading) {
      blocks.push({ type: 'heading', level: heading.level, text: heading.text });
    } else {
      blocks.push({ type: 'paragraph', text: line });
    }
  });
  flushList();

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === 'list') {
          return (
            <ul key={i} className={`list-disc pr-6 space-y-2 font-[Be_Vietnam_Pro] leading-[2] text-[var(--on-surface-variant)] ${scale.p}`}>
              {block.items.map((item, j) => (
                <li key={j} className="marker:text-[var(--primary)]">
                  {parseInlineMarkdown(item)}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'heading' && block.level === 3) {
          return (
            <h4 key={i} className={`font-[Noto_Serif_Arabic] font-semibold text-[var(--on-surface-variant)] mt-8 mb-2 leading-relaxed ${scale.h3}`}>
              {parseInlineMarkdown(block.text)}
            </h4>
          );
        }
        if (block.type === 'heading' && block.level === 2) {
          return (
            <h3 key={i} className={`font-[Noto_Serif_Arabic] font-semibold text-[var(--primary)] mt-10 mb-4 border-b border-[var(--outline-variant)]/20 pb-2 leading-relaxed ${scale.h2}`}>
              {parseInlineMarkdown(block.text)}
            </h3>
          );
        }
        if (block.type === 'heading' && block.level === 1) {
          return (
            <h2 key={i} className={`font-[Noto_Serif_Arabic] font-bold text-[var(--primary)] mt-12 mb-6 leading-tight ${scale.h1}`}>
              {parseInlineMarkdown(block.text)}
            </h2>
          );
        }
        return (
          <p key={i} className={`font-[Be_Vietnam_Pro] leading-[2] text-[var(--on-surface-variant)] ${scale.p}`}>
            {parseInlineMarkdown(block.text)}
          </p>
        );
      })}
    </div>
  );
}