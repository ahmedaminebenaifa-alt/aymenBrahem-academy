import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  // Active state utility matching the "Serene Scholarship" design container guidelines
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-lg font-medium text-sm transition-all duration-200 group relative ${
      isActive
        ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] font-semibold border-r-4 border-[var(--primary)]'
        : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]'
    }`;

  return (
    <aside 
      className="fixed right-0 top-0 h-screen w-64 z-50 bg-[var(--surface-container-low)] border-l border-[var(--outline-variant)]/30 hidden md:flex flex-col py-8 shadow-sm transition-all duration-300"
      dir="rtl"
    >
      {/* --- Academy Logo/Brand Header --- */}
      <div className="px-6 pb-6 border-b border-[var(--outline-variant)]/20 mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded bg-[var(--primary)] flex items-center justify-center text-[var(--surface)] shadow-inner">
          <span className="material-symbols-outlined text-xl">school</span>
        </div>
        <div>
          <h2 className="font-display font-bold text-base text-[var(--primary)] leading-tight">الأكاديمية الإسلامية</h2>
          <span className="text-[10px] tracking-wider text-[var(--outline)] uppercase font-semibold">Student Portal</span>
        </div>
      </div>

      {/* --- Student User Profile Card --- */}
      <div className="px-4 mb-8">
        <div className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[var(--primary-container)] border border-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg shadow-sm">
            {user?.name ? user.name.trim().charAt(0) : 'ط'}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-display font-bold text-sm text-[var(--on-surface)] truncate">
              {user?.name || 'أيمن إبراهيم'}
            </h3>
            <p className="text-xs text-[var(--outline)] mt-0.5 truncate">
              {user?.email || 'student@academy.com'}
            </p>
          </div>
        </div>
      </div>

      {/* --- Core Navigation Links --- */}
      <nav className="flex-1 px-3 space-y-1.5">
        <NavLink to="/dashboard/student" end className={navLinkClass}>
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
            dashboard
          </span>
          <span>الرئيسية</span>
        </NavLink>

        <NavLink to="/dashboard/student/courses" className={navLinkClass}>
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
            menu_book
          </span>
          <span>دوراتي</span>
        </NavLink>

        <NavLink to="/dashboard/student/settings" className={navLinkClass}>
          <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
            settings
          </span>
          <span>الإعدادات</span>
        </NavLink>
      </nav>

      {/* --- Secondary/Footer Section --- */}
      <div className="px-4 mt-auto space-y-3 pt-4 border-t border-[var(--outline-variant)]/20">
        <button className="w-full py-2.5 px-4 bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] text-xs font-bold rounded-lg hover:bg-[var(--outline-variant)]/40 transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-base">help</span>
          طلب مساعدة الدعم
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50/60 rounded-lg text-sm font-bold transition-colors group"
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">
            logout
          </span>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}