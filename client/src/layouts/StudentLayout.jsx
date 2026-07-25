import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../context/SidebarContext';
import TopAppBar from '../components/dashboard/shared/TopAppBar';
import Sidebar from '../components/dashboard/shared/Sidebar';

const LayoutContent = () => {
  return (
    <div className="flex-1 flex flex-col min-h-screen w-full pt-16 md:pt-[72px]">
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