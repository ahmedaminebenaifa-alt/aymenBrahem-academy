import { FONT_SIZE_MIN, FONT_SIZE_MAX } from '../../../hooks/useFontSize';

export default function FontSizeControl({ level, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center gap-1 bg-[var(--surface)] border border-[var(--outline-variant)]/50 shadow-sm rounded-full px-1 py-1 transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-md hover:border-[var(--primary)]/30">
      
      {/* Decrease Button */}
      <button
        onClick={onDecrease}
        disabled={level <= FONT_SIZE_MIN}
        aria-label="تصغير الخط"
        className="group w-7 h-7 flex items-center justify-center rounded-full text-[var(--on-surface-variant)] hover:text-white hover:bg-[var(--primary)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-90 focus:outline-none focus:ring-0"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-active:scale-95"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      
      {/* Divider */}
      <div className="w-px h-4 bg-[var(--outline-variant)]/50 transition-colors duration-[400ms]" />
      
      {/* Increase Button */}
      <button
        onClick={onIncrease}
        disabled={level >= FONT_SIZE_MAX}
        aria-label="تكبير الخط"
        className="group w-7 h-7 flex items-center justify-center rounded-full text-[var(--on-surface-variant)] hover:text-white hover:bg-[var(--primary)] disabled:opacity-30 disabled:pointer-events-none transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-90 focus:outline-none focus:ring-0"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-active:scale-95"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      
    </div>
  );
}