import { useState, useEffect } from 'react';
import axios from '../api/axios';

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    studentsTrend: 0,
    activeCourses: 0,
    coursesInPrep: 0,
    newEnrollments: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/dashboard/stats');
        
        if (response.data?.status === 'success') {
          setStats(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'فشل في جلب الإحصائيات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
};