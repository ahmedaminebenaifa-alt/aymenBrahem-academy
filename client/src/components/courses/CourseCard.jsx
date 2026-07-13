import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategoryLabel } from '../../constants/courseCategories';
import PurchaseModal from './PurchaseModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CourseCard = ({ course, onEnroll, isEnrolling }) => {
  const navigate = useNavigate();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [justSubmittedManual, setJustSubmittedManual] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    description,
    category,
    coverImage,
    isFree,
    price,
    isEnrolled,
    hasPendingOrder,
    lessonsCount = 0,
    resourcesCount = 0,
  } = course || {};

  const isPending = hasPendingOrder || justSubmittedManual;
  const resolvedImageUrl = coverImage
    ? (coverImage.startsWith('http') ? coverImage : `${API_BASE_URL}${coverImage}`)
    : null;

  const handleCardClick = () => {
    navigate(`/dashboard/student/courses/${id}`);
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (isFree) {
      onEnroll?.(id);
    } else {
      setShowPurchaseModal(true);
    }
  };

  return (
    <>
      <style>{`
        .elegant-float {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .elegant-float:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -12px rgba(212, 175, 55, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      <article className="group elegant-float bg-[var(--surface-container-lowest)] rounded-xl flex flex-col h-full overflow-hidden border border-[var(--outline-variant)]/40 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37] z-20"></div>

        <div
          className={`aspect-[16/10] w-full relative overflow-hidden bg-[#063c25]/5 ${isEnrolled ? 'cursor-pointer' : ''}`}
          onClick={handleCardClick}
          role={isEnrolled ? 'button' : undefined}
          tabIndex={isEnrolled ? 0 : undefined}
        >
          {resolvedImageUrl && !imageError ? (
            <img
              src={resolvedImageUrl}
              alt={title || 'صورة الدورة'}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#063c25] text-[#d4af37]/60 arabesque-pattern relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <span className="material-symbols-outlined text-4xl mb-3 relative z-10 select-none">local_library</span>
              <div className="w-10 h-[1px] bg-[#d4af37]/40 relative z-10"></div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {category && (
            <span className="absolute top-4 right-4 bg-[#063c25] text-[#d4af37] px-3 py-1 text-xs font-bold rounded shadow-sm border border-[#d4af37]/20 z-10">
              {getCategoryLabel(category)}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1 bg-[var(--surface-container-lowest)]">
          <h3
            onClick={handleCardClick}
            className={`text-lg font-bold font-arabic text-[var(--on-surface)] leading-tight mb-2 line-clamp-2 transition-colors duration-200 ${
              isEnrolled ? 'cursor-pointer hover:text-[#d4af37]' : 'group-hover:text-[#d4af37]'
            }`}
          >
            {title || 'بدون عنوان'}
          </h3>

          <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed line-clamp-2 mb-4 flex-1">
            {description || 'لا يوجد وصف متاح لهذه الدورة حالياً.'}
          </p>

          <div className="flex items-center gap-4 text-xs text-[var(--on-surface-variant)] mb-5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#d4af37]">play_circle</span>
              <span>{lessonsCount} درساً</span>
            </div>
            
            {resourcesCount > 0 && (
              <>
                <div className="w1 h-1 rounded-full bg-[var(--outline-variant)]"></div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#d4af37]">menu_book</span>
                  <span>{resourcesCount} مصادر</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-[var(--outline-variant)]/30">
            {!isEnrolled && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[var(--on-surface-variant)]">قيمة الاشتراك</span>
                <span className={`text-base font-bold ${isFree ? 'text-[#063c25]' : 'text-[var(--on-surface)]'}`}>
                  {isFree ? 'مجانية بالكامل' : `${Number(price).toLocaleString('en-US')} د.ت`}
                </span>
              </div>
            )}

            <div className="w-full">
              {isEnrolled ? (
                <Link
                  to={`/dashboard/student/courses/${id}`}
                  className="w-full py-2.5 bg-[#063c25]/5 text-[#063c25] rounded text-sm font-bold flex justify-center items-center gap-2 hover:bg-[#063c25] hover:text-white transition-colors duration-200"
                >
                  <span className="material-symbols-outlined text-[20px]">import_contacts</span>
                  متابعة التعلم
                </Link>
              ) : isPending ? (
                <div className="w-full py-2.5 bg-[var(--tertiary)]/10 text-[var(--tertiary)] rounded text-sm font-bold flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] animate-pulse">hourglass_top</span>
                  بانتظار موافقة الإدارة
                </div>
              ) : (
                <button
                  onClick={handleActionClick}
                  disabled={isEnrolling}
                  aria-label={isFree ? `سجل مجاناً في ${title}` : `اشترك في ${title}`}
                  className="w-full py-2.5 bg-[#063c25] text-white rounded text-sm font-bold flex justify-center items-center gap-2 hover:bg-[#084c30] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isEnrolling ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px] text-[#d4af37]">
                        {isFree ? 'add_circle' : 'shopping_cart'}
                      </span>
                      {isFree ? 'سجل مجاناً' : 'اشترك الآن'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {showPurchaseModal && (
          <PurchaseModal
            course={course}
            onClose={() => setShowPurchaseModal(false)}
            onManualSuccess={() => setJustSubmittedManual(true)}
          />
        )}
      </article>
    </>
  );
};

export default CourseCard;