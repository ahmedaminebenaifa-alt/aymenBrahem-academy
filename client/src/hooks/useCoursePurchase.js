import { useState } from 'react';
import api from '../api/axios';

export function useCoursePurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const purchase = async (courseId, note) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/orders', { courseId, note });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'حدث خطأ أثناء إرسال طلب الشراء';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { purchase, loading, error };
}