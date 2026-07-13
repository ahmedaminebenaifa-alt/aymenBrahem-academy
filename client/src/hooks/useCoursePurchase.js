import { useState } from 'react';
import api from '../api/axios';

export function useCoursePurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const purchase = async (courseId, method, transferReference) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/orders', { courseId, method, transferReference });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'حدث خطأ أثناء إنشاء طلب الشراء';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { purchase, loading, error };
}