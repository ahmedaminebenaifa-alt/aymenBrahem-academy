import React from 'react';

export default function Loader() {
  return (
    <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center bg-surface-container-lowest">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner using your theme colors (primary and gold/tertiary) */}
        <div className="w-12 h-12 rounded-full border-4 border-outline-variant/30 border-t-primary animate-spin"></div>
        <p className="text-sm font-bold font-arabic text-on-surface-variant animate-pulse">
          جاري التحميل...
        </p>
      </div>
    </div>
  );
}