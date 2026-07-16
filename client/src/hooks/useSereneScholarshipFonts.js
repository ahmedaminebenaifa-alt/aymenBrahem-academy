import { useEffect } from 'react';

export function useSereneScholarshipFonts() {
  useEffect(() => {
    const id = 'serene-scholarship-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Serif+Arabic:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);
}