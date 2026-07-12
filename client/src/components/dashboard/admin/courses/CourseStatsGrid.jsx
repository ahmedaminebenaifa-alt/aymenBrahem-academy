import React from 'react';

const CourseStatsGrid = ({ stats, isLoading }) => {
  const cardItems = [
    { id: 'total', label: 'إجمالي الدروس', value: stats.total, icon: 'menu_book', borderColor: 'border-t-2 border-primary', iconBg: 'bg-primary/5 text-primary' },
    { id: 'published', label: 'منشور للطلاب', value: stats.published, icon: 'check_circle', borderColor: 'border-t-2 border-surface-tint', iconBg: 'bg-surface-tint/10 text-surface-tint' },
    { id: 'drafts', label: 'المسودات الحالية', value: stats.drafts, icon: 'edit_note', borderColor: 'border-t-2 border-outline-variant', iconBg: 'bg-outline-variant/20 text-on-surface-variant' },
    { id: 'archived', label: 'الدروس المؤرشفة', value: stats.archived || 0, icon: 'archive', borderColor: 'border-t-2 border-outline', iconBg: 'bg-secondary-container text-outline' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {cardItems.map((item) => (
        <div
          key={item.id}
          className={`bg-surface-container-lowest p-6 rounded-[4px] border border-outline-variant/30 ${item.borderColor} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`material-symbols-outlined p-2 rounded-[4px] border border-outline-variant/10 ${item.iconBg}`}>
              {item.icon}
            </span>
            <span className="text-xs font-bold text-on-surface-variant/40 font-label">الإحصائيات</span>
          </div>
          <h4 className="text-3xl font-mono font-bold text-on-surface mb-1">
            {isLoading ? <span className="inline-block w-8 h-8 bg-outline-variant/20 animate-pulse rounded-[4px]"></span> : item.value}
          </h4>
          <p className="text-xs font-bold text-on-surface-variant/70">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseStatsGrid;