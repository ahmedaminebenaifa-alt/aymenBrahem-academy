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
    `flex items-center gap-3 px-3 py-3.5 mx-2 rounded-xl font-medium text-sm transition-all duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] group relative whitespace-nowrap ${
      isActive
        ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] font-semibold border-r-4 border-[var(--primary)] shadow-sm'
        : 'text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)]'
    }`;

  return (
    <>
      {/* Mobile backdrop - only visible on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[90] md:hidden transition-opacity duration-300"
          onClick={close}
        />
      )}

      <aside
        dir="rtl"
        // Key Changes here: top-[72px] to sit under header, and width transitions based on isOpen
        className={`fixed right-0 top-[72px] h-[calc(100vh-72px)] z-[100] bg-[var(--surface-container-low)] border-l border-[var(--outline-variant)]/30 flex flex-col py-6 shadow-2xl transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] 
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 translate-x-full md:translate-x-0 md:w-20'} 
        `}
      >

        {/* --- Professional Profile Card (Shrinkable) --- */}
        <div className="px-4 mb-6">
          <div className={`relative overflow-hidden bg-gradient-to-b from-[var(--surface-container-lowest)] to-[var(--surface-container-low)] border border-[var(--outline-variant)]/30 p-3 rounded-2xl flex items-center gap-3.5 shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group ${!isOpen ? 'md:justify-center md:px-2' : ''}`}>
            
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

            {/* Fades out when collapsed */}
            <div className={`overflow-hidden flex flex-col justify-center transition-all duration-300 ${isOpen ? 'w-auto opacity-100 flex-1' : 'md:w-0 md:opacity-0 md:hidden flex-1'}`}>
              <div className="flex items-center gap-1.5 mb-0.5 whitespace-nowrap">
                <h3 className="font-bold text-xs text-[var(--on-surface)] truncate group-hover:text-[var(--primary)] transition-colors duration-300">
                  {user?.name || (isAdmin ? 'المسؤول' : 'الطالب')}
                </h3>
              </div>
              
              <p className="text-[11px] text-[var(--on-surface-variant)]/70 truncate font-sans mb-1.5 whitespace-nowrap">
                {user?.email || 'لا يوجد بريد إلكتروني'}
              </p>
            </div>
          </div>
        </div>

        {/* --- Nav links --- */}
        <nav className="flex-1 space-y-1.5 overflow-x-hidden overflow-y-auto scrollbar-hide">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass} onClick={() => window.innerWidth < 768 && close()}>
              <span className={`material-symbols-outlined text-xl transition-transform duration-300 group-hover:scale-110 ${!isOpen ? 'md:mx-auto' : ''}`}>
                {link.icon}
              </span>
              {/* Fades out when collapsed */}
              <span className={`transition-all duration-300 ${isOpen ? 'opacity-100 flex-1' : 'md:opacity-0 md:w-0 md:hidden flex-1'}`}>
                {link.label}
              </span>
              
              {link.to === '/dashboard/admin/orders/pending' && pendingOrders.length > 0 && (
                <span className={`bg-error text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse transition-all duration-300 ${!isOpen ? 'md:absolute md:top-2 md:left-2' : ''}`}>
                  {pendingOrders.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* --- Admin primary action --- */}
        {isAdmin && (
          <div className="px-3 mt-6 mb-4">
            <NavLink
              to="/dashboard/admin/courses/add"
              onClick={() => window.innerWidth < 768 && close()}
              className={({ isActive }) => `
                w-full flex items-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 shadow-md shadow-primary/10 overflow-hidden whitespace-nowrap
                ${isActive
                  ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] border border-[var(--primary)]/20'
                  : 'bg-[var(--primary)] text-[var(--surface)] hover:opacity-95 hover:shadow-lg'
                } ${!isOpen ? 'md:justify-center' : ''}
              `}
            >
              <span className="material-symbols-outlined text-lg shrink-0">add</span>
              {/* Fades out when collapsed */}
              <span className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:hidden'}`}>
                إضافة درس جديد
              </span>
            </NavLink>
          </div>
        )}

        {/* --- Footer --- */}
        <div className="px-3 mt-auto space-y-2 pt-4 border-t border-[var(--outline-variant)]/20">
          <div className={`${!isOpen ? 'md:hidden' : ''}`}>
             <SupportButton userName={user?.name} userEmail={user?.email} />
          </div>

          <button
            onClick={logout}
            className={`w-full flex items-center gap-2 px-3 py-2.5 text-red-600 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all duration-200 group overflow-hidden whitespace-nowrap ${!isOpen ? 'md:justify-center' : ''}`}
            title={!isOpen ? "تسجيل الخروج" : ""}
          >
            <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:-translate-x-1 shrink-0">
              logout
            </span>
            <span className={`transition-all duration-300 ${isOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:hidden'}`}>
              تسجيل الخروج
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}