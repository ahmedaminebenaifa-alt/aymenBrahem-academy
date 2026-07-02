import { NavLink } from 'react-router-dom';

export default function MobileBottomNav() {
  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 ${
      isActive ? 'text-[var(--primary)]' : 'text-[var(--secondary)] hover:text-[var(--primary)]'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--surface-container-lowest)] border-t border-[var(--outline-variant)]/30 px-6 py-3 flex justify-between items-center z-50">
      
      <NavLink to="/dashboard/student" end className={navLinkClass}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
        <span className="text-[10px] font-bold">الرئيسية</span>
      </NavLink>
      
      <NavLink to="/dashboard/student/courses" className={navLinkClass}>
        <span className="material-symbols-outlined">menu_book</span>
        <span className="text-[10px] font-bold">دوراتي</span>
      </NavLink>
      
      <NavLink to="/dashboard/student/settings" className={navLinkClass}>
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[10px] font-bold">الإعدادات</span>
      </NavLink>

    </div>
  );
}