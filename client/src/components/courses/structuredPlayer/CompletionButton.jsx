export default function CompletionButton({ isCompleted, onToggle, isPending = false }) {
  return (
    <button
      onClick={onToggle}
      className={`group relative flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-[Inter] text-base font-bold transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus:ring-0 overflow-hidden active:scale-[0.97] ${
        isCompleted
          ? 'bg-[var(--primary)] text-[var(--surface)] border border-[var(--primary)] shadow-md hover:shadow-lg hover:-translate-y-1'
          : 'bg-[var(--surface)] text-[var(--on-surface-variant)] border border-[var(--outline-variant)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md hover:-translate-y-1'
      }`}
      disabled={isPending}
    >
      <span 
        className={`material-symbols-outlined text-[24px] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isCompleted 
            ? 'text-[var(--surface)] scale-110 drop-shadow-sm' 
            : 'text-[var(--outline)] group-hover:scale-110 group-hover:text-[var(--primary)]'
        }`}
      >
        {isCompleted ? 'task_alt' : 'radio_button_unchecked'}
      </span>
      <span className="relative z-10 tracking-wide">
        {isCompleted ? 'تم إكمال هذا الدرس بنجاح' : 'وضع علامة كمكتمل'}
      </span>
      
      {/* Luxurious glassy sheen effect for incomplete state */}
      {!isCompleted && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[var(--on-surface)]/5 to-transparent group-hover:animate-[shimmer_2s_infinite_ease-in-out]" />
      )}
    </button>
  );
}