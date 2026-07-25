import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import TopAppBar from '../components/dashboard/shared/TopAppBar';
import Sidebar from '../components/dashboard/shared/Sidebar';

const LayoutContent = () => {
  const { isOpen } = useSidebar();
  
  return (
    <div 
      className={`flex-1 flex flex-col min-h-screen w-full transition-[margin] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[margin] pt-16 md:pt-[72px] ${
        isOpen ? 'md:mr-64' : 'md:mr-20'
      }`}
    >
      <TopAppBar />
      <main className="flex-1 p-margin-mobile md:p-margin-desktop arabesque-pattern">
        <Outlet />
      </main>
    </div>
  );
};

export default function StudentLayout() {
  return (
    <SidebarProvider>
      <div className="bg-[var(--surface)] font-body-md text-[var(--on-surface)] antialiased min-h-screen flex" dir="rtl">
        <Sidebar />
        <LayoutContent />
      </div>
    </SidebarProvider>
  );
}