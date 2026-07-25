import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import Sidebar from '../components/dashboard/shared/Sidebar';
import TopAppBar from '../components/dashboard/shared/TopAppBar';

const LayoutContent = () => {
  const { isOpen } = useSidebar();
  
  return (
    <div 
      className={`flex-1 flex flex-col min-h-screen w-full transition-[margin] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[margin] pt-16 md:pt-[72px] ${
        isOpen ? 'md:mr-64' : 'md:mr-20'
      }`}
    >
      <TopAppBar />
      <main className="p-8 flex-1 bg-surface-container-low/30">
        <Outlet />
      </main>
      <footer className="px-8 py-6 border-t border-outline-variant/30 text-xs text-on-surface-variant flex justify-between">
        <p>© 2026 أكاديمية أيمن براهيم للعلوم الشرعية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div dir="rtl" className="min-h-screen bg-surface text-on-surface font-body flex">
        <Sidebar />
        <LayoutContent />
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;