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

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[115] md:hidden transition-opacity duration-300"
          onClick={close}
        />
      )}

      {/* 
        Outer Container: Controls the width clipping mask.
        In RTL, shrinking the width pulls the left edge in, keeping the right edge stationary.
      */}
      <aside
        dir="rtl"
        className={`fixed right-0 md:right-4 top-[80px] h-[calc(100vh-96px)] z-[120] bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/20 rounded-l-3xl md:rounded-[32px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-[width,transform] duration-500 ease-[cubic-bezier(0.2,1,0.2,1)] overflow-hidden ${
          isOpen 
            ? 'w-[260px] translate-x-0' 
            : 'w-[260px] translate-x-[calc(100%+1rem)] md:translate-x-0 md:w-[84px]'
        }`}
      >
        {/* Fixed Inner Container: Never shrinks. Guarantees zero text-wrapping jitter. */}
        <div className="w-[260px] h-full flex flex-col py-6">
          
          {/* Toggle Button - Perfectly aligned to stay centered in closed state */}
          <div className="h-12 flex items-center pr-[22px] mb-6">
            <button
              onClick={toggle}
              className="w-10 h-10 rounded-full bg-[var(--surface-container-lowest)] shadow-sm border border-[var(--outline-variant)]/40 flex items-center justify-center text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] hover:bg-[var(--surface-container)] hover:scale-105 transition-all duration-300"
              title={isOpen ? 'طي القائمة' : 'توسيع القائمة'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isOpen ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center pr-[16px] mb-8 group cursor-pointer">
            <div className="relative shrink-0 w-[52px] h-[52px] rounded-full p-0.5 border-2 border-transparent group-hover:border-[var(--primary)]/50 transition-colors duration-300">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold flex items-center justify-center text-sm">
                  {user?.name ? user.name.trim().charAt(0) : (isAdmin ? 'م' : 'ط')}
                </div>
              )}
              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[var(--surface-container-lowest)] rounded-full" />
            </div>

            {/* Smooth Text Reveal */}
            <div className={`mr-3 flex flex-col justify-center transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}`}>
              <h3 className="font-bold text-sm text-[var(--on-surface)] truncate w-[160px] group-hover:text-[var(--primary)] transition-colors">
                {user?.name || (isAdmin ? 'المسؤول' : 'الطالب')}
              </h3>
              <p className="text-[11px] text-[var(--on-surface-variant)]/80 truncate w-[160px] font-sans">
                {user?.email || ''}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {links.map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                end={link.end} 
                onClick={() => window.innerWidth < 768 && close()}
                className="group flex items-center pr-[16px] relative"
                title={!isOpen ? link.label : ''}
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-[52px] h-[52px] rounded-[18px] flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive
                        ? 'bg-[var(--primary)] text-[var(--on-primary)] shadow-md shadow-[var(--primary)]/20'
                        : 'text-[var(--on-surface-variant)] group-hover:bg-[var(--surface-container)] group-hover:text-[var(--on-surface)]'
                    }`}>
                      <span className="material-symbols-outlined text-[24px]">
                        {link.icon}
                      </span>
                      
                      {link.to === '/dashboard/admin/orders/pending' && pendingOrders.length > 0 && (
                        <span className={`absolute top-0 right-1 bg-[var(--error)] text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border-2 border-[var(--surface-container-lowest)]`}>
                          {pendingOrders.length}
                        </span>
                      )}
                    </div>
                    
                    <span className={`mr-4 font-bold text-[13px] transition-all duration-300 ease-in-out ${
                      isActive ? 'text-[var(--on-surface)]' : 'text-[var(--on-surface-variant)] group-hover:text-[var(--on-surface)]'
                    } ${isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}`}>
                      {link.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}

            {/* Admin Add Course Button */}
            {isAdmin && (
              <div className="mt-2">
                <NavLink
                  to="/dashboard/admin/courses/add"
                  onClick={() => window.innerWidth < 768 && close()}
                  className="group flex items-center pr-[16px] relative"
                  title={!isOpen ? 'إضافة درس جديد' : ''}
                >
                  <div className="w-[52px] h-[52px] rounded-[18px] flex items-center justify-center shrink-0 transition-all duration-300 bg-[var(--primary-container)] text-[var(--on-primary-container)] group-hover:bg-[var(--primary)] group-hover:text-[var(--on-primary)] shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">add</span>
                  </div>
                  <span className={`mr-4 font-bold text-[13px] transition-opacity duration-300 ease-in-out text-[var(--primary)] ${isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}`}>
                    إضافة درس
                  </span>
                </NavLink>
              </div>
            )}
          </nav>

          {/* Sidebar Footer (Support & Logout) */}
          <div className="mt-auto pt-4 flex flex-col gap-2">
            
            {/* Subtle Divider */}
            <div className="w-[52px] h-[1px] bg-[var(--outline-variant)]/20 mr-[16px] mb-2" />
            
            {/* Support Area */}
            <div className="relative flex items-center pr-[16px] h-[52px]">
              
              {/* Full Support Component */}
              <div className={`absolute right-[16px] w-[228px] transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 z-20 delay-100' : 'opacity-0 pointer-events-none'}`}>
                 <SupportButton userName={user?.name} userEmail={user?.email} />
              </div>

              {/* Collapsed Support Icon */}
              <button
                className={`absolute right-[16px] w-[52px] h-[52px] rounded-[18px] flex items-center justify-center text-[var(--on-surface-variant)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)] transition-all duration-300 ${!isOpen ? 'opacity-100 z-20 delay-100' : 'opacity-0 pointer-events-none'}`}
                title="الدعم الفني"
              >
                <span className="material-symbols-outlined text-[24px]">help_outline</span>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="group flex items-center pr-[16px] relative text-red-600 dark:text-red-400"
              title={!isOpen ? "تسجيل الخروج" : ""}
            >
              <div className="w-[52px] h-[52px] rounded-[18px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-red-500/10 group-hover:text-red-600 dark:group-hover:text-red-300">
                <span className="material-symbols-outlined text-[24px]">
                  logout
                </span>
              </div>
              <span className={`mr-4 font-bold text-[13px] transition-all duration-300 ease-in-out group-hover:text-red-700 dark:group-hover:text-red-300 ${isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}`}>
                تسجيل الخروج
              </span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}