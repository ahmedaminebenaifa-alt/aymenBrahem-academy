import React from 'react';

const CourseFilters = ({ activeFilter, onFilterChange }) => {
  const categories = ['الكل', 'القرآن الكريم', 'اللغة العربية', 'الشريعة الإسلامية'];

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 bg-surface-container-low p-4 rounded-[4px] border border-outline-variant/30">
      <span className="text-on-surface font-label text-xs font-bold ml-2">تصفية المنهج الدراسي:</span>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onFilterChange(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              activeFilter === cat
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex-1"></div>
      <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary text-xs font-bold transition-colors">
        <span className="material-symbols-outlined text-sm">filter_list</span>
        <span>تخصيص العرض</span>
      </button>
    </div>
  );
};

export default CourseFilters;