import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useCourseStructure } from '../../../hooks/useCourseStructure';

function useSereneScholarshipFonts() {
  useEffect(() => {
    const id = 'serene-scholarship-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Serif+Arabic:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);
}

function ContentBody({ body }) {
  const lines = body.split('\n');
  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <h3 key={i} className="font-[Noto_Serif_Arabic] text-xl font-semibold text-[#012d1d] mt-6 mb-1">
              {line.replace('## ', '')}
            </h3>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h2 key={i} className="font-[Noto_Serif_Arabic] text-3xl font-bold text-[#012d1d] mt-8 mb-2">
              {line.replace('# ', '')}
            </h2>
          );
        }
        if (line.trim() === '') return null;
        return (
          <p key={i} className="font-[Be_Vietnam_Pro] text-base leading-[1.8] text-[#414844]">
            {line}
          </p>
        );
      })}
    </div>
  );
}

const POSITION_KEY_PREFIX = 'course-position:';

const StructuredCoursePlayer = ({ courseTitle = '' }) => {
  useSereneScholarshipFonts();

  const { courseId } = useParams();
  const { subCourses, files, isLoading, error } = useCourseStructure(courseId, 'student');

  const [activeSubCourseId, setActiveSubCourseId] = useState(null);
  const [activeThemeId, setActiveThemeId] = useState(null);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [expanded, setExpanded] = useState(new Set());
  const [resourcesExpanded, setResourcesExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [hasRestoredPosition, setHasRestoredPosition] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const resolveFileUrl = (url) =>
    url?.startsWith('http') ? url : `${API_URL}${url?.startsWith('/') ? '' : '/'}${url}`;

  // ── Restore saved reading position once data loads ──
  useEffect(() => {
    if (subCourses.length === 0 || hasRestoredPosition) return;

    let saved = null;
    try {
      const raw = localStorage.getItem(`${POSITION_KEY_PREFIX}${courseId}`);
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = null;
    }

    const savedSubCourse = saved && subCourses.find((s) => s.id === saved.subCourseId);
    const savedTheme = savedSubCourse?.themes.find((t) => t.id === saved.themeId);

    if (savedSubCourse && savedTheme) {
      setActiveSubCourseId(savedSubCourse.id);
      setActiveThemeId(savedTheme.id);
      setActiveContentIndex(Math.min(saved.contentIndex || 0, Math.max(savedTheme.contents.length - 1, 0)));
      setExpanded(new Set([savedSubCourse.id]));
    } else {
      setActiveSubCourseId(subCourses[0].id);
      setExpanded(new Set([subCourses[0].id]));
      if (subCourses[0].themes.length > 0) setActiveThemeId(subCourses[0].themes[0].id);
    }
    setHasRestoredPosition(true);
  }, [subCourses, hasRestoredPosition, courseId]);

  // ── Persist position on every change ──
  useEffect(() => {
    if (!hasRestoredPosition || !activeSubCourseId || !activeThemeId) return;
    try {
      localStorage.setItem(
        `${POSITION_KEY_PREFIX}${courseId}`,
        JSON.stringify({ subCourseId: activeSubCourseId, themeId: activeThemeId, contentIndex: activeContentIndex })
      );
    } catch {
      // localStorage unavailable (private browsing, quota) — fail silently, not critical
    }
  }, [activeSubCourseId, activeThemeId, activeContentIndex, courseId, hasRestoredPosition]);

  const activeSubCourse = subCourses.find((s) => s.id === activeSubCourseId);
  const activeTheme = activeSubCourse?.themes.find((t) => t.id === activeThemeId);
  const contents = activeTheme?.contents || [];
  const activeContent = contents[activeContentIndex];

  const toggleSubCourse = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectTheme = (subCourseId, themeId) => {
    setActiveSubCourseId(subCourseId);
    setActiveThemeId(themeId);
    setActiveContentIndex(0);
    setSidebarOpen(false); // close drawer on mobile after picking a lesson
  };

  const findThemeIndex = () =>
    activeSubCourse ? activeSubCourse.themes.findIndex((t) => t.id === activeThemeId) : -1;

  const goNext = useCallback(() => {
    if (activeContentIndex < contents.length - 1) {
      setActiveContentIndex((i) => i + 1);
      return;
    }
    const idx = findThemeIndex();
    const nextTheme = activeSubCourse?.themes[idx + 1];
    if (nextTheme) {
      setActiveThemeId(nextTheme.id);
      setActiveContentIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContentIndex, contents.length, activeSubCourse, activeThemeId]);

  const goPrev = useCallback(() => {
    if (activeContentIndex > 0) {
      setActiveContentIndex((i) => i - 1);
      return;
    }
    const idx = findThemeIndex();
    const prevTheme = activeSubCourse?.themes[idx - 1];
    if (prevTheme) {
      setActiveThemeId(prevTheme.id);
      setActiveContentIndex(Math.max(prevTheme.contents.length - 1, 0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContentIndex, activeSubCourse, activeThemeId]);

  const hasPrev = activeContentIndex > 0 || findThemeIndex() > 0;
  const hasNext =
    activeContentIndex < contents.length - 1 ||
    (activeSubCourse && findThemeIndex() < activeSubCourse.themes.length - 1);

  // ── Keyboard navigation: left/right arrows ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      // RTL layout: visually-right arrow (ArrowRight) = "previous" (backward in reading order),
      // visually-left arrow (ArrowLeft) = "next" — matches the prev/next button icons already in the UI.
      if (e.key === 'ArrowRight' && hasPrev) goPrev();
      if (e.key === 'ArrowLeft' && hasNext) goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext, hasPrev, hasNext]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] font-[Be_Vietnam_Pro] text-[#414844]">
        جاري تحميل المحتوى...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 font-[Be_Vietnam_Pro]">
        <span className="material-symbols-outlined text-4xl text-[#ba1a1a]">lock</span>
        <p className="text-[#414844]">{error}</p>
      </div>
    );
  }

  if (subCourses.length === 0 && files.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] font-[Be_Vietnam_Pro] text-[#414844]">
        لا يوجد محتوى منشور بعد لهذه الدورة.
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[#c1c8c2]/30 flex items-center justify-between">
        <h3 className="font-[Noto_Serif_Arabic] text-2xl font-semibold text-[#012d1d]">{courseTitle}</h3>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-[#414844] hover:text-[#012d1d]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="py-2">
        {subCourses.map((sc) => {
          const isExpanded = expanded.has(sc.id);
          return (
            <div key={sc.id} className="mb-1">
              <button
                onClick={() => toggleSubCourse(sc.id)}
                className="w-full flex items-center justify-between px-6 py-3 text-[#414844] hover:bg-[#e5e2dd]/40 transition-all text-right"
              >
                <span className="font-[Inter] text-sm font-semibold">{sc.title}</span>
                <span className="material-symbols-outlined text-[20px]">
                  {isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_left'}
                </span>
              </button>

              {isExpanded && (
                <div className="bg-white/50">
                  {sc.themes.map((theme) => {
                    const isActive = theme.id === activeThemeId;
                    return (
                      <div key={theme.id} className="relative">
                        {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#012d1d]" />}
                        <button
                          onClick={() => selectTheme(sc.id, theme.id)}
                          className={`w-full flex items-center gap-3 px-10 py-3 transition-all text-right font-[Inter] text-sm ${
                            isActive
                              ? 'text-[#012d1d] bg-[#c1ecd4]/20 font-bold'
                              : 'text-[#414844] hover:bg-[#e5e2dd]/40'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {isActive ? 'play_circle' : 'menu_book'}
                          </span>
                          {theme.title}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {files.length > 0 && (
        <div className="border-t border-[#c1c8c2]/30">
          <button
            onClick={() => setResourcesExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-3 text-[#414844] hover:bg-[#e5e2dd]/40 transition-all text-right"
          >
            <span className="font-[Inter] text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#5d4201]">folder_open</span>
              مصادر وملفات ({files.length})
            </span>
            <span className="material-symbols-outlined text-[20px]">
              {resourcesExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_left'}
            </span>
          </button>

          {resourcesExpanded && (
            <div className="bg-white/50 pb-2">
              {files.map((file) => (
                <a
                  key={file.id}
                  href={resolveFileUrl(file.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-10 py-2.5 text-sm text-[#414844] hover:text-[#012d1d] hover:bg-[#e5e2dd]/40 transition-all font-[Inter]"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#717973]">picture_as_pdf</span>
                  <span className="truncate">{file.name}</span>
                  <span className="material-symbols-outlined text-[14px] mr-auto text-[#717973]">download</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div dir="rtl" className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-[#fcf9f8] overflow-hidden">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#c1c8c2]/30 bg-[#f6f3f2] shrink-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 text-[#012d1d] font-[Inter] text-sm font-semibold"
        >
          <span className="material-symbols-outlined">menu</span>
          الفهرس
        </button>
        <span className="font-[Noto_Serif_Arabic] text-sm font-semibold text-[#414844] truncate max-w-[60%]">
          {activeTheme?.title}
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-8 lg:py-12 px-5 lg:px-8">
            <nav className="hidden lg:flex items-center gap-2 mb-8 text-[#414844] font-[Inter] text-sm font-semibold">
              {courseTitle && <span>{courseTitle}</span>}
              {courseTitle && <span className="material-symbols-outlined text-[16px]">chevron_left</span>}
              <span>{activeSubCourse?.title}</span>
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              <span className="text-[#012d1d] font-bold">{activeTheme?.title}</span>
            </nav>

            {contents.length > 1 && (
              <div className="flex gap-1.5 mb-6">
                {contents.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeContentIndex ? 'w-6 bg-[#012d1d]' : 'w-1.5 bg-[#c1c8c2]'
                    }`}
                  />
                ))}
              </div>
            )}

            {activeContent ? (
              <article className="border-b border-[#c1c8c2]/40 pb-10 mb-8">
                <h1 className="font-[Noto_Serif_Arabic] text-3xl lg:text-4xl font-bold text-[#012d1d] mb-6">
                  {activeContent.title}
                </h1>
                <ContentBody body={activeContent.body} />
              </article>
            ) : (
              <p className="font-[Be_Vietnam_Pro] text-[#414844]">لا يوجد محتوى في هذا الموضوع بعد.</p>
            )}

            <div className="flex justify-between items-center py-6">
              <button
                onClick={goPrev}
                disabled={!hasPrev}
                className="flex items-center gap-2 px-3 lg:px-5 py-2.5 text-[#414844] hover:text-[#012d1d] hover:bg-[#c1ecd4]/20 rounded font-[Inter] text-sm font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                <span className="hidden sm:inline">الدرس السابق</span>
              </button>
              <button
                onClick={goNext}
                disabled={!hasNext}
                className="flex items-center gap-2 px-4 lg:px-6 py-2.5 bg-[#012d1d] text-white hover:opacity-90 rounded font-[Inter] text-sm font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="hidden sm:inline">الدرس التالي</span>
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
            </div>
          </div>
        </main>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-80 shrink-0 h-full bg-[#f6f3f2] border-l border-[#c1c8c2]/30 overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <>
            <div
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
            <aside className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#f6f3f2] z-50 overflow-y-auto shadow-2xl">
              <SidebarContent />
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default StructuredCoursePlayer;