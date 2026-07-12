import React, { useState, useEffect } from 'react';

// Import all your custom dashboard widgets
import LiveControlCenter from '../../../components/dashboard/admin/home/liveControlCenter';
import RecentCoursesList from '../../../components/dashboard/admin/home/recentCoursesList';
import UpcomingSessions from '../../../components/dashboard/admin/home/upcomingSessions';
import RecentActivity from '../../../components/dashboard/admin/home/recentActivity';

const AdminHome = () => {
  // Real-time clock logic for Mecca time
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };
    const timer = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Welcome Message & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Stat Card: Total Students */}
        <div className="md:col-span-1 bg-white/70 backdrop-blur-md p-6 rounded-xl border border-outline-variant/30 shadow-sm border-t-2 border-t-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm text-on-surface-variant">إجمالي الطلاب</p>
              <h3 className="font-arabic text-3xl font-bold mt-2 text-on-surface">1,284</h3>
            </div>
            <div className="bg-primary-container/20 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-700 font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12% عن الشهر الماضي</span>
          </div>
        </div>

        {/* Stat Card: Active Courses */}
        <div className="md:col-span-1 bg-white/70 backdrop-blur-md p-6 rounded-xl border border-outline-variant/30 shadow-sm border-t-2 border-t-tertiary">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm text-on-surface-variant">الدورات النشطة</p>
              <h3 className="font-arabic text-3xl font-bold mt-2 text-on-surface">24</h3>
            </div>
            <div className="bg-tertiary/10 p-2 rounded-lg text-tertiary">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            <span>4 دورات قيد التحضير</span>
          </div>
        </div>

        {/* Stat Card: Monthly Revenue / Goals */}
        <div className="md:col-span-1 bg-white/70 backdrop-blur-md p-6 rounded-xl border border-outline-variant/30 shadow-sm border-t-2 border-t-secondary">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-sm text-on-surface-variant">الالتحاقات الجديدة</p>
              <h3 className="font-arabic text-3xl font-bold mt-2 text-on-surface">156</h3>
            </div>
            <div className="bg-secondary-container p-2 rounded-lg text-secondary">
              <span className="material-symbols-outlined">how_to_reg</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            <span>هذا الأسبوع</span>
          </div>
        </div>

        {/* Live Clock Card */}
        <div className="md:col-span-1 bg-primary text-on-primary p-6 rounded-xl shadow-sm border-t-2 border-t-primary flex items-center justify-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-2xl top-0 left-0"></div>
          
          <div className="text-center relative z-10">
            <p className="font-semibold text-sm opacity-80">ساعة الحائط</p>
            <h2 className="text-3xl font-bold tracking-widest mt-1 font-mono text-white" dir="ltr">
              {time}
            </h2>
            <p className="text-xs mt-1 text-on-primary-container">توقيت تونس</p>
          </div>
        </div>

      </div>

      {/* 2. Main Interactive Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Main Focus Area) */}
        <div className="lg:col-span-8 space-y-6">
          <LiveControlCenter />
          <RecentCoursesList />
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="lg:col-span-4 space-y-6">
          <UpcomingSessions />
          <RecentActivity />

          {/* Quick Admin Tools */}
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
            
            {/* Decorative bottom corner glow */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;