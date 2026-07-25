import React from 'react';
import LiveWidget from '../../../components/live/LiveWidget'; 
import { useSidebar } from '../../../context/SidebarContext'; 

const LiveManager = () => {
  const { isOpen } = useSidebar();

  return (
    <div className={`p-4 md:py-8 md:pl-8 transition-[padding] duration-500 ease-[cubic-bezier(0.2,1,0.2,1)] ${
      isOpen ? 'md:pr-[300px]' : 'md:pr-[120px]'
    }`}>
      {/* Dynamic right padding added to the parent div above to prevent sidebar overlap */}
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-primary tracking-tight">إدارة البث المباشر</h1>
        <p className="text-on-surface-variant text-base">
          من هنا يمكنك بدء بث مباشر جديد ومشاركة شاشتك مع جميع الطلاب المسجلين.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* The Smart Widget */}
        <div className="w-full">
          <LiveWidget />
        </div>

        {/* Refined Instructions Section */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
          
          {/* Card Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/30 bg-surface-container-lowest/50">
            <span className="material-symbols-outlined text-primary text-xl">tips_and_updates</span>
            <h3 className="font-display font-bold text-lg text-on-surface">تعليمات البث المباشر</h3>
          </div>
          
          {/* Card Body */}
          <div className="p-6 md:p-8 bg-surface-container-lowest/30">
            <ul className="space-y-4">
              {[
                'عند بدء البث، سيتم نقلك إلى شاشة العرض الكاملة.',
                'سيظهر زر "الانضمام" للطلاب تلقائياً في لوحة التحكم الخاصة بهم.',
                'يمكنك مشاركة شاشتك بالضغط على الزر المخصص أسفل الشاشة.',
                'الميكروفونات الخاصة بالطلاب مغلقة افتراضياً لمنع الإزعاج.'
              ].map((text, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-low/40 transition-colors duration-200"
                >
                  <span className="material-symbols-outlined text-tertiary text-xl shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span className="text-on-surface-variant text-sm md:text-base leading-relaxed font-medium">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LiveManager;