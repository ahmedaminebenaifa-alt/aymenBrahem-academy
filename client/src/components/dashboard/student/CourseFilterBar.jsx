import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_FILTERS } from '../../../constants/courseCategories';

const CourseFilterBar = ({ 
  title = "الدورات المتاحة", 
  subtitle = "تصفح مجالس العلم واختر ما يناسب مسيرتك التعليمية",
  activeFilter = "all", 
  onFilterChange,
  sortOption,       
  onSortChange,     
  showViewAll = true 
}) => {
  
  const filters = CATEGORY_FILTERS;
  
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const buttonRefs = useRef([]);

  useEffect(() => {
    const activeIndex = filters.findIndex(f => f.id === activeFilter);
    const activeButton = buttonRefs.current[activeIndex];
    
    if (activeButton) {
      setSliderStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
        opacity: 1
      });
    }
  }, [activeFilter, filters]);

  return (
    <div className="flex flex-col gap-6 mb-8 relative">
      
      <div className="flex justify-between items-start md:items-center pb-5 border-b border-primary/10">
        <div className="flex gap-4 items-center">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary border border-on-tertiary-container/30 shadow-[0_4px_15px_rgba(212,175,55,0.15)]">
            <span className="material-symbols-outlined text-on-tertiary-container text-[26px]">
              local_library
            </span>
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-black text-primary tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-primary mt-1 font-medium opacity-80">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {showViewAll && (
          <Link 
            to="/student/catalog" 
            className="hidden md:flex group items-center gap-1.5 text-sm font-bold text-primary hover:text-on-tertiary-container bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-xl border border-primary/10 transition-all duration-300 shadow-sm"
          >
            عرض الكل
            <span className="material-symbols-outlined text-[18px] rtl:rotate-180 transition-transform group-hover:-translate-x-1">
              arrow_forward
            </span>
          </Link>
        )}
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          <div className="relative inline-flex items-center p-1.5 bg-surface-container-lowest border border-primary/10 rounded-2xl shadow-inner min-w-max">
            
            <div 
              className="absolute top-1.5 bottom-1.5 bg-primary rounded-xl shadow-[0_2px_8px_rgba(1,45,29,0.3)] transition-all duration-500 ease-out"
              style={{ 
                left: `${sliderStyle.left}px`, 
                width: `${sliderStyle.width}px`,
                opacity: sliderStyle.opacity
              }}
            />

            {filters.map((filter, index) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  ref={(el) => (buttonRefs.current[index] = el)}
                  onClick={() => onFilterChange && onFilterChange(filter.id)}
                  className={`relative z-10 whitespace-nowrap px-6 py-2.5 text-sm font-bold rounded-xl transition-colors duration-300 ${
                    isActive
                      ? 'text-on-tertiary-container'
                      : 'text-primary/70 hover:text-primary'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative group w-full lg:w-auto min-w-[200px] flex-shrink-0">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-primary/50 text-[20px] group-hover:text-primary transition-colors">
              tune
            </span>
          </div>
          
          <select 
            value={sortOption}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            className="w-full appearance-none bg-surface-container-lowest border border-primary/10 hover:border-primary/30 text-primary text-sm font-bold rounded-2xl py-3.5 pr-12 pl-12 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer shadow-sm"
          >
            <option value="newest" className="font-medium">الأحدث إضافة</option>
            <option value="alphabetical" className="font-medium">الترتيب الأبجدي</option>
          </select>
          
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-primary/50 text-[20px] group-hover:text-primary transition-colors">
              unfold_more
            </span>
          </div>
        </div>

        {showViewAll && (
          <Link 
            to="/student/catalog" 
            className="flex md:hidden w-full items-center justify-center gap-1.5 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 px-5 py-3 rounded-xl border border-primary/10 transition-all shadow-sm"
          >
            عرض كل الدورات المتاحة
            <span className="material-symbols-outlined text-[18px] rtl:rotate-180">
              arrow_forward
            </span>
          </Link>
        )}
                
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default CourseFilterBar;