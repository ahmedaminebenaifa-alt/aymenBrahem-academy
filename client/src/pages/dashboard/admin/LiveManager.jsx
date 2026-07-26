import React from 'react';
import LiveWidget from '../../../components/live/LiveWidget'; 
import { useSidebar } from '../../../context/SidebarContext'; 
import SchedulePlanner from '../../../components/dashboard/admin/live/SchedulePlanner'; 
import AdminScheduleTable from '../../../components/dashboard/admin/live/AdminScheduleTable'; 

const LiveManager = () => {
  const { isOpen } = useSidebar();

  return (
    <div className={`p-4 md:py-8 md:pl-8 transition-[padding] duration-500 ease-[cubic-bezier(0.2,1,0.2,1)] ${
      isOpen ? 'md:pr-[300px]' : 'md:pr-[120px]'
    }`}>
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-primary tracking-tight">إدارة البث المباشر</h1>
        <p className="text-on-surface-variant text-base">
          من هنا يمكنك بدء بث مباشر فوري، أو جدولة الحصص القادمة للطلاب.
        </p>
      </div>

      {/* Main Layout Container - overflow-hidden prevents horizontal bleed */}
      <div className="flex flex-col gap-8 w-full max-w-full overflow-hidden">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8 w-full flex flex-col gap-6 lg:gap-8">
            <LiveWidget />
          </div>

          <div className="lg:col-span-5 xl:col-span-4 w-full flex flex-col gap-6 lg:gap-8">
            <SchedulePlanner />
            
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/30 bg-surface-container-lowest">
                <span className="material-symbols-outlined text-primary text-xl">tips_and_updates</span>
                <h3 className="font-display font-bold text-lg text-on-surface">تعليمات البث المباشر</h3>
              </div>
              <div className="p-6 bg-surface-container-low/50">
                <ul className="space-y-4">
                  {[
                    'عند بدء البث المباشر الآن، سيتم إشعار الطلاب المسجلين فوراً.',
                    'الجلسات المجدولة تظهر في جدول الطالب الخاص بالدورات.',
                    'يمكنك مشاركة شاشتك أو استخدام السبورة أثناء البث.',
                    'الميكروفونات الخاصة بالطلاب مغلقة افتراضياً لمنع الإزعاج.'
                  ].map((text, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors duration-200">
                      <span className="material-symbols-outlined text-tertiary text-xl shrink-0 mt-0.5">check_circle</span>
                      <span className="text-on-surface-variant text-sm leading-relaxed font-medium">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Table Container */}
        <div className="w-full relative z-0">
           <AdminScheduleTable />
        </div>

      </div>
    </div>
  );
};

export default LiveManager;