import { Outlet } from 'react-router-dom';

// Import the shared components
import TopAppBar from '../components/dashboard/shared/TopAppBar';

// Import the student-specific components
import Sidebar from '../components/dashboard/student/Sidebar'; 
import MobileBottomNav from '../components/dashboard/student/MobileBottomNav';

export default function StudentLayout() {
  return (
    <div className="bg-[var(--surface)] font-body-md text-[var(--on-surface)] antialiased overflow-x-hidden min-h-screen flex" dir="rtl">
      
      {/* 1. The Fixed Desktop Sidebar */}
      <Sidebar />

      {/* 2. The Main Content Wrapper (Pushed left to make room for the 64-width sidebar) */}
      <div className="flex-1 flex flex-col md:mr-64 w-full">
        
        {/* The Search & Profile Header */}
        <TopAppBar />

        {/* 3. The Dynamic Page Canvas (Overview, Courses, Settings go inside here!) */}
        <main className="flex-1 p-margin-mobile md:p-margin-desktop arabesque-pattern">
          <Outlet />
        </main>
        
      </div>

      {/* 4. The Mobile Bottom Navigation (Only visible on small screens) */}
      <MobileBottomNav />
      
    </div>
  );
}