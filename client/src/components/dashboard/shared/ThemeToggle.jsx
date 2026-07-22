import { useTheme } from '../../../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-[var(--primary)]/10 text-[var(--on-surface-variant)] hover:text-[var(--primary)] transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-90 focus:outline-none focus:ring-0 overflow-hidden group"
    >
      {/* Sun Icon */}
      <span 
        className={`material-symbols-outlined absolute text-[24px] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isDark 
            ? 'opacity-0 rotate-90 scale-50' 
            : 'opacity-100 rotate-0 scale-100'
        }`}
      >
        light_mode
      </span>
      
      {/* Moon Icon */}
      <span 
        className={`material-symbols-outlined absolute text-[24px] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isDark 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-90 scale-50'
        }`}
      >
        dark_mode
      </span>
    </button>
  );
}