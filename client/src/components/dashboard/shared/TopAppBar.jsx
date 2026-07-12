import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useSidebar } from '../../../context/SidebarContext';
import NotificationBell from './NotificationBell';

export default function TopAppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggle } = useSidebar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useClickOutside(() => setIsMenuOpen(false));

  const isAdmin = user?.role === 'ADMIN';
  const settingsPath = isAdmin ? '/dashboard/admin/settings' : '/dashboard/student/settings';
  const displayName = user?.name?.split(' ')[0] || (isAdmin ? 'المسؤول' : 'طالب');

  
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const SCROLL_THRESHOLD = 5;

    const handleScroll = (e) => {
      const scrollEl = e.target === document ? document.documentElement : e.target;
      const currentY = scrollEl.scrollTop ?? window.scrollY;
      console.log('scroll fired', { target: e.target, currentY }); // TEMP DEBUG

      const delta = currentY - lastScrollY.current;

      if (Math.abs(delta) < SCROLL_THRESHOLD) {
        lastScrollY.current = currentY;
        return;
      }

      const scrolledDown = delta > 0;
      const pastTopBuffer = currentY > 80;
      console.log('direction check', { scrolledDown, pastTopBuffer }); // TEMP DEBUG

      if (scrolledDown && pastTopBuffer) {
        setIsHidden(true);
        setIsMenuOpen(false);
      } else if (!scrolledDown) {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, []);

  return (
    <header
      className={`z-30 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--outline-variant)]/30 flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full h-16 sticky top-0 transition-transform duration-300 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <NotificationBell />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 px-3 py-1.5 rounded-full cursor-pointer hover:border-[var(--primary)]/50 transition-colors"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[var(--primary)] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_circle
                </span>
              )}
              <span className="text-sm font-bold text-[var(--primary)] hidden sm:block">{displayName}</span>
              <span className="material-symbols-outlined text-[var(--outline)] text-lg">
                {isMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 rounded-[4px] shadow-lg overflow-hidden z-[60]">
                <div className="px-4 py-3 border-b border-[var(--outline-variant)]/20">
                  <p className="text-sm font-bold text-[var(--on-surface)] truncate">{user?.name}</p>
                  <p className="text-xs text-[var(--outline)] truncate">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                      مسؤول النظام
                    </span>
                  )}
                </div>

                <button
                  onClick={() => { navigate(settingsPath); setIsMenuOpen(false); }}
                  className="w-full text-right px-4 py-3 text-sm text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-low)] transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">settings</span>
                  الإعدادات
                </button>

                <button
                  onClick={logout}
                  className="w-full text-right px-4 py-3 text-sm text-red-600 hover:bg-red-50/60 transition-colors flex items-center gap-2 border-t border-[var(--outline-variant)]/10"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute right-3 text-[var(--outline)]">search</span>
          <input
            type="text"
            placeholder={isAdmin ? 'ابحث في لوحة التحكم...' : 'ابحث في دروسك...'}
            className="w-full bg-[var(--surface-container-low)] border-none rounded-full pr-10 pl-4 py-2 text-sm focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all"
          />
        </div>
      </div>

      <div className="md:hidden">
        <button onClick={toggle} className="p-2 -mr-2">
          <span className="material-symbols-outlined text-[var(--primary)] text-2xl">menu</span>
        </button>
      </div>
    </header>
  );
}