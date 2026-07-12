import React from 'react';

const UserSearchAndFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  activeRoleFilter, 
  setActiveRoleFilter 
}) => {
  // الأدوار المتاحة للفلترة (يمكنك تعديلها حسب الحاجة)
  const roles = ['الكل', 'طالب', 'مشرف أكاديمي', 'مدير النظام'];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-6 bg-surface-container-low p-4 rounded-[4px] border border-outline-variant/30 shadow-sm">
      
      {/* 1. شريط البحث الذكي */}
      <div className="relative w-full lg:w-[400px] group">
        {/* أيقونة البحث (تتغير ألوانها عند التركيز) */}
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors pointer-events-none">
          search
        </span>
        
        <input
          type="text"
          placeholder="ابحث بالاسم أو البريد الإلكتروني..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-[4px] text-sm font-sans text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
        />
        
        {/* زر مسح البحث السريع (يظهر فقط إذا كان هناك نص) */}
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-error transition-colors flex items-center justify-center p-1 rounded-[4px] hover:bg-error/10"
            title="مسح البحث"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* 2. فلاتر الصلاحيات (أزرار التصفية) */}
      <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
        <span className="text-on-surface font-label text-xs font-bold whitespace-nowrap">تصفية حسب الدور:</span>
        
        <div className="flex gap-2">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRoleFilter(role)}
              className={`px-4 py-2 rounded-[4px] text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                activeRoleFilter === role
                  ? 'bg-primary text-on-primary border-primary shadow-sm shadow-primary/10'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high hover:text-primary'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default UserSearchAndFilters;