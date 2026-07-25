import React from 'react';
import UserEmptyState from './UserEmptyState';

const UserTable = ({ 
  users, 
  isLoading, 
  error, 
  isSearchEmpty, 
  onClearFilters,
  onAddUser,
  onToggleStatus, 
  onDelete 
}) => {


  const getRoleStyles = (role) => {
    switch (role) {
      case 'مدير النظام':
        return 'bg-tertiary-container/20 text-on-tertiary-container border-tertiary-container/30';
      case 'مشرف أكاديمي':
        return 'bg-secondary-container text-on-secondary-container border-secondary-container/50';
      case 'طالب':
      default:
        return 'bg-primary/5 text-primary border-primary/10';
    }
  };

  const getStatusStyles = (status) => {
    return status === 'نشط' 
      ? 'bg-surface-tint/10 text-surface-tint border-surface-tint/20' 
      : 'bg-red-50 text-red-600 border-red-100';
  };

  if (!isLoading && !error && users.length === 0) {
    return (
      <UserEmptyState 
        isSearchEmpty={isSearchEmpty} 
        onClearFilters={onClearFilters} 
        onAddUser={onAddUser} 
      />
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-[4px] border border-outline-variant/30 shadow-sm overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant w-1/3">المستخدم</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant">الصلاحية</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant">حالة الحساب</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant">تاريخ الانضمام</th>
              <th className="py-4 px-6 text-xs font-bold text-on-surface-variant text-left">الإجراءات</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-outline-variant/10">
            

            {isLoading && Array.from({ length: 5 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className="animate-pulse">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-outline-variant/20 rounded-[4px]"></div>
                    <div className="space-y-2">
                      <div className="h-3.5 bg-outline-variant/20 rounded-[4px] w-32"></div>
                      <div className="h-3 bg-outline-variant/20 rounded-[4px] w-24"></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6"><div className="h-6 bg-outline-variant/20 rounded-[4px] w-20"></div></td>
                <td className="py-4 px-6"><div className="h-6 bg-outline-variant/20 rounded-[4px] w-16"></div></td>
                <td className="py-4 px-6"><div className="h-4 bg-outline-variant/20 rounded-[4px] w-24"></div></td>
                <td className="py-4 px-6"><div className="h-6 bg-outline-variant/20 rounded-[4px] w-24 mr-auto"></div></td>
              </tr>
            ))}


            {!isLoading && error && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-error font-bold text-sm bg-error-container/10">
                  <span className="material-symbols-outlined block text-3xl mb-2">error</span>
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && users.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-surface-container-low/40 hover:scale-[1.002] transition-all duration-200 group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-container-high border border-outline-variant/30 rounded-[4px] flex items-center justify-center font-bold text-primary font-display">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-on-surface leading-tight group-hover:text-primary transition-colors">
                        {user.name}
                      </p>
                      <p className="text-xs text-on-surface-variant/70 mt-0.5 font-sans">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-[4px] text-xs font-bold border ${getRoleStyles(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                
                

                <td className="py-4 px-6 text-xs text-on-surface-variant font-sans">
                  {new Date(user.joinDate).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>

                <td className="py-4 px-6 text-left">
                  <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    
                    <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-[4px] transition-all" title="تعديل بيانات المستخدم">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    
                   

                    <button 
                      onClick={() => onDelete(user.id)}
                      className="p-1.5 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-[4px] transition-all" 
                      title="حذف المستخدم نهائياً"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;