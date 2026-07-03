import React, { useState } from 'react';

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    minAge: '',
    maxAge: ''
  });
  
  // 1. CHANGED STATE: Changed from a single null file to an empty file array
  const [pdfFiles, setPdfFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  // 2. CHANGED HANDLER: Captures multiple selected files and turns them into a standard JavaScript array
  const handleFileChange = (e) => {
    if (e.target.files) {
      setPdfFiles(Array.from(e.target.files)); 
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: 'loading', text: 'Publishing course and uploading files...' });

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('price', parseFloat(courseData.price));
      formData.append('minAge', parseInt(courseData.minAge));
      formData.append('maxAge', parseInt(courseData.maxAge));
      
      // 3. MULTI-FILE APPEND: Loop through the array and append each file using the identical key name: 'files'
      pdfFiles.forEach((file) => {
        formData.append('files', file); 
      });

      const response = await fetch('http://localhost:3000/courses', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData 
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to publish course');

      setStatusMessage({ type: 'success', text: `Course published successfully with ${pdfFiles.length} files!` });
      
      // Reset forms and array states
      setCourseData({ title: '', description: '', price: '', minAge: '', maxAge: '' });
      setPdfFiles([]);
      const fileInputDom = document.getElementById('files-input');
      if (fileInputDom) fileInputDom.value = '';
      
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <section className="admin-panel-section">
      <div className="admin-card">
        <h2>إضافة منهج جديد</h2>
        <p className="admin-subtitle">قم بتعبئة التفاصيل لنشر دورة جديدة للطلاب.</p>
        
        {statusMessage.text && (
          <div style={{ 
            padding: '1rem', marginBottom: '1rem', borderRadius: '6px',
            backgroundColor: statusMessage.type === 'error' ? '#ffebee' : '#e8f5e9',
            color: statusMessage.type === 'error' ? '#c62828' : '#2e7d32'
          }}>{statusMessage.text}</div>
        )}

        <form className="admin-form" onSubmit={handleAddCourse}>
          <div className="admin-form-row">
            <div className="form-group-footer flex-1">
              <label>عنوان المنهج</label>
              <input type="text" name="title" value={courseData.title} onChange={handleChange} required />
            </div>
            <div className="form-group-footer flex-small">
              <label>السعر ($)</label>
              <input type="number" name="price" value={courseData.price} onChange={handleChange} required />
            </div>
            <div className="form-group-footer flex-small">
              <label>أقل عمر</label>
              <input type="number" name="minAge" value={courseData.minAge} onChange={handleChange} required />
            </div>
            <div className="form-group-footer flex-small">
              <label>أقصى عمر</label>
              <input type="number" name="maxAge" value={courseData.maxAge} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group-footer">
            <label>وصف المنهج</label>
            <textarea name="description" value={courseData.description} onChange={handleChange} rows="4" required></textarea>
          </div>

          {/* 4. MODIFIED INPUT FIELD: Added 'multiple' attribute to allow selecting multiple files at once */}
          <div className="form-group-footer" style={{ marginTop: '1rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
              ملفات المنهج (PDF) - يمكنك اختيار أكثر من ملف
            </label>
            <input 
              id="files-input"
              type="file" 
              accept=".pdf" 
              multiple // 👈 Allows picking multiple documents at once
              onChange={handleFileChange}
              style={{ padding: '0.5rem', border: '1px dashed #ccc', borderRadius: '6px', width: '100%', backgroundColor: '#fafafa', cursor: 'pointer' }}
            />
            {pdfFiles.length > 0 && (
              <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.5rem' }}>
                عدد الملفات المختارة: <strong>{pdfFiles.length}</strong>
              </p>
            )}
          </div>

          <button type="submit" className="admin-submit-btn" style={{ marginTop: '1.5rem' }}>نشر المنهج</button>
        </form>
      </div>
    </section>
  );
};

export default AddCourse;