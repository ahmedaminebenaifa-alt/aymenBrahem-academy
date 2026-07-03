import React, { useState, useEffect } from 'react';
import WelcomeBanner from './WelcomeBanner';
import SearchBar from './SearchBar';
import CourseCard from './CourseCard';
import StudyRoomModal from './StudyRoomModal';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [studentAge, setStudentAge] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // UX Filter Control States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchStudentFeed = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/my-courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
          setCourses(data.availableCourses || []);
          setStudentAge(data.yourAge);
        }
      } catch (err) {
        console.error("Dashboard engine failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentFeed();
  }, []);

  // Search filter mechanism logic computation
  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    );
  });

  // Sort sequencing mechanism logic computation
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'age-asc': return a.minAge - b.minAge;
      case 'title-az': return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

  if (loading) {
    return <div className="loading-spinner-fallback">جاري تحميل منصتك التعليمية... 📚</div>;
  }

  return (
    
    <div className="student-dashboard-root">
       
      <WelcomeBanner studentAge={studentAge} />
      
      <SearchBar 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        sortBy={sortBy} setSortBy={setSortBy}
      />

      <div style={{ marginBottom: '1rem', color: '#777', fontSize: '0.9rem' }}>
        تم العثور على <strong>{sortedCourses.length}</strong> منهج تعليمي.
      </div>

      {sortedCourses.length > 0 ? (
        <div className="programs-grid-layout">
          {sortedCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onOpen={(c) => setSelectedCourse(c)} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-results-fallback">
          لا توجد نتائج تطابق بحثك حالياً. جرب كتابة كلمات مختلفة! 🔍
        </div>
      )}

      {selectedCourse && (
        <StudyRoomModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)} 
        />
      )}
    </div>
  );
};

export default StudentDashboard;