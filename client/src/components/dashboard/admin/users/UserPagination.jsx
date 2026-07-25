import React from 'react';

const UserPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <div className="text-sm text-on-surface-variant font-sans hidden sm:block">
        يتم عرض الصفحة <span className="font-bold text-primary">{currentPage}</span> من أصل <span className="font-bold">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-[4px] flex items-center justify-center border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95 bg-surface-container-lowest"
          title="الصفحة السابقة"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>

        <div className="flex items-center gap-1.5 direction-ltr">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="flex items-center justify-center w-8 text-on-surface-variant/50 font-bold">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-10 h-10 rounded-[4px] flex items-center justify-center text-sm font-bold transition-all active:scale-95 ${
                    currentPage === page
                      ? 'bg-primary text-on-primary border border-primary shadow-sm shadow-primary/20'
                      : 'bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-[4px] flex items-center justify-center border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95 bg-surface-container-lowest"
          title="الصفحة التالية"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
      </div>
    </div>
  );
};

export default UserPagination;