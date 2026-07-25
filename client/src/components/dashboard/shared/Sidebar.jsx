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
  const { isOpen, close, toggle } = useSidebar();
  const isAdmin = user?.role === 'ADMIN';
  const links = isAdmin ? ADMIN_LINKS : STUDENT_LINKS;
  
  const { orders: pendingOrders } = isAdmin ? usePendingOrders() : { orders: [] };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-300 group relative whitespace-nowrap ${
      isActive
        ? 'bg-[var(--primary)] text-[var(--surface)] font-bold shadow-md shadow-[var(--primary)]/20'
        : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container-high)] hover:text-[var(--on-surface)]'
    } ${!isOpen ? 'md:justify-center md:px-0' : ''}`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[90] md:hidden transition-opacity duration-300"
          onClick={close}
        />
      )}

      {/* Floating Pill Sidebar Container (Taki Academy Style) */}
      <aside
        dir="rtl"
        className={`fixed right-3 md:right-4 top-[80px] h-[calc(100vh-96px)] z-[100] bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/30 rounded-3xl flex flex-col py-4 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'w-64 translate-x-0' 
            : 'w-64 translate-x-[calc(100%+1rem)] md:translate-x-0 md:w-20'
        }`}
      >
        {/* Toggle Arrow Pill Top Action */}
        <div className="px-3 mb-4 hidden md:flex items-center justify-end">
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-full bg-[var(--surface-container-low)] text-[var(--on-surface-variant)] hover:text-[var(--primary)] flex items-center justify-center transition-transform hover:scale-105"
            title={isOpen ? 'طي القائمة' : 'توسيع القائمة'}
          >
            <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}>
              chevron_right
            </span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="px-3 mb-4">
          <div className={`relative overflow-hidden bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/20 p-2.5 rounded-2xl flex items-center gap-3 transition-all duration-300 ${!isOpen ? 'md:justify-center md:p-2' : ''}`}>
            <div className="relative shrink-0">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold flex items-center justify-center text-sm">
                  {user?.name ? user.name.trim().charAt(0) : (isAdmin ? 'م' : 'ط')}
                </div>
              )}
              <span className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--surface)] rounded-full" />
            </div>

            {isOpen && (
              <div className="overflow-hidden flex flex-col justify-center flex-1">
                <h3 className="font-bold text-xs text-[var(--on-surface)] truncate">
                  {user?.name || (isAdmin ? 'المسؤول' : 'الطالب')}
                </h3>
                <p className="text-[10px] text-[var(--on-surface-variant)]/70 truncate font-sans">
                  {user?.email || ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-2 overflow-x-hidden overflow-y-auto scrollbar-hide">
          {links.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              end={link.end} 
              className={navLinkClass} 
              onClick={() => window.innerWidth < 768 && close()}
              title={!isOpen ? link.label : ''}
            >
              <span className="material-symbols-outlined text-xl shrink-0">
                {link.icon}
              </span>
              
              {isOpen && (
                <span className="truncate flex-1">
                  {link.label}
                </span>
              )}
              
              {link.to === '/dashboard/admin/orders/pending' && pendingOrders.length > 0 && (
                <span className={`bg-error text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ${!isOpen ? 'absolute top-1 left-1' : ''}`}>
                  {pendingOrders.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Admin Action Button */}
        {isAdmin && (
          <div className="px-2 my-2">
            <NavLink
              to="/dashboard/admin/courses/add"
              onClick={() => window.innerWidth < 768 && close()}
              className={`w-full flex items-center gap-2 py-3 px-3 rounded-2xl font-bold text-sm bg-[var(--primary-container)] text-[var(--on-primary-container)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-xs ${!isOpen ? 'md:justify-center' : ''}`}
              title={!isOpen ? 'إضافة درس جديد' : ''}
            >
              <span className="material-symbols-outlined text-lg shrink-0">add</span>
              {isOpen && <span className="truncate">إضافة درس جديد</span>}
            </NavLink>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="px-2 mt-auto space-y-1 pt-3 border-t border-[var(--outline-variant)]/20">
          {isOpen && (
            <div className="mb-2">
              <SupportButton userName={user?.name} userEmail={user?.email} />
            </div>
          )}

          <button
            onClick={logout}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-red-600 hover:bg-red-500/10 rounded-2xl text-xs font-bold transition-all ${!isOpen ? 'md:justify-center' : ''}`}
            title={!isOpen ? "تسجيل الخروج" : ""}
          >
            <span className="material-symbols-outlined text-lg shrink-0">
              logout
            </span>
            {isOpen && <span className="truncate">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>
    </>
  );
}