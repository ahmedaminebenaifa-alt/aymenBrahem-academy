import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(min-width: 768px)');
    const handleChange = (e) => setIsOpen(e.matches);

    // set initial state based on current viewport
    setIsOpen(mql.matches);

    // Attach listener (support older browsers using addListener/removeListener)
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleChange);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(handleChange);
    }

    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', handleChange);
      } else if (typeof mql.removeListener === 'function') {
        mql.removeListener(handleChange);
      }
    };
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within a SidebarProvider');
  return ctx;
}