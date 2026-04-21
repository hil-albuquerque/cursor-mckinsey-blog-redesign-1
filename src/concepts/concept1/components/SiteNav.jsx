import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import McKinseyLogo from '../../../components/McKinseyLogo.jsx';

const NAV_ITEMS = [
  { label: 'Overview', href: '#' },
  { label: 'Who we are', href: '#', hasDropdown: true },
  { label: 'Our commitments', href: '#', hasDropdown: true },
  { label: 'How we work', href: '#', hasDropdown: true },
  { label: 'Alumni', href: '#' },
  { label: 'Locations', href: '#' },
  { label: 'Media', href: '#' },
  { label: 'McKinsey Blog', href: '#', active: true },
];

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <path d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="10.5" cy="10.5" r="7.5" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="ml-0.5">
      <path d="M3 4.5l3 3 3-3" />
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
      className="sticky top-0 z-50 border-b border-[#d9d9d9] bg-white"
      initial={{ y: 0 }}
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      role="banner"
    >
      <div className="mx-auto flex max-w-[1440px] items-center px-4 sm:px-6 lg:px-10">
        {/* Hamburger */}
        <button
          type="button"
          className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center text-mckinsey-blue transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2 lg:mr-5"
          aria-label="Menu"
        >
          <HamburgerIcon />
        </button>

        {/* Logo */}
        <Link
          to="/concept-1"
          className="mr-6 shrink-0 text-mckinsey-blue transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2 lg:mr-8"
          aria-label="McKinsey & Company — Home"
        >
          <McKinseyLogo className="h-[34px] w-[110px] sm:h-[36px] sm:w-[120px]" color="#051C2C" />
        </Link>

        {/* Section context + nav items */}
        <div className="hidden flex-1 lg:block">
          <p className="pt-2 font-sans text-[11px] font-bold leading-none tracking-wide text-mckinsey-text">
            About Us
          </p>
          <nav className="flex items-center gap-0 pb-0 pt-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative inline-flex items-center border-b-2 px-2.5 py-3 font-sans text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2 ${
                  item.active
                    ? 'border-mckinsey-accent font-medium text-mckinsey-accent'
                    : 'border-transparent text-mckinsey-text-secondary hover:text-mckinsey-blue'
                }`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown />}
              </a>
            ))}
          </nav>
        </div>

        {/* Right side: Sign In | Subscribe + Search */}
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-1 font-sans text-[13px] text-mckinsey-accent sm:flex">
            <a href="#" className="transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2">
              Sign In
            </a>
            <span className="text-mckinsey-text-tertiary">|</span>
            <a href="#" className="transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2">
              Subscribe
            </a>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-mckinsey-blue transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
