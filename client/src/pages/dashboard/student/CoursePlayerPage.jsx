import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCoursePlayer } from '../../../hooks/useCoursePlayer';

// تعريف الرابط الأساسي للملفات (لضمان عمله محلياً وعلى السيرفر)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  
  const {
    course,
    currentFile,
    setCurrentFile,
    isLoading,
    error,
  } = useCoursePlayer(courseId);

  // 🔍 نظام تتبع تلقائي لمعرفة الروابط وحل مشاكل الـ 404 في ثوانٍ
  useEffect(() => {
    if (currentFile) {
      console.log("📄 Active File Object:", currentFile);
      console.log("🔗 Computed File URL for iframe:", fileUrl);
    }
  }, [currentFile]);

  // 1. واجهة التحميل الأساسية (Loading State)
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        <p className="text-on-surface-variant font-medium text-sm font-arabic">جاري تحميل محتويات الدورة العلمية...</p>
      </div>
    );
  }

  // 2. واجهة الخطأ (Error State)
  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-surface-container-lowest border border-error/20 rounded text-center space-y-4 shadow-sm animate-fade-in">
        <span className="material-symbols-outlined text-4xl text-error">error</span>
        <h3 className="text-lg font-bold text-on-surface font-arabic">حدث خطأ أثناء تحميل الدورة</h3>
        <p className="text-sm text-on-surface-variant font-arabic">{error}</p>
        <Link to="/dashboard/student" className="inline-block px-4 py-2 bg-primary text-on-primary rounded text-sm font-bold shadow-sm font-arabic">
          العودة للوحة القيادة
        </Link>
      </div>
    );
  }

  // 3. حماية ضد الشاشة البيضاء (Fallback Placeholder)
  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined animate-pulse text-4xl text-outline-variant">hourglass_empty</span>
        <p className="text-on-surface-variant font-medium text-sm font-arabic">جاري معالجة بيانات الدورة العلمية...</p>
      </div>
    );
  }

  // إيجاد الفهرس الحالي للملف للتحكم بأزرار التالي والسابق
  const currentFileIndex = course.files?.findIndex(f => f.id === currentFile?.id) ?? -1;

  // 🛠️ معالجة ذكية لرابط الملف (تدعم url أو fileUrl حسب ما يرسله الباك إند)
  const rawUrl = currentFile?.url || currentFile?.fileUrl || '';
  
  let cleanPath = rawUrl;
  // إذا كان الرابط نسبياً ولا يحتوي على كلمة uploads، نقوم بحقنها تلقائياً لمنع الـ 404
  if (rawUrl && !rawUrl.startsWith('http') && !rawUrl.includes('uploads')) {
    cleanPath = `/uploads/${rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl}`;
  }

  // تركيب الرابط النهائي لعارض الـ PDF
  const fileUrl = cleanPath && cleanPath !== '/'
    ? (cleanPath.startsWith('http') ? cleanPath : `${API_URL}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`)
    : '';
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 p-4 md:p-0 animate-fade-in text-right" dir="rtl">
      
      {/* ========================================== */}
      {/* 1. رأس الصفحة (العنوان والعودة) */}
      {/* ========================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest p-6 rounded border border-outline-variant/30 shadow-sm">
        <div>
          <Link to="/dashboard/student" className="text-sm text-primary flex items-center gap-1 mb-2 hover:underline font-arabic">
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            العودة للوحة القيادة
          </Link>
          <h1 className="text-2xl font-bold font-arabic text-primary">{course.title}</h1>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. منطقة العرض الرئيسية (الشبكة) */}
      {/* ========================================== */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* الجانب الأيمن (2/3 من الشاشة): عارض الـ PDF والتفاصيل */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          <div className="w-full h-[60vh] lg:h-[75vh] bg-surface-container-highest rounded overflow-hidden relative shadow-md border-b-4 border-[#d4af37]">
            {fileUrl ? (
              <iframe 
                src={`${fileUrl}#toolbar=0`} 
                title={currentFile?.name || "PDF Viewer"}
                className="w-full h-full border-none"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-surface-container/40">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 drop-shadow-md">
                  picture_as_pdf
                </span>
                <p className="text-on-surface-variant font-medium font-arabic">
                  {currentFile ? `جاري تجهيز وعرض: ${currentFile.name}` : 'يرجى اختيار ملف من القائمة اليسرى لبدء القراءة والمطالعة'}
                </p>
              </div>
            )}
          </div>

          {/* تفاصيل الملف النشط وأزرار التحكم */}
          <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant/30 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-arabic text-on-surface">
                {currentFile?.name || 'لم يتم اختيار ملف'}
              </h2>
              {fileUrl && (
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline mt-2 font-arabic"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  فتح الملف في نافذة مستقلة / تحميل
                </a>
              )}
            </div>
            
            {/* أزرار التنقل بين الملفات */}
            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0" dir="ltr">
              <button 
                disabled={currentFileIndex <= 0}
                onClick={() => setCurrentFile(course.files[currentFileIndex - 1])}
                className="flex-1 md:flex-none px-4 py-2 border border-outline-variant/50 text-on-surface-variant rounded text-sm font-bold flex items-center justify-center gap-1 hover:bg-surface-container disabled:opacity-50 transition-colors font-arabic"
              >
                <span className="material-symbols-outlined text-[18px]">skip_next</span>
                السابق
              </button>
              <button 
                disabled={currentFileIndex === -1 || currentFileIndex === (course.files?.length - 1)}
                onClick={() => setCurrentFile(course.files[currentFileIndex + 1])}
                className="flex-1 md:flex-none px-4 py-2 bg-primary text-on-primary rounded text-sm font-bold flex items-center justify-center gap-1 hover:bg-primary/90 disabled:opacity-50 transition-colors font-arabic"
              >
                التالي
                <span className="material-symbols-outlined text-[18px]">skip_previous</span>
              </button>
            </div>
          </div>
        </div>

        {/* الجانب الأيسر (1/3 من الشاشة): قائمة التصفح للملفات */}
        <div className="w-full lg:w-1/3 flex flex-col h-full lg:max-h-[75vh]">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded flex flex-col h-full shadow-sm">
            
            {/* رأس القائمة */}
            <div className="p-4 border-b border-outline-variant/20 bg-surface-container/30">
              <h3 className="font-bold text-primary flex items-center gap-2 font-arabic">
                <span className="material-symbols-outlined">folder_open</span>
                ملفات ومصادر الدورة ({course.files?.length || 0})
              </h3>
            </div>

            {/* محتوى القائمة الحي */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin max-h-[50vh] lg:max-h-none">
              <div className="space-y-1">
                {course.files?.map((file) => (
                  <button 
                    key={file.id}
                    onClick={() => setCurrentFile(file)}
                    className={`w-full text-right p-3 rounded flex items-start gap-3 transition-colors ${
                      currentFile?.id === file.id 
                        ? 'bg-primary/10 border-r-2 border-primary' 
                        : 'hover:bg-surface-container/50 border-r-2 border-transparent'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${currentFile?.id === file.id ? 'text-primary' : 'text-outline'}`}>
                      picture_as_pdf
                    </span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold font-arabic ${currentFile?.id === file.id ? 'text-primary' : 'text-on-surface'}`}>
                        {file.name}
                      </p>
                    </div>
                  </button>
                ))}
                
                {(!course.files || course.files.length === 0) && (
                  <div className="text-center py-12 flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-4xl text-outline-variant">info</span>
                    <p className="text-sm text-on-surface-variant font-arabic">لا توجد ملفات مرفوعة لهذه الدورة حالياً.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoursePlayerPage;