import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCourseSearch } from '../../../hooks/useCourseSearch';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useSidebar } from '../../../context/SidebarContext';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import { highlightMatches } from '../../../utils/highlightMatches.jsx';

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const SHORTCUT_LABEL = isMac ? '⌘K' : 'Ctrl K';

const MATCH_LABELS = {
  title: null,
  description: 'في الوصف',
  subcourse: 'في وحدة',
  theme: 'في موضوع',
  content: 'في محتوى الدرس',
};

function SearchInput({ query, setQuery, isSearchOpen, setIsSearchOpen, clear, results, loading, isAdmin, onResultClick, placeholder, inputRef, showShortcutHint = false }) {
  return (
    <>
      <div className="relative flex items-center w-full group">
        <span className="material-symbols-outlined absolute right-4 text-[var(--outline)] group-focus-within:text-[var(--primary)] transition-colors duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]">
          search
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsSearchOpen(true); }}
          onFocus={() => setIsSearchOpen(true)}
          placeholder={placeholder}
          className="w-full bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 rounded-full pr-12 pl-10 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]/60 focus:outline-none focus:bg-[var(--surface)] focus:border-[var(--primary)]/40 focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] shadow-sm"
        />
        {query ? (
          <button 
            onClick={clear} 
            className="absolute left-3 w-8 h-8 flex items-center justify-center rounded-full text-[var(--outline)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container-low)] transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-90"
          >
            <span className="material-symbols-outlined text-sm block">close</span>
          </button>
        ) : (
          showShortcutHint && (
            <kbd className="hidden md:flex absolute left-3 items-center gap-0.5 text-[10px] font-bold text-[var(--outline)] bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/40 rounded-md px-1.5 py-0.5 pointer-events-none select-none">
              {SHORTCUT_LABEL}
            </kbd>
          )
        )}
      </div>

      {isSearchOpen && query.trim().length >= 2 && (
        <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--outline-variant)]/20 rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] overflow-hidden z-[70] max-h-[22rem] overflow-y-auto animate-dropdown-fade">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3 text-[var(--on-surface-variant)]">
              <span className="material-symbols-outlined animate-spin text-2xl text-[var(--primary)]">progress_activity</span>
              <span className="text-sm font-medium">جاري البحث...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3 text-[var(--on-surface-variant)]">
              <span className="material-symbols-outlined text-4xl opacity-50">search_off</span>
              <span className="text-sm font-medium">لا توجد نتائج مطابقة لبحثك</span>
            </div>
          ) : (
            <div className="p-2">
              {results.map((course) => (
                <button
                  key={course.id}
                  onClick={() => onResultClick(course)}
                  className="w-full text-right p-2.5 rounded-xl hover:bg-[var(--surface-container-low)] transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center gap-3 group/item active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/20 flex items-center justify-center shrink-0 overflow-hidden shadow-sm group-hover/item:border-[var(--primary)]/30 transition-colors">
                    {course.coverImage ? (
                      <img src={course.coverImage} alt="" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)]" />
                    ) : (
                      <span className="material-symbols-outlined text-[var(--primary)]/40 text-xl">auto_stories</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-sm font-bold text-[var(--on-surface)] truncate group-hover/item:text-[var(--primary)] transition-colors duration-[400ms]">
                      {highlightMatches(course.title, query)}
                    </p>

                    {course.matchLocation && course.matchLocation !== 'title' && course.matchText && (
                      <p className="text-xs text-[var(--on-surface-variant)]/80 truncate mt-0.5 flex items-center gap-1">
                        {MATCH_LABELS[course.matchLocation] && (
                          <span className="text-[var(--primary)]/70 font-bold shrink-0">{MATCH_LABELS[course.matchLocation]}:</span>
                        )}
                        <span className="truncate">{highlightMatches(course.matchText, query)}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold ${course.isFree ? 'text-[var(--primary)]' : 'text-[var(--on-surface-variant)]'}`}>
                        {course.isFree ? 'مجانية بالكامل' : `${Number(course.price).toLocaleString('en-US')} د.ت`}
                      </span>
                      {isAdmin && !course.published && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[var(--outline-variant)]/50"></span>
                          <span className="text-[10px] bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] px-1.5 py-0.5 rounded-md font-medium">مسودة</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[var(--outline)] opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] ml-2">
                    arrow_forward_ios
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function TopAppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggle } = useSidebar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useClickOutside(() => setIsMenuOpen(false));

  const isAdmin = user?.role === 'ADMIN';
  const settingsPath = isAdmin ? '/dashboard/admin/settings' : '/dashboard/student/settings';
  const displayName = user?.name?.split(' ')[0] || (isAdmin ? 'المسؤول' : 'طالب');

  const [isHidden, setIsHidden] = useState(false);

  const { query, setQuery, results, loading, clear } = useCourseSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useClickOutside(() => setIsSearchOpen(false));
  const mobileSearchRef = useClickOutside(() => setIsSearchOpen(false));

  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const searchPlaceholder = isAdmin ? 'ابحث في الدورات...' : 'ابحث في دروسك...';

  const handleResultClick = (course) => {
    clear();
    setIsSearchOpen(false);
    if (isAdmin) {
      navigate(`/dashboard/admin/courses/${course.id}/edit`);
      return;
    }
    navigate(`/dashboard/student/courses/${course.id}/structure`, {
      state: { courseTitle: course.title },
    });
  };

  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        const desktopEl = desktopInputRef.current;
        const mobileEl = mobileInputRef.current;
        if (desktopEl && desktopEl.offsetParent !== null) {
          desktopEl.focus();
        } else if (mobileEl) {
          mobileEl.focus();
        }
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (isMenuOpen || isNotificationOpen || isSearchOpen) {
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY < 64) {
        setIsHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY) {
        setIsHidden(true);
        setIsMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen, isNotificationOpen, isSearchOpen]);

  return (
    <>
      <style>{`
        @keyframes dropdownFade {
          0% { opacity: 0; transform: translateY(-10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dropdown-fade {
          animation: dropdownFade 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
      <header
        className={`z-40 bg-[var(--surface)]/85 backdrop-blur-xl border-b border-[var(--outline-variant)]/20 w-full sticky top-0 transition-transform duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] shadow-sm ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex justify-between items-center pr-6 pl-4 md:pr-10 md:pl-6 w-full h-16 md:h-[72px]">
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              <NotificationBell onToggle={setIsNotificationOpen} />

              <div className="w-[1px] h-6 bg-[var(--outline-variant)]/30 mx-1 hidden md:block"></div>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 bg-transparent border border-transparent hover:bg-[var(--surface-container-low)] hover:border-[var(--outline-variant)]/30 pl-2 pr-1.5 py-1.5 rounded-full transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 group cursor-pointer"
                >
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name} 
                      className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-[var(--primary)]/20 group-hover:border-[var(--primary)]/50 transition-colors duration-[400ms]" 
                    />
                  ) : (
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center border-2 border-[var(--primary)]/20 group-hover:border-[var(--primary)]/50 transition-colors duration-[400ms]">
                      <span className="material-symbols-outlined text-[var(--primary)] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        person
                      </span>
                    </div>
                  )}
                  
                  <div className="hidden sm:flex flex-col items-start justify-center pt-0.5">
                    <span className="text-sm font-bold text-[var(--on-surface)] leading-none mb-1 group-hover:text-[var(--primary)] transition-colors duration-[400ms]">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-[var(--on-surface-variant)] leading-none font-medium">
                      {isAdmin ? 'مدير النظام' : 'طالب علم'}
                    </span>
                  </div>

                  <span className={`material-symbols-outlined text-[var(--outline)] text-xl transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'rotate-180 text-[var(--primary)]' : 'group-hover:text-[var(--primary)] group-hover:translate-y-[1px]'}`}>
                    expand_more
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 max-w-[calc(100vw-2rem)] bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--outline-variant)]/20 rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] overflow-hidden z-[60] origin-top-right animate-dropdown-fade">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60"></div>
                    
                    <div className="px-5 py-4 border-b border-[var(--outline-variant)]/10 bg-[var(--surface-container-lowest)]/50">
                      <p className="text-base font-bold text-[var(--on-surface)] truncate mb-0.5">{user?.name}</p>
                      <p className="text-xs text-[var(--on-surface-variant)] truncate font-sans">{user?.email}</p>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => { navigate(settingsPath); setIsMenuOpen(false); }}
                        className="w-full text-right px-4 py-3 text-sm font-bold text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)] rounded-xl transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] flex items-center gap-3 group"
                      >
                        <span className="material-symbols-outlined text-[20px] text-[var(--primary)] transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-45">settings</span>
                        الإعدادات
                      </button>

                      <div className="h-[1px] bg-[var(--outline-variant)]/10 my-1 mx-3"></div>

                      <button
                        onClick={logout}
                        className="w-full text-right px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50/80 dark:hover:bg-red-500/10 hover:text-red-700 rounded-xl transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] flex items-center gap-3 group"
                      >
                        <span className="material-symbols-outlined text-[20px] transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-1">logout</span>
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-6 hidden md:block relative z-10" ref={searchRef}>
            <SearchInput
              query={query}
              setQuery={setQuery}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              clear={clear}
              results={results}
              loading={loading}
              isAdmin={isAdmin}
              onResultClick={handleResultClick}
              placeholder={searchPlaceholder}
              inputRef={desktopInputRef}
              showShortcutHint
            />
          </div>

          <div className="shrink-0 flex items-center justify-end">
            <button 
              onClick={toggle} 
              aria-label="القائمة الجانبية"
              className="relative w-11 h-11 -mr-2 flex items-center justify-center rounded-full text-[var(--on-surface)] hover:text-[var(--primary)] transition-colors duration-300 group focus:outline-none"
            >
              <span className="absolute inset-0 rounded-full bg-[var(--primary)]/10 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-active:scale-90 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="absolute inset-0 rounded-full border border-[var(--primary)]/30 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="material-symbols-outlined text-[26px] relative z-10 transition-transform duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 group-hover:scale-105 group-active:scale-90">
                menu
              </span>
            </button>
          </div>
        </div>

        <div className="md:hidden px-6 pb-3 relative z-10" ref={mobileSearchRef}>
          <SearchInput
            query={query}
            setQuery={setQuery}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            clear={clear}
            results={results}
            loading={loading}
            isAdmin={isAdmin}
            onResultClick={handleResultClick}
            placeholder={searchPlaceholder}
            inputRef={mobileInputRef}
          />
        </div>
      </header>
    </>
  );
}