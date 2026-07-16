import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourseStructure } from '../../../hooks/useCourseStructure';
import { useSereneScholarshipFonts } from '../../../hooks/useSereneScholarshipFonts';
import { useReadingPosition } from '../../../hooks/useReadingPosition';
import { useFontSize } from '../../../hooks/useFontSize';
import { useKeyboardNav } from '../../../hooks/useKeyboardNav';
import { useCompletionTracking } from '../../../hooks/useCompletionTracking';

import ContentBody, { ContentTitle } from '../../../components/courses/structuredPlayer/ContentBody.jsx';
import FontSizeControl from '../../../components/courses/structuredPlayer/FontSizeControl.jsx';
import CourseSidebar from '../../../components/courses/structuredPlayer/CourseSidebar.jsx';
import ContentNavigation from '../../../components/courses/structuredPlayer/ContentNavigation.jsx';
import MobileTopBar from '../../../components/courses/structuredPlayer/MobileTopBar.jsx';
import CompletionButton from '../../../components/courses/structuredPlayer/CompletionButton.jsx';
import EngravedBackground from '../../../components/dashboard/shared/EngravedBackground.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const resolveFileUrl = (url) => (url?.startsWith('http') ? url : `${API_URL}${url?.startsWith('/') ? '' : '/'}${url}`);

const StructuredCoursePlayer = ({ courseTitle = '' }) => {
  useSereneScholarshipFonts();

  const { courseId } = useParams();
  const { subCourses, files, isLoading, error } = useCourseStructure(courseId, 'student');
  const { level: fontLevel, increase: increaseFont, decrease: decreaseFont } = useFontSize();
  const { isCompleted, toggleComplete, isThemeCompleted } = useCompletionTracking(courseId);

  const {
    flatLessons,
    activeLesson,
    expanded,
    toggleSubCourse,
    selectTheme: selectThemeBase,
    goToLesson,
    goNext,
    goPrev,
    hasPrev,
    hasNext,
  } = useReadingPosition(courseId, subCourses);

  const [resourcesExpanded, setResourcesExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectTheme = (subCourseId, themeId) => {
    selectThemeBase(subCourseId, themeId);
    setSidebarOpen(false);
  };

  const activeContent = activeLesson?.content;

  // Contents within the current theme, for the progress dots
  const themeContents = activeLesson
    ? flatLessons.filter((l) => l.themeId === activeLesson.themeId).map((l) => l.content)
    : [];
  const indexInTheme = activeContent ? themeContents.findIndex((c) => c.id === activeContent.id) : -1;

  useKeyboardNav({ goPrev, goNext, hasPrev, hasNext });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] font-[Be_Vietnam_Pro] text-slate-500 text-lg">
        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
        جاري تحميل المحتوى...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 font-[Be_Vietnam_Pro]">
        <div className="bg-red-50 p-4 rounded-full">
          <span className="material-symbols-outlined text-4xl text-red-600">lock</span>
        </div>
        <p className="text-slate-700 font-medium">{error}</p>
      </div>
    );
  }

  if (subCourses.length === 0 && files.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] font-[Be_Vietnam_Pro] text-slate-500">
        لا يوجد محتوى منشور بعد لهذه الدورة.
      </div>
    );
  }

  const sidebarProps = {
    courseTitle,
    subCourses,
    expanded,
    activeThemeId: activeLesson?.themeId,
    toggleSubCourse,
    selectTheme,
    files,
    resourcesExpanded,
    setResourcesExpanded,
    resolveFileUrl,
    isThemeCompleted,
  };

  return (
    <div dir="rtl" className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-slate-50 ">
      <EngravedBackground color="var(--primary-container)" opacity={0.06} animated={false} />

      <MobileTopBar activeThemeTitle={activeLesson?.themeTitle} onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="flex flex-1 relative">
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-4xl mx-auto py-8 lg:py-12 px-5 lg:px-10">
            
            {/* Top Navigation & Controls */}
            <div className="hidden lg:flex items-center justify-between mb-10 border-b border-slate-200 pb-4">
              <nav className="flex items-center gap-2 text-slate-500 font-[Inter] text-sm">
                {courseTitle && <span className="hover:text-slate-800 transition-colors cursor-pointer">{courseTitle}</span>}
                {courseTitle && <span className="material-symbols-outlined text-[16px]">chevron_left</span>}
                <span className="hover:text-slate-800 transition-colors cursor-pointer">{activeLesson?.subCourseTitle}</span>
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                <span className="text-[#012d1d] font-semibold bg-[#012d1d]/5 px-2 py-1 rounded-md">{activeLesson?.themeTitle}</span>
              </nav>
              <FontSizeControl level={fontLevel} onIncrease={increaseFont} onDecrease={decreaseFont} />
            </div>

            <div className="flex lg:hidden justify-end mb-6">
              <FontSizeControl level={fontLevel} onIncrease={increaseFont} onDecrease={decreaseFont} />
            </div>

            {/* Theme Progress Indicator */}
            {themeContents.length > 1 && (
              <div className="flex gap-2 mb-8">
                {themeContents.map((c) => (
                  <span
                    key={c.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      c.id === activeContent?.id ? 'w-8 bg-[#012d1d]' : 'w-2 bg-slate-200'
                    }`}
                    title={c.title}
                  />
                ))}
              </div>
            )}

            {/* Main Content Area */}
            {activeContent ? (
              <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <article className="prose prose-slate max-w-none">
                  <ContentTitle fontSizeLevel={fontLevel}>{activeContent.title}</ContentTitle>
                  <div className="mt-8">
                    <ContentBody body={activeContent.body} fontSizeLevel={fontLevel} />
                  </div>
                </article>

                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
                  <CompletionButton
                    isCompleted={isCompleted(activeContent.id)}
                    onToggle={() => toggleComplete(activeContent.id)}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
                <p className="font-[Be_Vietnam_Pro] text-slate-500 text-lg">الرجاء اختيار درس من القائمة الجانبية.</p>
              </div>
            )}

            <ContentNavigation goPrev={goPrev} goNext={goNext} hasPrev={hasPrev} hasNext={hasNext} />
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-[340px] shrink-0 h-full bg-white border-r border-slate-200 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] overflow-y-auto">
          <CourseSidebar {...sidebarProps} />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" />
            <aside className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto shadow-2xl transition-transform">
              <CourseSidebar {...sidebarProps} onClose={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default StructuredCoursePlayer;