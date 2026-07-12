import React, { useState, useRef, useCallback } from 'react';

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_IMG_SIZE = 2 * 1024 * 1024; // 2MB

const CourseMedia = ({ media, onChange, existingImageUrl = null, existingFiles = [], onDeleteExisting }) => {  // Local state for drag micro-interactions and error messages
  const [dragState, setDragState] = useState({ image: false, pdf: false });
  const [errors, setErrors] = useState({ image: '', pdf: '' });

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  // --- Helper: Format Bytes to MB ---
  const formatSize = (bytes) => (bytes / (1024 * 1024)).toFixed(2) + ' MB';

  // --- Image Handlers (Cover Thumbnail) ---
  const processImage = (file) => {
    setErrors(prev => ({ ...prev, image: '' }));
    
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return setErrors(prev => ({ ...prev, image: 'عذراً، يسمح فقط برفع الصور (JPG, PNG).' }));
    }
    if (file.size > MAX_IMG_SIZE) {
      return setErrors(prev => ({ ...prev, image: `حجم الصورة يتجاوز الحد الأقصى (${formatSize(MAX_IMG_SIZE)}).` }));
    }
    
    onChange('thumbnail', file);
  };

  // --- PDF Handlers (Resources) ---
  const processPdfs = (files) => {
    setErrors(prev => ({ ...prev, pdf: '' }));
    const fileArray = Array.from(files);
    
    const validPdfs = [];
    let hasError = false;

    fileArray.forEach(file => {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, pdf: 'عذراً، بعض الملفات ليست بصيغة PDF وتم استبعادها.' }));
        hasError = true;
      } else if (file.size > MAX_PDF_SIZE) {
        setErrors(prev => ({ ...prev, pdf: `الملف ${file.name} يتجاوز الحد الأقصى (${formatSize(MAX_PDF_SIZE)}).` }));
        hasError = true;
      } else {
        validPdfs.push(file);
      }
    });

    if (validPdfs.length > 0) {
      onChange('pdfs', [...media.pdfs, ...validPdfs]);
    }
  };

  const removePdf = (indexToRemove) => {
    onChange('pdfs', media.pdfs.filter((_, idx) => idx !== indexToRemove));
  };

  const removeImage = (e) => {
    e.stopPropagation(); // Prevent triggering the click to open file dialog
    onChange('thumbnail', null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // --- Drag & Drop Generic Events ---
  const handleDrag = useCallback((e, type, isOver) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState(prev => ({ ...prev, [type]: isOver }));
  }, []);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState(prev => ({ ...prev, [type]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (type === 'image') processImage(e.dataTransfer.files[0]);
      if (type === 'pdf') processPdfs(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [media.pdfs]); // Included dependencies

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[4px] shadow-sm overflow-hidden border-t-2 border-tertiary">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-5 bg-surface-container-low/40 border-b border-outline-variant/20">
        <div className="w-1 h-5 bg-tertiary rounded-full"></div>
        <h3 className="font-display font-bold text-lg text-primary">
          غلاف الدرس والمصادر التعليمية
        </h3>
      </div>

      <div className="p-6 space-y-8">
        
        {/* --- 1. Course Thumbnail Dropzone --- */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <label className="block text-sm font-bold text-on-surface flex items-center gap-1">
              <span>الصورة البارزة (الغلاف)</span>
              <span className="text-error font-sans">*</span>
            </label>
            <span className="text-xs text-on-surface-variant font-mono">Max: 2MB (JPG, PNG)</span>
          </div>



        <div 
          onDragOver={(e) => handleDrag(e, 'image', true)}
          onDragLeave={(e) => handleDrag(e, 'image', false)}
          onDrop={(e) => handleDrop(e, 'image')}
          onClick={() => !media.thumbnail && !existingImageUrl && imageInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-[4px] transition-all duration-300 flex flex-col items-center justify-center overflow-hidden bg-surface-container-lowest hover:bg-surface-container-low min-h-[200px] ${
            dragState.image ? 'border-primary bg-primary-container/10 scale-[1.01]' : 'border-outline-variant/50'
          } ${(media.thumbnail || existingImageUrl) ? 'border-none p-0 cursor-default' : 'p-8 cursor-pointer hover:border-primary/50'}`}
        >
          <input 
            type="file" 
            accept="image/jpeg, image/png"
            onChange={(e) => processImage(e.target.files[0])}
            className="hidden"
            ref={imageInputRef}
          />

          {media.thumbnail || existingImageUrl ? (
            <div className="relative w-full h-full group">
              <img 
                src={media.thumbnail ? URL.createObjectURL(media.thumbnail) : existingImageUrl} 
                alt="Cover Preview" 
                className="w-full h-[240px] object-cover rounded-[4px]"
              />
              <div className="absolute inset-0 bg-inverse-surface/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[4px] gap-2">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); imageInputRef.current?.click(); }}
                  className="bg-primary text-white px-4 py-2 rounded-[4px] font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  استبدال الصورة
                </button>
                {media.thumbnail && (
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="bg-error text-white px-4 py-2 rounded-[4px] font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    إزالة الصورة
                  </button>
                )}
              </div>
            </div>
          ) : (
            
        
              <>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${dragState.image ? 'bg-primary/20' : 'bg-surface-container-high'}`}>
                  <span className={`material-symbols-outlined text-3xl ${dragState.image ? 'text-primary' : 'text-on-surface-variant'}`}>
                    add_photo_alternate
                  </span>
                </div>
                <p className="text-sm text-on-surface font-bold mb-1">اسحب وأفلت صورة الغلاف هنا</p>
                <p className="text-xs text-on-surface-variant">أو انقر لاختيار ملف من جهازك</p>
              </>
            )}
          </div>
           {errors.image && <p className="mt-2 text-xs text-error font-bold">{errors.image}</p>}
        </div>

        {/* Divider */}
        <hr className="border-outline-variant/20" />

        {/* --- 2. PDF Resources Dropzone --- */}
        <div>
          <div className="flex justify-between items-end mb-3">
            <label className="block text-sm font-bold text-on-surface">
              المصادر المرفقة (ملفات PDF)
            </label>
            <span className="text-xs text-on-surface-variant font-mono">Max: 20MB per file</span>
          </div>

           {existingFiles.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-on-surface-variant mb-2">الملفات المرفوعة حالياً:</p>
              <ul className="space-y-3">
                {existingFiles.map((file) => (
                  <li
                    key={file.id}
                    className="flex justify-between items-center bg-surface-container-low/50 p-3 rounded-[4px] border border-outline-variant/30 group hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                      <span className="text-sm font-bold text-on-surface truncate dir-ltr text-left max-w-[200px] sm:max-w-md">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteExisting && onDeleteExisting(file.id)}
                      className="w-8 h-8 rounded-[4px] flex items-center justify-center text-on-surface-variant hover:bg-red-50 hover:text-error transition-colors"
                      title="حذف الملف"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
           )}

          <div 
            onDragOver={(e) => handleDrag(e, 'pdf', true)}
            onDragLeave={(e) => handleDrag(e, 'pdf', false)}
            onDrop={(e) => handleDrop(e, 'pdf')}
            onClick={() => pdfInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[4px] p-8 text-center transition-all duration-300 cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low ${
              dragState.pdf ? 'border-primary bg-primary-container/10 scale-[1.01]' : 'border-outline-variant/50 hover:border-primary/50'
            }`}
          >
            <input 
              type="file" 
              multiple
              accept="application/pdf"
              onChange={(e) => processPdfs(e.target.files)}
              className="hidden"
              ref={pdfInputRef}
            />
            <span className={`material-symbols-outlined text-4xl mb-3 transition-colors ${dragState.pdf ? 'text-primary' : 'text-outline-variant'}`}>
              picture_as_pdf
            </span>
            <p className="text-sm text-on-surface font-bold mb-1">اسحب وأفلت ملفات PDF هنا</p>
            <p className="text-xs text-on-surface-variant">يمكنك رفع ملفات متعددة (المتن، الشرح، إلخ)</p>
          </div>
          {errors.pdf && <p className="mt-2 text-xs text-error font-bold">{errors.pdf}</p>}

          {/* Uploaded PDFs List */}
          {media.pdfs.length > 0 && (
            <ul className="mt-4 space-y-3">
              {media.pdfs.map((file, index) => (
                <li key={index} className="flex justify-between items-center bg-surface-container-low/50 p-3 rounded-[4px] border border-outline-variant/30 group hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface truncate dir-ltr text-left max-w-[200px] sm:max-w-md">
                        {file.name}
                      </span>
                      <span className="text-xs text-on-surface-variant font-mono">
                        {formatSize(file.size)}
                      </span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removePdf(index); }}
                    className="w-8 h-8 rounded-[4px] flex items-center justify-center text-on-surface-variant hover:bg-red-50 hover:text-error transition-colors"
                    title="حذف الملف"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default CourseMedia;