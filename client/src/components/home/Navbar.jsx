import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية', href: '#home' },
    { id: 'about', label: 'عن الشيخ', href: '#about' },
    { id: 'tracks', label: 'الدورات', href: '#tracks' },
  ];

  useEffect(() => {
    // 1. Handle dynamic background on scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // 2. Handle active section tracking
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const options = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    navLinks.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 h-20 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--outline-variant)]/30 shadow-sm' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-[1280px] mx-auto h-full">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl font-bold text-[var(--primary)]">
            أكاديمية أيمن براهم
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`font-label text-sm transition-all duration-300 pb-1 border-b-2 h-7 flex items-center ${
                  isActive
                    ? 'text-[var(--primary)] border-[var(--primary)] font-bold'
                    : 'text-[var(--on-surface-variant)] border-transparent hover:text-[var(--primary)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex items-center">
          <a
            href="#auth"
            className="bg-[var(--primary)] text-[var(--on-primary)] px-6 py-2 rounded-lg font-label text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            {user ? 'حسابي' : 'تسجيل الدخول'}
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex items-center text-[var(--primary)] focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[var(--surface)] border-b border-[var(--outline-variant)]/30 px-6 py-5 flex flex-col gap-4 shadow-xl animate-fade-up">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-label text-base transition-colors ${
                  isActive
                    ? 'text-[var(--primary)] font-bold'
                    : 'text-[var(--on-surface-variant)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#auth"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-[var(--primary)] text-center text-[var(--on-primary)] px-6 py-3 rounded-lg font-label mt-2 shadow-md"
          >
            {user ? 'حسابي' : 'تسجيل الدخول'}
          </a>
        </div>
      )}
    </nav>
  );
}