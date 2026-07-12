import React from 'react';

// استدعاء الـ Hook المسؤول عن المنطق
import { useUsers } from '../../../hooks/users/useUsers';

// استدعاء المكونات الفرعية التي قمنا ببنائها
import UserStatsGrid from '../../../components/dashboard/admin/users/UserStatsGrid';
import UserSearchAndFilters from '../../../components/dashboard/admin/users/UserSearchAndFilters';
import UserTable from '../../../components/dashboard/admin/users/UserTable';
import UserPagination from '../../../components/dashboard/admin/users/UserPagination';

const UserManagerPage = () => {
  // 1. استخراج كل البيانات والوظائف من الـ Hook المركزي
  const {
    users,
    totalFiltered,
    isLoading,
    error,
    stats,
    searchQuery,
    setSearchQuery,
    activeRoleFilter,
    setActiveRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    toggleUserStatus,
    deleteUser
  } = useUsers();

  // 2. منطق ذكي لتحديد سبب فراغ الجدول (هل هو بسبب البحث أم لا توجد بيانات أصلاً؟)
  const isSearchEmpty = totalFiltered === 0 && (searchQuery !== '' || activeRoleFilter !== 'الكل');

  // 3. دوال الإجراءات السريعة
  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveRoleFilter('الكل');
  };

  const handleAddUser = () => {
    // هنا سيتم لاحقاً فتح نافذة (Modal) إضافة مستخدم جديد
    alert('سيتم فتح نافذة "إضافة مستخدم جديد" قريباً!');
  };

  return (
    <div className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto animate-fade-in">
        
        {/* ----------------- رأس الصفحة (Header) ----------------- */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              إدارة المستخدمين
            </h1>
            <p className="text-sm text-on-surface-variant font-sans">
              التحكم الكامل في حسابات الطلاب، المشرفين، وصلاحيات النظام.
            </p>
          </div>

          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-[4px] font-bold text-sm shadow-md shadow-primary/20 hover:opacity-95 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            إضافة مستخدم جديد
          </button>
        </header>

        {/* ----------------- شبكة الإحصائيات ----------------- */}
        <UserStatsGrid stats={stats} isLoading={isLoading} />

        {/* ----------------- منطقة التحكم والجدول ----------------- */}
        <section className="bg-surface-container-lowest rounded-[4px] border border-outline-variant/30 shadow-sm p-4 sm:p-6 mb-8 relative z-10">
          
          <UserSearchAndFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeRoleFilter={activeRoleFilter}
            setActiveRoleFilter={setActiveRoleFilter}
          />

          <UserTable 
            users={users}
            isLoading={isLoading}
            error={error}
            isSearchEmpty={isSearchEmpty}
            onClearFilters={handleClearFilters}
            onAddUser={handleAddUser}
            onToggleStatus={toggleUserStatus}
            onDelete={deleteUser}
          />

          <UserPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

        </section>

        {/* ----------------- لمسة بصرية إسلامية في التذييل ----------------- */}
        <div className="mt-16 flex justify-center opacity-10 pointer-events-none select-none">
          {/* نجمة الربع حزب (Rub el Hizb) مأخوذة من ملف التصميم الخاص بك */}
          <div className="w-24 h-24 bg-primary relative rotate-45 rounded-[4px] before:content-[''] before:absolute before:inset-0 before:bg-primary before:rotate-45 before:rounded-[4px]"></div>
        </div>

      </div>
    </div>
  );
};

export default UserManagerPage;