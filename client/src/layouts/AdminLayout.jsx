import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../context/SidebarContext';
import Sidebar from '../components/dashboard/shared/Sidebar';
import TopAppBar from '../components/dashboard/shared/TopAppBar';

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div dir="rtl" className="min-h-screen bg-surface text-on-surface font-body flex overflow-x-hidden">
        <Sidebar />
        <div className="flex-1 md:mr-64 flex flex-col min-h-screen w-full">
          <TopAppBar />
          <main className="p-8 flex-1 bg-surface-container-low/30">
            <Outlet />
          </main>
          <footer className="px-8 py-6 border-t border-outline-variant/30 text-xs text-on-surface-variant flex justify-between">
            <p>© 2026 أكاديمية أيمن براهيم للعلوم الشرعية. جميع الحقوق محفوظة.</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;