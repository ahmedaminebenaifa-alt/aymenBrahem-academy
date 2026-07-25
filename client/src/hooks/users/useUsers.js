import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';

const fetchUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const useUsers = () => {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: (userId) => api.delete(`/users/${userId}`),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previous = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old = []) => old.filter((u) => u.id !== userId));
      return { previous };
    },
    onError: (err, _userId, context) => {
      alert('تعذر حذف المستخدم حالياً. تم التراجع عن الإجراء.');
      queryClient.setQueryData(['users'], context.previous);
    },
  });

  const deleteUser = (userId) => {
    if (!window.confirm('حذف هذا المستخدم سيمسح جميع بياناته نهائياً. هل أنت متأكد؟')) return;
    deleteMutation.mutate(userId);
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

  // Reset to page 1 when filters change — derived directly instead of a
  // separate useEffect, since currentPage can just be clamped on read
  const safePage = useMemo(() => {
    const maxPage = Math.max(Math.ceil(filteredUsers.length / itemsPerPage), 1);
    return Math.min(currentPage, maxPage);
  }, [currentPage, filteredUsers.length]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, safePage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const setSearchQueryAndResetPage = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const setActiveRoleFilterAndResetPage = (value) => {
    setActiveRoleFilter(value);
    setCurrentPage(1);
  };

  return {
    users: paginatedUsers,
    totalFiltered: filteredUsers.length,
    isLoading,
    error: error ? (error.response?.data?.message || 'فشل في جلب بيانات المستخدمين') : null,
    searchQuery,
    setSearchQuery: setSearchQueryAndResetPage,
    activeRoleFilter,
    setActiveRoleFilter: setActiveRoleFilterAndResetPage,
    currentPage: safePage,
    setCurrentPage,
    totalPages,
    stats,
    deleteUser,
    refreshUsers: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  };
};