import React from 'react';
import { COURSE_CATEGORIES } from '../../../../constants/courseCategories';

const CourseBasicInfo = ({ data, onChange }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[4px] shadow-sm overflow-hidden border-t-2 border-tertiary">
      
      {/* Section Header with traditional gold-accented vertical indicator */}
      <div className="flex items-center gap-3 px-6 py-5 bg-surface-container-low/40 border-b border-outline-variant/20">
        <div className="w-1 h-5 bg-tertiary rounded-full"></div>
        <h3 className="font-display font-bold text-lg text-primary">
          البيانات الأساسية للدرس
        </h3>
      </div>

      {/* Form Fields Container */}
      <div className="p-6 space-y-6">
        
        {/* Title & Price Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Title Input (Takes up 3/4 space) */}
          <div className="md:col-span-3">
            <label className="block text-sm font-bold text-on-surface mb-2 flex items-center gap-1">
              <span>عنوان الدرس / الدورة</span>
              <span className="text-error font-sans">*</span>
            </label>
            <input
              type="text"
              required
              value={data.title}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-[4px] px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all"
              placeholder="مثال: شرح كتاب الورقات في أصول الفقه"
            />
          </div>

          {/* Price Input (Takes up 1/4 space) */}
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-on-surface mb-2">
              التسعير (دينار)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={data.price}
                onChange={(e) => onChange('price', e.target.value)}
                className="w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-[4px] px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all font-mono text-left dir-ltr pl-12"
                placeholder="0.00"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant/60 select-none pointer-events-none">
                D.T
              </span>
            </div>
          </div>

        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2 flex items-center gap-1">
            <span>تصنيف الدورة</span>
            <span className="text-error font-sans">*</span>
          </label>
          <select
            required
            value={data.category || ''}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-[4px] px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all"
          >
            <option value="" disabled>اختر تصنيف الدورة</option>
            {Object.values(COURSE_CATEGORIES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        {/* Description Field with Formatted Toolbar Mockup */}
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2 flex items-center gap-1">
            <span>تفاصيل المحتوى والوصف العلمي</span>
            <span className="text-error font-sans">*</span>
          </label>
          
          {/* Editor Container Wrapper */}
          <div className="border border-outline-variant/30 rounded-[4px] overflow-hidden focus-within:border-tertiary focus-within:ring-1 focus-within:ring-tertiary transition-all">
            
            {/* Mockup Rich-Text Formatting Toolbar exactly mimicking your layout rules */}
            <div className="flex flex-wrap items-center gap-1 bg-surface-container-low px-3 py-2 border-b border-outline-variant/20 select-none">
              <button type="button" className="p-1.5 rounded-[4px] text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px] block">format_bold</span>
              </button>
              <button type="button" className="p-1.5 rounded-[4px] text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px] block">format_italic</span>
              </button>
              <button type="button" className="p-1.5 rounded-[4px] text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px] block">format_underlined</span>
              </button>
              
              <div className="w-[1px] h-4 bg-outline-variant/40 mx-1"></div>
              
              <button type="button" className="p-1.5 rounded-[4px] text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px] block">format_align_right</span>
              </button>
              <button type="button" className="p-1.5 rounded-[4px] text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px] block">format_align_center</span>
              </button>
              
              <div className="w-[1px] h-4 bg-outline-variant/40 mx-1"></div>

              <button type="button" className="p-1.5 rounded-[4px] text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px] block">format_list_bulleted</span>
              </button>
              <button type="button" className="p-1.5 rounded-[4px] text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px] block">link</span>
              </button>
            </div>

            {/* Main Textarea Area */}
            <textarea
              required
              rows="6"
              value={data.description}
              onChange={(e) => onChange('description', e.target.value)}
              className="w-full bg-surface-container-low/20 border-0 p-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-0 resize-none leading-relaxed"
              placeholder="اكتب مقدمة تفصيلية عن المادة الأكاديمية والدروس المستفادة ومحاور المنهج الشرعي..."
            />
          </div>
          
          <p className="mt-2 text-xs text-on-surface-variant/70 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">info</span>
            <span>سيتم عرض هذا الوصف بشكل بارز للطلاب في صفحة تفاصيل المادة قبل الاشتراك.</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default CourseBasicInfo;