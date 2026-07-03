import React from 'react';

const CourseCard = ({ course, onOpen }) => {
  return (
    <div 
      className="student-course-card"
      onClick={() => onOpen(course)}
      style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem', backgroundColor: '#fff', boxShadow: '0 3px 6px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.2rem' }}>{course.title}</h3>
        <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
          {course.description.length > 120 ? `${course.description.substring(0, 120)}...` : course.description}
        </p>
      </div>

      <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '0.75rem', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
          <span style={{ color: '#2e7d32', fontWeight: 'bold', backgroundColor: '#e8f5e9', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
            السعر: ${course.price}
          </span>
          <span style={{ color: '#4a5568', fontWeight: '500' }}>
            مناسب للأعمار: {course.minAge} - {course.maxAge} سنة
          </span>
        </div>

        {course.files && course.files.length > 0 ? (
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1565c0', fontSize: '0.8rem', fontWeight: 'bold' }}>
            📄 يحتوي على ({course.files.length}) ملفات دراسية
          </div>
        ) : (
          <div style={{ marginTop: '0.75rem', color: '#a0aec0', fontSize: '0.8rem', fontStyle: 'italic' }}>
            ⚠️ لا توجد ملفات مرفقة حالياً
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;