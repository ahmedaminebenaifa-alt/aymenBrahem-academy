import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSidebar } from '../../../context/SidebarContext';
import { usePendingOrders } from '../../../hooks/usePendingOrders';
import SupportButton from '../student/SupportButton';

const STUDENT_LINKS = [
  { to: '/dashboard/student', end: true, icon: 'dashboard', label: 'الرئيسية' },
  { to: '/dashboard/student/courses', icon: 'menu_book', label: 'دوراتي' },
  { to: '/dashboard/student/settings', icon: 'settings', label: 'الإعدادات' },
];

const ADMIN_LINKS = [
  { to: '/dashboard/admin', end: true, icon: 'dashboard', label: 'نظرة عامة' },
  { to: '/dashboard/admin/live-management', icon: 'live_tv', label: 'الجلسات المباشرة' },
  { to: '/dashboard/admin/courses', end: true, icon: 'library_books', label: 'إدارة الدروس' },
  { to: '/dashboard/admin/orders/pending', icon: 'receipt_long', label: 'طلبات الشراء' },
  { to: '/dashboard/admin/users', icon: 'group', label: 'إدارة المستخدمين' },
  { to: '/dashboard/admin/settings', icon: 'settings', label: 'الإعدادات' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const isAdmin = user?.role === 'ADMIN';
  const links = isAdmin ? ADMIN_LINKS : STUDENT_LINKS;
  
  const { orders: pendingOrders } = isAdmin ? usePendingOrders() : { orders: [] };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] group relative ${
      isActive
        ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] font-semibold border-r-4 border-[var(--primary)] shadow-sm'
        : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]'
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[90] md:hidden transition-opacity duration-300"
          onClick={close}
        />
      )}

      <aside
        dir="rtl"
        className={`fixed right-0 top-0 h-screen w-64 z-[100] bg-[var(--surface-container-low)] border-l border-[var(--outline-variant)]/30 flex flex-col py-6 shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* --- Header --- */}
        <div className="px-6 pb-6 border-b border-[var(--outline-variant)]/20 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 flex items-center justify-center text-[var(--surface)] shadow-md shadow-[var(--primary)]/20">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[var(--on-surface)] leading-tight">أكاديمية أيمن ابراهيم</h2>
              <span className="text-[10px] tracking-wider text-[var(--primary)] uppercase font-extrabold block mt-0.5">
                {isAdmin ? 'Admin Portal' : 'Student Portal'}
              </span>
            </div>
          </div>
          <button onClick={close} className="md:hidden p-1.5 rounded-full hover:bg-[var(--surface-container-high)] text-[var(--on-surface-variant)] transition-colors">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* --- Professional Profile Card --- */}
        <div className="px-4 mb-6">
          <div className="relative overflow-hidden bg-gradient-to-b from-[var(--surface-container-lowest)] to-[var(--surface-container-low)] border border-[var(--outline-variant)]/30 p-3.5 rounded-2xl flex items-center gap-3.5 shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group">
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/5 rounded-full blur-xl pointer-events-none -mr-6 -mt-6 group-hover:bg-[var(--primary)]/10 transition-colors duration-500" />

            <div className="relative shrink-0">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-11 h-11 rounded-xl object-cover border border-[var(--outline-variant)]/30 shadow-xs group-hover:scale-105 transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)]/15 to-[var(--primary)]/5 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] font-bold text-base shadow-xs group-hover:scale-105 transition-transform duration-[400ms]">
                  {user?.name ? user.name.trim().charAt(0) : (isAdmin ? 'م' : 'ط')}
                </div>
              )}
              <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-emerald-500 border-2 border-[var(--surface-container-lowest)] rounded-full shadow-xs" />
            </div>

            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="font-bold text-xs text-[var(--on-surface)] truncate group-hover:text-[var(--primary)] transition-colors duration-300">
                  {user?.name || (isAdmin ? 'المسؤول' : 'الطالب')}
                </h3>
              </div>
              
              <p className="text-[11px] text-[var(--on-surface-variant)]/70 truncate font-sans mb-1.5">
                {user?.email || 'لا يوجد بريد إلكتروني'}
              </p>

              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[10px] font-bold text-[var(--primary)]">
                <span className="material-symbols-outlined text-[12px]">
                  {isAdmin ? 'verified_user' : 'school'}
                </span>
                <span>{isAdmin ? 'مدير النظام' : 'طالب علم'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* --- Nav links --- */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto scrollbar-hide">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass} onClick={close}>
              <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:scale-110">
                {link.icon}
              </span>
              <span className="flex-1">{link.label}</span>
              {link.to === '/dashboard/admin/orders/pending' && pendingOrders.length > 0 && (
                <span className="bg-error text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                  {pendingOrders.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* --- Admin primary action --- */}
        {isAdmin && (
          <div className="px-4 mt-6 mb-4">
            <NavLink
              to="/dashboard/admin/courses/add"
              onClick={close}
              className={({ isActive }) => `
                w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 shadow-md shadow-primary/10
                ${isActive
                  ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-[var(--primary)]/20'
                  : 'bg-[var(--primary)] text-[var(--surface)] hover:opacity-95 hover:shadow-lg'
                }
              `}
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>إضافة درس جديد</span>
            </NavLink>
          </div>
        )}

        {/* --- Footer --- */}
        <div className="px-4 mt-auto space-y-2 pt-4 border-t border-[var(--outline-variant)]/20">
          <SupportButton userName={user?.name} userEmail={user?.email} />

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-red-600 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all duration-200 group"
          >
            <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:-translate-x-1">
              logout
            </span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}