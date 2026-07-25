import React from 'react';
import AdminStatsOverview from '../../../components/dashboard/admin/home/AdminStatsOverview';
import LiveControlCenter from '../../../components/dashboard/admin/home/liveControlCenter';
import RecentCoursesList from '../../../components/dashboard/admin/home/recentCoursesList';
import UpcomingSessions from '../../../components/dashboard/admin/home/upcomingSessions';
import RecentActivity from '../../../components/dashboard/admin/home/recentActivity';

// IMPORT THE SIDEBAR HOOK
import { useSidebar } from '../../../context/SidebarContext'; 

const AdminHome = () => {
  // Fetch the sidebar state
  const { isOpen } = useSidebar(); 

  return (
    <div className={`space-y-6 animate-fade-in p-4 md:py-6 md:pl-8 transition-[padding] duration-500 ease-[cubic-bezier(0.2,1,0.2,1)] ${
      isOpen ? 'md:pr-[300px]' : 'md:pr-[120px]'
    }`}>
      
      <AdminStatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <LiveControlCenter />
          <RecentCoursesList />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <UpcomingSessions />
          <RecentActivity />

          <div className="bg-tertiary text-on-tertiary p-6 rounded-xl relative overflow-hidden shadow-md">
            <h3 className="font-bold mb-4 relative z-10 flex items-center gap-2">
              <span className="material-symbols-outlined">build</span>
              أدوات إدارية سريعة
            </h3>
            
            <div className="grid grid-cols-2 gap-3 relative z-10">
              {[
                { name: 'بريد الطلاب', icon: 'mail' },
                { name: 'تقارير الأداء', icon: 'description' },
                { name: 'نسخ احتياطي', icon: 'database' },
                { name: 'الصلاحيات', icon: 'security' }
              ].map((tool, i) => (
                <button 
                  key={i} 
                  className="bg-white/10 p-3 rounded-lg hover:bg-white/20 text-xs transition-all flex flex-col items-center gap-2 font-medium"
                >
                  <span className="material-symbols-outlined text-lg">{tool.icon}</span>
                  {tool.name}
                </button>
              ))}
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;