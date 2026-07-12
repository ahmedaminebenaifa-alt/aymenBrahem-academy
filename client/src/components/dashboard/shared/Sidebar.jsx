import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSidebar } from '../../../context/SidebarContext';

const STUDENT_LINKS = [
  { to: '/dashboard/student', end: true, icon: 'dashboard', label: 'الرئيسية' },
  { to: '/dashboard/student/courses', icon: 'menu_book', label: 'دوراتي' },
  { to: '/dashboard/student/settings', icon: 'settings', label: 'الإعدادات' },
];

const ADMIN_LINKS = [
  { to: '/dashboard/admin', end: true, icon: 'dashboard', label: 'نظرة عامة' },
  { to: '/dashboard/admin/live-management', icon: 'live_tv', label: 'الجلسات المباشرة' },
  { to: '/dashboard/admin/courses', end: true, icon: 'library_books', label: 'إدارة الدروس' },
  { to: '/dashboard/admin/users', icon: 'group', label: 'إدارة المستخدمين' },
  { to: '/dashboard/admin/settings', icon: 'settings', label: 'الإعدادات' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const isAdmin = user?.role === 'ADMIN';
  const links = isAdmin ? ADMIN_LINKS : STUDENT_LINKS;

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-lg font-medium text-sm transition-all duration-200 group relative ${
      isActive
        ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] font-semibold border-r-4 border-[var(--primary)]'
        : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]'
    }`;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[90] md:hidden" onClick={close} />
      )}

      <aside
        dir="rtl"
        className={`fixed right-0 top-0 h-screen w-64 z-[100] bg-[var(--surface-container-low)] border-l border-[var(--outline-variant)]/30 flex flex-col py-10 shadow-xl md:shadow-sm transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* --- Header --- */}
        <div className="px-6 pb-8 border-b border-[var(--outline-variant)]/20 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[var(--primary)] flex items-center justify-center text-[var(--surface)] shadow-inner">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[var(--primary)] leading-tight">أكاديمية أيمن ابراهيم</h2>
              <span className="text-[10px] tracking-wider text-[var(--outline)] uppercase font-semibold">
                {isAdmin ? 'Admin Portal' : 'Student Portal'}
              </span>
            </div>
          </div>
          <button onClick={close} className="md:hidden p-1 text-[var(--on-surface-variant)]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* --- Profile card --- */}
        <div className="px-5 mb-10">
          <div className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 p-4 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[var(--primary-container)] border border-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold text-lg shadow-sm">
              {user?.name ? user.name.trim().charAt(0) : (isAdmin ? 'م' : 'ط')}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-display font-bold text-sm text-[var(--on-surface)] truncate">
                {user?.name || (isAdmin ? 'المسؤول' : 'الطالب')}
              </h3>
              <p className="text-xs text-[var(--outline)] mt-0.5 truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>

        {/* --- Nav links --- */}
        <nav className="flex-1 px-4 space-y-2.5 overflow-y-auto scrollbar-hide">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass} onClick={close}>
              <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">
                {link.icon}
              </span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* --- Admin primary action --- */}
        {isAdmin && (
          <div className="px-5 mt-8 mb-6">
            <NavLink
              to="/dashboard/admin/courses/add"
              onClick={close}
              className={({ isActive }) => `
                w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg font-bold text-sm transition-all shadow-md shadow-primary/10
                ${isActive
                  ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-[var(--primary)]/20'
                  : 'bg-[var(--primary)] text-[var(--surface)] hover:opacity-90'
                }
              `}
            >
              <span className="material-symbols-outlined">add</span>
              <span>إضافة درس جديد</span>
            </NavLink>
          </div>
        )}

        {/* --- Footer --- */}
        <div className="px-5 mt-auto space-y-3.5 pt-6 border-t border-[var(--outline-variant)]/20">
          <button className="w-full py-3 px-4 bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] text-xs font-bold rounded-lg hover:bg-[var(--outline-variant)]/40 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">help</span>
            طلب مساعدة الدعم
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-red-600 hover:bg-red-50/60 rounded-lg text-sm font-bold transition-colors group"
          >
            <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">
              logout
            </span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}