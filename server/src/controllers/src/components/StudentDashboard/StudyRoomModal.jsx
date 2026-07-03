import React, { useState, useEffect } from 'react';

const StudyRoomModal = ({ course, onClose }) => {
  const [activePreviewFile, setActivePreviewFile] = useState(null);

  useEffect(() => {
    if (course && course.files && course.files.length > 0) {
      setActivePreviewFile(course.files[0]);
    } else {
      setActivePreviewFile(null);
    }
  }, [course]);

  if (!course) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '14px', width: '90%', maxWidth: '850px', maxHeight: '88vh', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
        
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '15px', left: '15px', border: 'none', background: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#a0aec0' }}
        >
          &times;
        </button>

        <h2 style={{ color: '#2d3748', marginTop: 0, paddingLeft: '2rem' }}>{course.title}</h2>
        <p style={{ color: '#4a5568', fontSize: '1rem', lineHeight: '1.6', margin: '1rem 0' }}>{course.description}</p>
        
        <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0', padding: '0.75rem 1rem', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
          <div><strong>تكلفة الاشتراك:</strong> <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>${course.price}</span></div>
          <div><strong>المستوى المستهدف:</strong> من {course.minAge} إلى {course.maxAge} سنة</div>
        </div>

        <div style={{ marginTop: '1.5rem', borderTop: '2px solid #edf2f7', paddingTop: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>📑 الملفات والمحاضرات المتاحة:</h4>
          
          {course.files && course.files.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                {course.files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setActivePreviewFile(file)}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e0', cursor: 'pointer', fontSize: '0.85rem',
                      backgroundColor: activePreviewFile?.id === file.id ? '#2e7d32' : '#edf2f7',
                      color: activePreviewFile?.id === file.id ? '#fff' : '#4a5568',
                      fontWeight: activePreviewFile?.id === file.id ? 'bold' : 'normal'
                    }}
                  >
                    📖 {file.name}
                  </button>
                ))}
              </div>

              {activePreviewFile && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>الملف النشط: <strong>{activePreviewFile.name}</strong></span>
                    <a 
                      href={`http://localhost:3000${activePreviewFile.url}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: '#1565c0', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem' }}
                    >
                      تحميل الكتاب 📥
                    </a>
                  </div>

                  <div style={{ height: '450px', border: '1px solid #cbd5e0', borderRadius: '8px', overflow: 'hidden' }}>
                    <iframe 
                      src={`http://localhost:3000${activePreviewFile.url}`} 
                      title="Student Classroom View" 
                      width="100%" height="100%" style={{ border: 'none' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: '#a0aec0', fontStyle: 'italic', fontSize: '0.9rem' }}>لا توجد ملفات مرفقة.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyRoomModal;