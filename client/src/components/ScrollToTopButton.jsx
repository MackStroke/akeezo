import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
  const location = useLocation();

  // Hide the button on admin routes since they usually have their own scrolling containers
  const isAdmin = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // Show button after 5% scroll
      if (latest > 0.05) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdmin) return null;

  return (
    <motion.button
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8, 
        y: isVisible ? 0 : 20 
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        cn(
          'fixed z-[99] flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-xl ring-1 ring-black/5 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group',
          isHomePage ? 'bottom-[8.5rem] right-4' : 'bottom-6 right-6'
        ),
        !isVisible && 'pointer-events-none'
      )}
      aria-label="Scroll to top"
    >
      <svg className="absolute inset-0 size-full -rotate-90 transform p-[2px]" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-slate-100 dark:text-slate-800"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-primary opacity-90 transition-opacity group-hover:opacity-100"
          style={{ pathLength }}
        />
      </svg>
      <ArrowUp className="relative z-10 size-5 transition-transform group-hover:-translate-y-0.5" strokeWidth={2.5} />
    </motion.button>
  );
}
