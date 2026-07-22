export default function CourseSidebar({
  courseTitle,
  subCourses,
  expanded,
  activeThemeId,
  toggleSubCourse,
  selectTheme,
  files,
  resourcesExpanded,
  setResourcesExpanded,
  resolveFileUrl,
  isThemeCompleted,
  onClose,
}) {
  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Header */}
      <div className="p-6 border-b border-primary/10 flex items-start justify-between sticky top-0 bg-surface-container-lowest/90 backdrop-blur-md z-10">
        <h3 className="font-[Noto_Serif_Arabic] text-xl lg:text-2xl font-bold text-primary leading-snug">
          {courseTitle}
        </h3>
        {onClose && (
          <button 
            onClick={onClose} 
            className="lg:hidden text-outline hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {subCourses.map((sc) => {
          const isExpanded = expanded.has(sc.id);
          return (
            <div key={sc.id} className="mb-2">
              {/* SubCourse Toggle */}
              <button
                onClick={() => toggleSubCourse(sc.id)}
                className="w-full flex items-center justify-between px-6 py-3.5 text-on-surface-variant hover:bg-primary/[0.03] transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] text-right group active:scale-[0.99]"
              >
                <span className="font-[Inter] text-sm font-bold tracking-wide group-hover:text-primary transition-colors duration-[400ms]">
                  {sc.title}
                </span>
                <span className="material-symbols-outlined text-[20px] text-outline group-hover:text-primary transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]">
                  {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Themes List */}
              <div 
                className={`overflow-hidden transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  isExpanded ? 'max-h-[2000px] opacity-100 py-1' : 'max-h-0 opacity-0'
                }`}
              >
                {sc.themes.map((theme) => {
                  const isActive = theme.id === activeThemeId;
                  const completed = isThemeCompleted?.(theme);
                  return (
                    <div key={theme.id} className="relative">
                      <button
                        onClick={() => selectTheme(sc.id, theme.id)}
                        className={`group w-full flex items-center gap-3 px-8 py-3 transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] text-right font-[Inter] text-sm border-r-4 active:scale-[0.98] ${
                          isActive
                            ? 'border-primary bg-primary/[0.06] text-primary font-bold'
                            : 'border-transparent text-on-surface-variant hover:bg-primary/[0.02] hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[20px] transition-colors duration-[400ms] ${
                            isActive 
                              ? 'text-primary' 
                              : completed 
                                ? 'text-primary/70' 
                                : 'text-outline-variant group-hover:text-primary/60'
                          }`}
                        >
                          {isActive ? 'play_circle' : completed ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span className="flex-1 leading-relaxed transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-1">
                          {theme.title}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Resources Section Pinned to Bottom */}
      {files.length > 0 && (
        <div className="border-t border-primary/10 bg-primary/[0.02] mt-auto">
          <button
            onClick={() => setResourcesExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 text-on-surface-variant hover:bg-primary/[0.04] transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] text-right group"
          >
            <span className="font-[Inter] text-sm font-bold flex items-center gap-2 group-hover:text-primary transition-colors duration-[400ms]">
              <span className="material-symbols-outlined text-[20px] text-on-tertiary-container group-hover:scale-110 transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]">
                folder_zip
              </span>
              المصادر والملفات ({files.length})
            </span>
            <span className="material-symbols-outlined text-[20px] text-outline group-hover:text-primary transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]">
              {resourcesExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          <div 
            className={`overflow-hidden transition-all duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
              resourcesExpanded ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
          >
            {files.map((file) => (
              <a
                key={file.id}
                href={resolveFileUrl(file.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-3 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/[0.05] transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] font-[Inter] group"
              >
                <span className="material-symbols-outlined text-[18px] text-error/80 group-hover:text-error transition-colors">
                  picture_as_pdf
                </span>
                <span className="truncate flex-1 transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-1">
                  {file.name}
                </span>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0.5">
                  download
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}