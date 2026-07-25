import React from 'react';

const UserEmptyState = ({ isSearchEmpty, onClearFilters, onAddUser }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-surface-container-lowest rounded-[4px] border border-outline-variant/30 text-center shadow-sm w-full transition-all duration-300">
      
      <div className="w-20 h-20 bg-primary/5 border border-primary/10 rounded-[4px] flex items-center justify-center mb-6 relative">
        <span className="material-symbols-outlined text-primary text-5xl opacity-80">
          {isSearchEmpty ? 'person_search' : 'group_off'}
        </span>
        <div className="absolute inset-0 border border-primary/20 rotate-45 rounded-[4px] -z-10 scale-75 opacity-50"></div>
      </div>
      
      <h3 className="font-display font-bold text-xl text-on-surface mb-3">
        {isSearchEmpty ? 'لم نتمكن من العثور على أي نتائج' : 'لا يوجد مستخدمون حتى الآن'}
      </h3>
      
      <p className="text-on-surface-variant/80 text-sm max-w-md leading-relaxed mb-8 font-sans">
        {isSearchEmpty 
          ? 'لم يتطابق أي مستخدم مع كلمات البحث أو الفلاتر التي قمت بتحديدها. يرجى التحقق من الكلمات المدخلة أو مسح الفلاتر للمحاولة مجدداً.' 
          : 'منصة الأكاديمية لا تحتوي على أي مستخدمين مسجلين في الوقت الحالي. بمجرد انضمام الطلاب أو إضافة مشرفين سيظهرون في هذه القائمة.'}
      </p>
      
      {isSearchEmpty ? (
        <button
          onClick={onClearFilters}
          className="px-6 py-2.5 bg-surface-container-low text-on-surface-variant border border-outline-variant/50 rounded-[4px] text-sm font-bold hover:bg-surface-container-high hover:text-primary transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
          مسح فلاتر البحث
        </button>
      ) : (
        <button
          onClick={onAddUser}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-[4px] text-sm font-bold shadow-md shadow-primary/20 hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          إضافة مستخدم جديد
        </button>
      )}
    </div>
  );
};

export default UserEmptyState;