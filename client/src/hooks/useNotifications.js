import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';

const POLL_INTERVAL = 20000; // 20s — deliberately separate from useLiveSession's own poll

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
    } catch (err) {
      // fail silently on poll — don't spam the UI with errors for a background refresh
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      // best-effort; next poll will resync truth from the server
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.patch('/notifications/read-all');
    } catch (err) {
      // same — next poll resyncs
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, unreadCount, isLoading, markAsRead, markAllAsRead };
};