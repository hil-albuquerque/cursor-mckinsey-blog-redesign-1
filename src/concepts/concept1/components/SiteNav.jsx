import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import McKinseyLogo from '../../../components/McKinseyLogo.jsx';
import { TOPICS } from '../../../data/content.js';

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
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

function scrollToSectionIfOnConcept1(pathname, elementId, event) {
  if (pathname !== '/concept-1') return;
  const el = document.getElementById(elementId);
  if (el) {
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function SiteNav() {
  const location = useLocation();

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-mckinsey-border/80 bg-mckinsey-surface/85 backdrop-blur-md supports-[backdrop-filter]:bg-mckinsey-surface/75"
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      role="banner"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          to="/concept-1"
          className="shrink-0 text-mckinsey-blue transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
          aria-label="McKinsey Blog — Concept 1 home"
        >
          <McKinseyLogo className="h-6 w-[180px] sm:h-7" color="#051C2C" />
        </Link>
        <nav
          className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label="Topics"
        >
          {TOPICS.map((topic) => (
            <Link
              key={topic.id}
              to="/concept-1"
              onClick={(e) =>
                scrollToSectionIfOnConcept1(location.pathname, `topic-${topic.id}`, e)
              }
              className="rounded-lg px-3 py-2 font-sans text-[13px] font-medium text-mckinsey-text-secondary transition-colors hover:bg-mckinsey-warm hover:text-mckinsey-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
            >
              {topic.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-mckinsey-border bg-mckinsey-surface text-mckinsey-blue transition-colors hover:border-mckinsey-blue-light/35 hover:bg-mckinsey-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
            aria-label="Search articles"
          >
            <SearchIcon />
          </button>
        </div>
      </div>
      <div className="border-t border-mckinsey-border/60 bg-mckinsey-bg/85 px-4 py-2 backdrop-blur-sm lg:hidden">
        <div
          className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Topics"
        >
          {TOPICS.map((topic) => (
            <Link
              key={topic.id}
              to="/concept-1"
              role="listitem"
              onClick={(e) =>
                scrollToSectionIfOnConcept1(location.pathname, `topic-${topic.id}`, e)
              }
              className="shrink-0 rounded-full border border-mckinsey-border bg-mckinsey-surface px-3 py-1.5 font-sans text-xs font-medium whitespace-nowrap text-mckinsey-text-secondary transition-colors hover:border-mckinsey-blue-light/25 hover:bg-mckinsey-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
            >
              {topic.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
