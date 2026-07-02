import { useAuth } from '../../../context/AuthContext';

export default function TopAppBar() {
  const { user } = useAuth();

  return (
    <header className="z-40 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--outline-variant)]/30 flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full h-16 sticky top-0">
      
      {/* Notifications & Profile Area */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="hover:bg-[var(--surface-container-high)] p-2 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[var(--secondary)]">
              notifications
            </span>
          </button>
          
          <div className="flex items-center gap-2 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 px-3 py-1.5 rounded-full cursor-pointer hover:border-[var(--primary)]/50 transition-colors">
            <span 
              className="material-symbols-outlined text-[var(--primary)] text-2xl" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_circle
            </span>
            <span className="text-sm font-bold text-[var(--primary)] hidden sm:block">
              {user?.name?.split(' ')[0] || 'طالب'} {/* Shows just their first name */}
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar (Hidden on Mobile) */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute right-3 text-[var(--outline)]">
            search
          </span>
          <input 
            type="text" 
            placeholder="ابحث في دروسك..." 
            className="w-full bg-[var(--surface-container-low)] border-none rounded-full pr-10 pl-4 py-2 text-sm focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
          />
        </div>
      </div>

      {/* Mobile Menu Hamburger (Visible only on Mobile) */}
      <div className="md:hidden">
        <button className="p-2 -mr-2">
          <span className="material-symbols-outlined text-[var(--primary)] text-2xl">
            menu
          </span>
        </button>
      </div>

    </header>
  );
}