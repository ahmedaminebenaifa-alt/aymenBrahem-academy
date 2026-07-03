import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, sortBy, setSortBy }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', backgroundColor: '#fff', padding: '1.2rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '2rem', alignItems: 'center' }}>
      
      {/* Search Input */}
      <div style={{ flex: 2, minWidth: '260px', position: 'relative' }}>
        <input
          type="text"
          placeholder="🔍 ابحث عن منهج بالاسم أو كلمات الوصف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            &times;
          </button>
        )}
      </div>

      {/* Sort Dropdown */}
      <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label style={{ fontWeight: 'bold', color: '#555', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>ترتيب حسب:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '0.9rem', cursor: 'pointer', outline: 'none' }}
        >
          <option value="default">الافتراضي</option>
          <option value="title-az">الاسم (أ - ي)</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
          <option value="age-asc">العمر: الفئات الأصغر أولاً</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;