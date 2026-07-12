import React from 'react';

const UserStatsGrid = ({ stats = {}, isLoading }) => {
  // إعدادات البطاقات وتخصيص الألوان والأيقونات لكل إحصائية
  const cardItems = [
    { 
      id: 'total', 
      label: 'إجمالي المستخدمين', 
      value: stats.total || 0, 
      icon: 'group', 
      borderColor: 'border-t-2 border-primary', 
      iconStyles: 'bg-primary/5 text-primary border-primary/10' 
    },
    { 
      id: 'activeStudents', 
      label: 'الطلاب النشطين', 
      value: stats.activeStudents || 0, 
      icon: 'school', 
      borderColor: 'border-t-2 border-surface-tint', 
      iconStyles: 'bg-surface-tint/10 text-surface-tint border-surface-tint/20' 
    },
    { 
      id: 'staff', 
      label: 'الطاقم الإداري', 
      value: stats.staff || 0, 
      icon: 'admin_panel_settings', 
      borderColor: 'border-t-2 border-outline-variant', 
      iconStyles: 'bg-outline-variant/20 text-on-surface-variant border-outline-variant/30' 
    },
    
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardItems.map((item) => (
        <div
          key={item.id}
          className={`bg-surface-container-lowest p-6 rounded-[4px] border border-outline-variant/30 ${item.borderColor} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group relative overflow-hidden`}
        >
          {/* لمسة زخرفية مخفية تظهر عند الـ Hover */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-[4px]"></div>

          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className={`material-symbols-outlined p-2.5 rounded-[4px] border ${item.iconStyles} transition-colors duration-300`}>
              {item.icon}
            </span>
            <span className="text-xs font-bold text-on-surface-variant/40 font-label tracking-wide uppercase">
              إحصائية
            </span>
          </div>
          
          <h4 className="text-3xl font-mono font-bold text-on-surface mb-1.5 relative z-10">
            {isLoading ? (
              // شاشة التحميل (Skeleton Loader)
              <span className="inline-block w-12 h-8 bg-outline-variant/20 animate-pulse rounded-[4px]"></span>
            ) : (
              // الرقم الفعلي مع تأثير دخول خفيف
              <span className="animate-fade-in inline-block">{item.value}</span>
            )}
          </h4>
          
          <p className="text-xs font-bold text-on-surface-variant/70 font-sans relative z-10">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserStatsGrid;