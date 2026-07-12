import React from 'react';

const CourseEmptyState = ({ onAddClick }) => {
  return (
    <div className="text-center py-16 px-4 bg-surface-container-lowest rounded-[4px] border border-outline-variant/30 max-w-md mx-auto shadow-sm">
      <span className="material-symbols-outlined text-primary text-5xl mb-4 bg-primary/5 p-4 rounded-[4px] border border-outline-variant/20 inline-block">
        menu_book
      </span>
      <h4 className="font-display font-bold text-xl text-on-surface mb-2">
        لا توجد دروس حالياً
      </h4>
      <p className="text-on-surface-variant/80 text-sm max-w-md mx-auto leading-relaxed">
        ابدأ بإثراء المحتوى التعليمي عبر إضافة أول درس لك في المنصة وسوف يظهر هنا فوراً في قائمة المناهج.
      </p>
      <button
        onClick={onAddClick}
        className="mt-8 inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-[4px] font-bold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all duration-200"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        إضافة درس جديد
      </button>
    </div>
  );
};

export default CourseEmptyState;