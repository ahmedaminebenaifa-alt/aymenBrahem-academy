import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import api from '../api/axios';

const fetchSearchResults = async (query) => {
  const { data } = await api.get('/courses/search', { params: { q: query } });
  return data.data;
};

export function useCourseSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350);
  const trimmed = debouncedQuery.trim();

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['courseSearch', trimmed],
    queryFn: () => fetchSearchResults(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 30 * 1000, // repeating an earlier search within 30s won't re-hit the network
  });

  const clear = () => setQuery('');

  return { query, setQuery, results, loading: isFetching, clear };
}