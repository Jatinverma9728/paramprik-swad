import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const ScrollToTopButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-[50px] left-8 bg-amber-500 text-white p-4 rounded-full shadow-xl hover:bg-amber-600 transition-all duration-300 transform z-[9999] ${
        showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
      style={{ backdropFilter: 'blur(8px)' }}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-8 w-8" strokeWidth={2.5} />
    </button>
  );
};
