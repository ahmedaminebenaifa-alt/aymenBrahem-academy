import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';

const POLL_INTERVAL = 15000;

const initialSession = { isActive: false, title: null, roomName: null, startedAt: null, host: null };

export default function useLiveSession() {
  const [session, setSession] = useState(initialSession);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchSession = useCallback(async () => {
    try {
      const { data } = await api.get('/live');
      setSession({
        isActive: data.isActive,
        title: data.session?.title || null,
        roomName: data.session?.roomName || null,
        startedAt: data.session?.startedAt || null,
        host: data.session?.host || null,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
    intervalRef.current = setInterval(fetchSession, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchSession]);

  const startLive = async (title, courseId) => {
    try {
      const { data } = await api.post('/live/start', { title, courseId });
      await fetchSession();
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const endLive = async () => {
    try {
      await api.post('/live/end', {});
      setSession(initialSession);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  return { ...session, loading, error, startLive, endLive, refreshSession: fetchSession };
}