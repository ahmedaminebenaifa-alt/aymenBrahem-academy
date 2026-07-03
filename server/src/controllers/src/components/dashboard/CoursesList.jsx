import React, { useState, useEffect } from 'react';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for handling the modal popup detail view
  const [selectedCourse, setSelectedCourse] = useState(null);

  // CHANGED STATE: Tracks which file inside the course is currently selected for the interactive preview iframe
  const [activePreviewFile, setActivePreviewFile] = useState(null);

  // States for handling inline editing workflows
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: '',
    minAge: '',
    maxAge: ''
  });

  // Fetch all existing courses from the backend database on initial mount
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Opens the detail view modal and prepares data in case user triggers edit mode
  const handleOpenDetails = (course) => {
    setSelectedCourse(course);
    setEditFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      minAge: course.minAge,
      maxAge: course.maxAge
    });
    setIsEditing(false); // Reset editing mode flag

    // CHANGED: Default the preview pane to the first uploaded file attachment if available
    if (course.files && course.files.length > 0) {
      setActivePreviewFile(course.files[0]);
    } else {
      setActivePreviewFile(null);
    }
  };

  // 1. DELETE LOGIC: Kept intact from your original code
  const handleDeleteCourse = async (courseId, e) => {
    e.stopPropagation();
    
    if (!window.confirm("Are you sure you want to permanently delete this course?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(courses.filter(course => course.id !== courseId));
        if (selectedCourse && selectedCourse.id === courseId) {
          setSelectedCourse(null);
        }
        alert("Course deleted successfully!");
      } else {
        alert(data.error || "Failed to delete the course");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("An unexpected error occurred during deletion.");
    }
  };

  // 2. EDIT / UPDATE LOGIC: Kept intact from your original code
  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: editFormData.title,
          description: editFormData.description,
          price: parseFloat(editFormData.price),
          minAge: parseInt(editFormData.minAge),
          maxAge: parseInt(editFormData.maxAge)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(courses.map(c => c.id === selectedCourse.id ? data.course : c));
        setSelectedCourse(data.course); 
        setIsEditing(false); 
        alert("Course updated successfully!");
      } else {
        alert(data.error || "Failed to update the course");
      }
    } catch (err) {
      console.error("Error updating course:", err);
      alert("An unexpected error occurred during updating.");
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  if (loading) return <p>جاري تحميل المناهج...</p>;

  return (
    <div className="courses-section" style={{ marginTop: '2rem' }}>
      <h3>المناهج المتاحة</h3>
      
      {/* Grid displaying active courses */}
      <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="course-card"
            onClick={() => handleOpenDetails(course)}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#fff',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              position: 'relative'
            }}
          >
            <h4>{course.title}</h4>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{course.description.substring(0, 60)}...</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
              <span>السعر: ${course.price}</span>
              <span>العمر: {course.minAge} - {course.maxAge} سنة</span>
            </div>
            
            {/* CHANGED: Checks if the nested files relation contains items instead of matching a scalar field */}
            {course.files && course.files.length > 0 && (
              <span style={{ fontSize: '0.8rem', color: '#2e7d32', display: 'block', marginTop: '0.5rem' }}>
                📄 يحتوي على ({course.files.length}) ملفات منهج
              </span>
            )}
            
            {/* Inline Action Buttons on Card */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); handleOpenDetails(course); setIsEditing(true); }}
                style={{ flex: 1, padding: '0.3rem', backgroundColor: '#0288d1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                تعديل البيانات
              </button>
              <button 
                onClick={(e) => handleDeleteCourse(course.id, e)}
                style={{ flex: 1, padding: '0.3rem', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                حذف المنهج
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL POPUP VIEW */}
      {selectedCourse && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: '#fff', padding: '2rem', borderRadius: '12px',
            width: '90%', maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto', position: 'relative'
          }}>
            {/* Exit Close Button */}
            <button 
              onClick={() => setSelectedCourse(null)} 
              style={{ position: 'absolute', top: '15px', left: '15px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>

            {!isEditing ? (
              <div>
                <h2>{selectedCourse.title}</h2>
                <p style={{ color: '#555', margin: '1rem 0', lineHeight: '1.6' }}>{selectedCourse.description}</p>
                
                <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                  <div><strong>السعر:</strong> ${selectedCourse.price}</div>
                  <div><strong>الفئة العمرية:</strong> من {selectedCourse.minAge} إلى {selectedCourse.maxAge} سنة</div>
                </div>

                {/* CHANGED: MULTI-FILE INTERACTIVE VIEWER CONTAINER */}
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                  <h4>الملفات المرفقة بالمنهج:</h4>
                  
                  {selectedCourse.files && selectedCourse.files.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                      
                      {/* Individual document select tabs */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                        {selectedCourse.files.map((file) => (
                          <button
                            key={file.id}
                            onClick={() => setActivePreviewFile(file)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              cursor: 'pointer',
                              backgroundColor: activePreviewFile?.id === file.id ? '#2e7d32' : '#f5f5f5',
                              color: activePreviewFile?.id === file.id ? '#fff' : '#333',
                              fontWeight: activePreviewFile?.id === file.id ? 'bold' : 'normal'
                            }}
                          >
                            {file.name}
                          </button>
                        ))}
                      </div>

                      {/* Display panel targeting the active document selected above */}
                      {activePreviewFile && (
                        <div>
                          <div style={{ marginBottom: '1rem' }}>
                            <a 
                              href={`http://localhost:3000${activePreviewFile.url}`} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: '#2e7d32', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}
                            >
                              تحميل أو فتح [{activePreviewFile.name}] في صفحة جديدة 📄
                            </a>
                          </div>

                          <div style={{ height: '400px', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden' }}>
                            <iframe 
                              src={`http://localhost:3000${activePreviewFile.url}`} 
                              title="Multi PDF Viewer" 
                              width="100%" 
                              height="100%" 
                              style={{ border: 'none' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>لا يوجد ملفات مرفقة بهذا المنهج حالياً.</p>
                  )}
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setIsEditing(true)} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#0288d1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    تعديل المنهج
                  </button>
                  <button onClick={(e) => handleDeleteCourse(selectedCourse.id, e)} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    حذف المنهج
                  </button>
                </div>
              </div>
            ) : (
              /* ACTIVE EDIT FORM CONTAINER VIEW */
              <form onSubmit={handleUpdateCourse}>
                <h2>تعديل بيانات المنهج</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem' }}>عنوان المنهج</label>
                    <input type="text" name="title" value={editFormData.title} onChange={handleEditInputChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem' }}>وصف المنهج</label>
                    <textarea name="description" value={editFormData.description} onChange={handleEditInputChange} rows="4" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} required></textarea>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.3rem' }}>السعر ($)</label>
                      <input type="number" name="price" value={editFormData.price} onChange={handleEditInputChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} required />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.3rem' }}>أقل عمر</label>
                      <input type="number" name="minAge" value={editFormData.minAge} onChange={handleEditInputChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} required />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.3rem' }}>أقصى عمر</label>
                      <input type="number" name="maxAge" value={editFormData.maxAge} onChange={handleEditInputChange} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} required />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button type="submit" style={{ padding: '0.6rem 1.5rem', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    حفظ التغييرات
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#757575', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    إلغاء التعديل
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;