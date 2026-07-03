import React, { useState, useEffect } from 'react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch('http://localhost:3000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
             throw new Error('غير مصرح لك. تأكد من تسجيل الدخول كمسؤول.');
          }
          throw new Error('فشل في جلب بيانات الطلاب');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="users-section-dashboard">
      <h2>الطلاب المسجلون</h2>
      <p className="section-subtitle">قائمة بجميع المستخدمين المسجلين في الأكاديمية.</p>
      
      <div className="table-responsive">
        {isLoading && <div className="no-courses">جاري تحميل البيانات...</div>}
        {error && <div className="no-courses" style={{ color: '#d9534f' }}>خطأ: {error}</div>}
        
        {!isLoading && !error && users.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>المعرف (ID)</th>
                <th>البريد الإلكتروني</th>
                <th>تاريخ الميلاد</th>
                <th>الدور</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="user-name">{user.id}</td>
                  <td>{user.email}</td>
                  <td dir="ltr">{new Date(user.birthDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${user.role === 'ADMIN' ? 'status-active' : 'status-blocked'}`}>
                      {user.role === 'ADMIN' ? 'مدير' : 'طالب'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && !error && users.length === 0 && (
          <div className="no-courses">لا يوجد طلاب مسجلين حتى الآن.</div>
        )}
      </div>
    </section>
  );
};

export default UsersList;