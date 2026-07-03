import React from 'react';
import AddCourse from './dashboard/AddCourse';
import UsersList from './dashboard/UsersList';
import CoursesList from './dashboard/CoursesList';
import './Dashboard.css'; 

const Dashboard = ({ user, setUser }) => {
  return (
    <div className="app-layout">
      {/* Forwarding props to your navigation bar */}
      

      <main className="dashboard-main">
        <div className="welcome-banner">
          <h1>مرحباً بك يا شيخ</h1>
          <p>هذه لوحة التحكم الخاصة بك. يمكنك إضافة مناهج جديدة وإدارة المنصة من هنا.</p>
        </div>

        {/* Form to add a new course */}
        <AddCourse />
        
        {/* Table of all registered users */}
        <UsersList />

        {/* Grid of all active courses */}
        <CoursesList />

      </main>
    </div>
  );
};

export default Dashboard;