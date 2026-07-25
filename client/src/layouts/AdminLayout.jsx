import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../context/SidebarContext';
import Sidebar from '../components/dashboard/shared/Sidebar';
import TopAppBar from '../components/dashboard/shared/TopAppBar';

const LayoutContent = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen w-full pt-16 md:pt-[72px]">
      <TopAppBar />
      <main className="p-8 flex-1 bg-surface-container-low/30">
        <Outlet />
      </main>
      <footer className="px-8 py-6 border-t border-outline-variant/30 text-xs text-on-surface-variant flex justify-between">
        <p>© 2026 أكاديمية أيمن إبراهيم للعلوم الشرعية. جميع الحقوق محفوظة.</p>
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