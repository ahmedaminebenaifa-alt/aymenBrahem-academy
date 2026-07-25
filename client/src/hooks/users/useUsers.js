import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../api/axios';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = useCallback(async (signal) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/users', { signal });
      setUsers(data);
    } catch (err) {
      if (err.code === 'ERR_CANCELED') return;
      setError(err.response?.data?.message || 'فشل في جلب بيانات المستخدمين');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, [fetchUsers]);

  const deleteUser = async (userId) => {
    if (!window.confirm('حذف هذا المستخدم سيمسح جميع بياناته نهائياً. هل أنت متأكد؟')) return;

    const previousUsers = [...users];
    setUsers(users.filter((user) => user.id !== userId));

    try {
      await api.delete(`/users/${userId}`);
    } catch (err) {
      alert('تعذر حذف المستخدم حالياً. تم التراجع عن الإجراء.');
      setUsers(previousUsers);
    }
  };

  const stats = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((u) => u.role === 'طالب').length,
      admins: users.filter((u) => u.role === 'مدير النظام').length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = activeRoleFilter === 'الكل' || user.role === activeRoleFilter;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower));
      return matchesRole && matchesSearch;
    });
  }, [users, activeRoleFilter, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeRoleFilter]);

  return {
    users: paginatedUsers,
    totalFiltered: filteredUsers.length,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    activeRoleFilter,
    setActiveRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    stats,
    deleteUser,
    refreshUsers: fetchUsers,
  };
};