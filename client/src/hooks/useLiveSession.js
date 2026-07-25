import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';

const POLL_INTERVAL = 15000;
const initialSession = { isActive: false, title: null, roomName: null, startedAt: null, host: null };

export default function useLiveSession() {
  const [session, setSession] = useState(initialSession);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchSession = useCallback(async (signal) => {
    try {
      // Pass the signal to axios to allow cancellation
      const { data } = await api.get('/live', { signal });
      setSession({
        isActive: data.isActive,
        title: data.session?.title || null,
        roomName: data.session?.roomName || null,
        startedAt: data.session?.startedAt || null,
        host: data.session?.host || null,
      });
      setError(null);
    } catch (err) {
      if (err.name === 'CanceledError') return; // Ignore aborted requests on unmount
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    
    // Initial fetch
    fetchSession(controller.signal);
    
    // Setup polling
    intervalRef.current = setInterval(() => {
      fetchSession(controller.signal);
    }, POLL_INTERVAL);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalRef.current);
      controller.abort(); 
    };
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
      await api.post('/live/end');
      setSession(initialSession);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  // Centralized methods for the Raise Hand feature
  const toggleRaiseHand = async (isRaised) => {
    return api.post('/live/raise-hand', { isRaised });
  };

  const approveStudentMic = async (identity) => {
    return api.post('/live/approve-mic', { identity });
  };

  return { 
    ...session, 
    loading, 
    error, 
    startLive, 
    endLive, 
    refreshSession: fetchSession,
    toggleRaiseHand,
    approveStudentMic
  };
}