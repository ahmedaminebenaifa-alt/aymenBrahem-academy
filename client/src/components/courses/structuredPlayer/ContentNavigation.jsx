export default function ContentNavigation({ goPrev, goNext, hasPrev, hasNext }) {
  return (
    <div className="flex justify-between items-center pt-8 pb-4 mt-6 border-t border-[var(--outline-variant)]/40">
      
      {/* Previous Button */}
      <button
        onClick={goPrev}
        disabled={!hasPrev}
        className="group flex items-center gap-3 px-5 lg:px-6 py-3 text-[var(--on-surface-variant)] bg-transparent hover:bg-[var(--surface-container)] hover:text-[var(--primary)] rounded-xl font-[Inter] text-sm lg:text-base font-bold transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus:ring-0 hover:-translate-y-1 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
      >
        <span className="material-symbols-outlined text-[20px] transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-2">
          arrow_forward
        </span>
        <span className="hidden sm:inline">الدرس السابق</span>
      </button>
      
      {/* Next Button */}
      <button
        onClick={goNext}
        disabled={!hasNext}
        className="group relative flex items-center gap-3 px-6 lg:px-8 py-3 bg-[var(--primary)] text-[var(--surface)] border border-[var(--primary)] hover:opacity-95 rounded-xl font-[Inter] text-sm lg:text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-[0.97] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus:ring-0 overflow-hidden disabled:opacity-40 disabled:pointer-events-none"
      >
        <span className="hidden sm:inline relative z-10 tracking-wide">الدرس التالي</span>
        <span className="material-symbols-outlined text-[20px] text-[var(--surface)] transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-2 relative z-10">
          arrow_back
        </span>
        
        {/* Subtle inner premium reflection */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[var(--surface)]/10 to-transparent group-hover:animate-[shimmer_2s_infinite_ease-in-out]" />
      </button>
      
    </div>
  );
}