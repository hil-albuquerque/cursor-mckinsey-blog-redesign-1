import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import McKinseyLogo from '../../../components/McKinseyLogo.jsx';

const NAV_ITEMS = [
  { label: 'Industries', href: '#' },
  { label: 'Capabilities', href: '#' },
  { label: 'Featured Insights', href: '#trending' },
  { label: 'Careers', href: '#' },
  { label: 'About Us', href: '#' },
];

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export default function SiteNav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const threshold = 8;

  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - lastY.current;
    if (y < 60) {
      setHidden(false);
    } else if (delta > threshold) {
      setHidden(true);
    } else if (delta < -threshold) {
      setHidden(false);
    }
    lastY.current = y;
  });

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-mckinsey-border/70 bg-mckinsey-surface/92 backdrop-blur-lg supports-[backdrop-filter]:bg-mckinsey-surface/80"
      initial={{ y: 0 }}
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      role="banner"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-3.5 sm:px-6 lg:px-10">
        <Link
          to="/concept-1"
          className="shrink-0 text-mckinsey-blue transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
          aria-label="McKinsey & Company — Home"
        >
          <McKinseyLogo className="h-5 w-[160px] sm:h-[22px] sm:w-[170px]" color="#051C2C" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-md px-3 py-1.5 font-sans text-[13px] font-medium text-mckinsey-text-secondary transition-colors hover:text-mckinsey-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-mckinsey-text-secondary transition-colors hover:bg-mckinsey-warm hover:text-mckinsey-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-mckinsey-text-secondary transition-colors hover:bg-mckinsey-warm hover:text-mckinsey-blue lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
