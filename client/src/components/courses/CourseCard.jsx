import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 1. استدعاء useNavigate
import { getCategoryLabel } from '../../constants/courseCategories';

const CourseCard = ({ course, onEnroll, isEnrolling }) => {
  const navigate = useNavigate(); 

  const {
    id,
    title,
    description,
    category,       
    coverImage,
    isFree,         
    price,          
    isEnrolled,
    lessonsCount = 0,
    resourcesCount = 3 
  } = course || {};



  const handleCardClick = () => {
    navigate(`/dashboard/student/courses/${id}`);
  };
  return (
    <div className="group bg-surface-container-lowest border border-outline-variant/30 border-t-2 border-t-[#d4af37] rounded flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
      
      {/* ======================= */}
      {/* 1. COVER IMAGE SECTION  */}
      {/* ======================= */}
      {/* 👈 4. أضفنا onClick هنا مع تغيير شكل المؤشر إذا كان مسجلاً */}
      <div 
        className={`h-40 relative overflow-hidden bg-surface-container ${isEnrolled ? 'cursor-pointer' : ''}`}
        onClick={handleCardClick}
      >
        {coverImage ? (
          <img 
            src={coverImage.startsWith('http') ? coverImage : `http://localhost:5000${coverImage}`} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div className={`w-full h-full items-center justify-center bg-primary/5 text-primary/40 ${coverImage ? 'hidden' : 'flex'}`}>
          <span className="material-symbols-outlined text-5xl">menu_book</span>
        </div>
        
        {category && (
          <span className="absolute top-3 right-3 bg-primary-container/10 text-primary-container px-2.5 py-1 text-[11px] font-bold rounded backdrop-blur-sm">
            {getCategoryLabel(category)}
          </span>
        )}
      </div>

      {/* ======================= */}
      {/* 2. TEXT CONTENT SECTION */}
      {/* ======================= */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Title */}
        {/* 👈 5. جعل العنوان قابلاً للنقر أيضاً */}
        <h3 
          onClick={handleCardClick}
          className={`text-lg font-bold font-arabic text-on-surface mb-2 line-clamp-2 transition-colors ${isEnrolled ? 'cursor-pointer hover:text-primary' : 'group-hover:text-primary'}`}
        >
          {title || 'بدون عنوان'}
        </h3>
        
        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-4 flex-1">
          {description || 'لا يوجد وصف متاح لهذه الدورة حالياً.'}
        </p>

        {/* META INFO SECTION */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant font-medium mb-4">
          <div className="flex items-center gap-1.5">
             <span className="material-symbols-outlined text-[16px] text-[#d4af37]">play_lesson</span>
             <span>{lessonsCount} درساً</span>
          </div>
          {resourcesCount > 0 && (
            <div className="flex items-center gap-1.5">
               <span className="material-symbols-outlined text-[16px] text-[#d4af37]">library_books</span>
               <span>{resourcesCount} مصادر تعليمية</span>
            </div>
          )}
        </div>

        {!isEnrolled && (
          <div className="flex items-center gap-1.5 text-xs font-bold mb-4 pt-3 border-t border-outline-variant/10">
            <span className="material-symbols-outlined text-[16px] text-[#d4af37]">payments</span>
            <span className={isFree ? 'text-primary' : 'text-on-surface'}>
              {isFree ? 'مجانية بالكامل' : `${price} ريال / دولار`}
            </span>
          </div>
        )}

        {/* ======================= */}
        {/* 3. ACTION FOOTER        */}
        {/* ======================= */}
        <div className="mt-auto pt-4 border-t border-outline-variant/20">
          {isEnrolled ? (
            // هذا الزر أساساً يستخدم Link وهو يعمل بشكل ممتاز
            <Link 
              to={`/dashboard/student/courses/${id}`}
              className="w-full py-2 bg-primary/10 text-primary rounded text-sm font-bold flex justify-center items-center gap-2 hover:bg-primary hover:text-on-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              متابعة التعلم
            </Link>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation(); // لمنع تداخل النقرات
                if(onEnroll) onEnroll(id);
              }}
              disabled={isEnrolling}
              className="w-full py-2 bg-primary text-on-primary rounded text-sm font-bold flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEnrolling ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  جاري التسجيل...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  {isFree ? 'سجل مجاناً' : 'اشترك الآن'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;