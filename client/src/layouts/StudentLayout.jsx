import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../context/SidebarContext';
import TopAppBar from '../components/dashboard/shared/TopAppBar';
import Sidebar from '../components/dashboard/shared/Sidebar';

export default function StudentLayout() {
  return (
    <SidebarProvider>
      <div className="bg-[var(--surface)] font-body-md text-[var(--on-surface)] antialiased overflow-x-hidden min-h-screen flex" dir="rtl">
        <Sidebar />
        <div className="flex-1 flex flex-col md:mr-64 w-full">
          <TopAppBar />
          <main className="flex-1 p-margin-mobile md:p-margin-desktop arabesque-pattern">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}