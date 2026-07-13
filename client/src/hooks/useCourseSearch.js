import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export function useCourseSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get('/courses/search', { params: { q: query } });
        setResults(data.data);
      } catch (err) {
        console.error('Course search failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const clear = () => {
    setQuery('');
    setResults([]);
  };

  return { query, setQuery, results, loading, clear };
}