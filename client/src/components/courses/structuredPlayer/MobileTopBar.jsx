export default function MobileTopBar({ activeThemeTitle, onOpenSidebar }) {
  return (
    <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm shrink-0 transition-all">
      <button 
        onClick={onOpenSidebar} 
        className="flex items-center gap-2 text-slate-700 hover:text-[#012d1d] bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-lg font-[Inter] text-sm font-bold transition-colors border border-slate-100"
      >
        <span className="material-symbols-outlined text-[20px]">menu</span>
        الفهرس
      </button>
      
      {activeThemeTitle && (
        <div className="flex items-center gap-2.5 max-w-[55%]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#012d1d] shrink-0" />
          <span className="font-[Noto_Serif_Arabic] text-sm font-bold text-slate-800 truncate">
            {activeThemeTitle}
          </span>
        </div>
      )}
    </div>
  );
}