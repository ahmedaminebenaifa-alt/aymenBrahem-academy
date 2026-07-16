import { useEffect } from 'react';

// RTL layout: ArrowRight = previous (backward), ArrowLeft = next (forward) —
// matches the prev/next button icon directions in the UI.
export function useKeyboardNav({ goPrev, goNext, hasPrev, hasNext }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' && hasPrev) goPrev();
      if (e.key === 'ArrowLeft' && hasNext) goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext, hasPrev, hasNext]);
}