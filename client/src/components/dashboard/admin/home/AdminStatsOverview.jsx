import React, { useState, useEffect } from 'react';
import { useAdminStats } from '../../../../hooks/useAdminStats';

const AdminStatsOverview = () => {
  const [time, setTime] = useState('');
  const { stats, isLoading } = useAdminStats();

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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 bg-white/70 backdrop-blur-md p-6 rounded-xl border border-outline-variant/30 shadow-sm border-t-2 border-t-primary transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-sm text-on-surface-variant">إجمالي الطلاب</p>
            {isLoading ? (
              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded mt-2"></div>
            ) : (
              <h3 className="font-arabic text-3xl font-bold mt-2 text-on-surface">
                {stats.totalStudents.toLocaleString()}
              </h3>
            )}
          </div>
          <div className="bg-primary-container/20 p-2 rounded-lg text-primary">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold">
          {isLoading ? (
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <>
              <span className={`material-symbols-outlined text-sm ${stats.studentsTrend >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {stats.studentsTrend >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              <span className={stats.studentsTrend >= 0 ? 'text-green-700' : 'text-red-600'}>
                {stats.studentsTrend >= 0 ? '+' : ''}{stats.studentsTrend}% عن الشهر الماضي
              </span>
            </>
          )}
        </div>
      </div>

      <div className="md:col-span-1 bg-white/70 backdrop-blur-md p-6 rounded-xl border border-outline-variant/30 shadow-sm border-t-2 border-t-tertiary transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-sm text-on-surface-variant">الدورات النشطة</p>
            {isLoading ? (
              <div className="h-9 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
            ) : (
              <h3 className="font-arabic text-3xl font-bold mt-2 text-on-surface">
                {stats.activeCourses}
              </h3>
            )}
          </div>
          <div className="bg-tertiary/10 p-2 rounded-lg text-tertiary">
            <span className="material-symbols-outlined">menu_book</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
          {isLoading ? (
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <span>{stats.coursesInPrep} دورات قيد التحضير</span>
          )}
        </div>
      </div>

      <div className="md:col-span-1 bg-white/70 backdrop-blur-md p-6 rounded-xl border border-outline-variant/30 shadow-sm border-t-2 border-t-secondary transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-sm text-on-surface-variant">الالتحاقات الجديدة</p>
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
            ) : (
              <h3 className="font-arabic text-3xl font-bold mt-2 text-on-surface">
                {stats.newEnrollments}
              </h3>
            )}
          </div>
          <div className="bg-secondary-container/50 p-2 rounded-lg text-secondary">
            <span className="material-symbols-outlined">how_to_reg</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
          <span>هذا الأسبوع</span>
        </div>
      </div>

      <div className="md:col-span-1 bg-primary text-on-primary p-6 rounded-xl shadow-sm border-t-2 border-t-primary flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-32 h-32 bg-white/10 rounded-full blur-2xl top-0 left-0 pointer-events-none"></div>
        
        <div className="text-center relative z-10">
          <p className="font-semibold text-sm opacity-80">ساعة الحائط</p>
          <h2 className="text-3xl font-bold tracking-widest mt-1 font-mono text-white" dir="ltr">
            {time}
          </h2>
          <p className="text-xs mt-1 text-on-primary-container">توقيت تونس</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsOverview;