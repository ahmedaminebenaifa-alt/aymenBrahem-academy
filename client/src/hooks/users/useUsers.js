import { useState, useEffect, useMemo, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/users` 
  : 'http://localhost:5000/api/users';

export const useUsers = () => {
  // 1. Core Data State Management
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. Filters, Search, and Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of users per page

  // 3. Fetch Data with AbortController for memory leak prevention
  const fetchUsers = useCallback(async (signal) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal // Attach the abort signal to the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users data');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 4. Trigger fetch on component mount
  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    
    return () => {
      controller.abort(); // Cleanup the request if the component unmounts early
    };
  }, [fetchUsers]);

  // 5. Delete User (Optimistic UI Update)
  const deleteUser = async (userId) => {
    if (!window.confirm('Deleting this user will permanently erase all their data. Are you sure?')) return;

    // Save previous state for rollback in case of failure
    const previousUsers = [...users];
    
    // Optimistically update the UI immediately
    setUsers(users.filter(user => user.id !== userId));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete user');
    } catch (err) {
      // Revert to previous state if the API request fails
      alert('Unable to delete the user right now. The action has been reverted.');
      setUsers(previousUsers);
    }
  };

  // 6. Smart Data Processing (Stats, Filtering, and Pagination)
  const stats = useMemo(() => {
    return {
      total: users.length,
      // Fixed to match the exact roles mapped from your Prisma schema
      students: users.filter(u => u.role === 'طالب').length,
      admins: users.filter(u => u.role === 'مدير النظام').length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRole = activeRoleFilter === 'الكل' || user.role === activeRoleFilter;
      const searchLower = searchQuery.toLowerCase();
      
      // Search covers both name and email
      const matchesSearch = 
        (user.name && user.name.toLowerCase().includes(searchLower)) || 
        (user.email && user.email.toLowerCase().includes(searchLower));

      return matchesRole && matchesSearch;
    });
  }, [users, activeRoleFilter, searchQuery]);

  // Extract only the users for the current page
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // 7. Reset to the first page whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeRoleFilter]);

  return {
    // Data
    users: paginatedUsers,
    totalFiltered: filteredUsers.length,
    isLoading,
    error,
    
    // Search & Filtering
    searchQuery,
    setSearchQuery,
    activeRoleFilter,
    setActiveRoleFilter,
    
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    
    // Actions & Stats
    stats,
    deleteUser,
    refreshUsers: fetchUsers // Utility to manually re-fetch data if needed
  };
};