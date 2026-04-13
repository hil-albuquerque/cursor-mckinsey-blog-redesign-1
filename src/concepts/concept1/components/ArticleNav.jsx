import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import McKinseyLogo from '../../../components/McKinseyLogo.jsx';
import ShareBar from './ShareBar.jsx';

function ChevronLeft({ className }) {
  return (
    <svg
      className={className}
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default function ArticleNav() {
  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-mckinsey-border/80 bg-mckinsey-surface/85 backdrop-blur-md supports-[backdrop-filter]:bg-mckinsey-surface/75"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      role="banner"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex min-w-0 justify-start">
          <Link
            to="/concept-1"
            className="inline-flex max-w-full items-center gap-1.5 rounded-lg font-sans text-sm font-medium text-mckinsey-text-secondary transition-colors hover:text-mckinsey-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
          >
            <ChevronLeft className="shrink-0 text-mckinsey-text-tertiary" />
            <span className="truncate">Back to stories</span>
          </Link>
        </div>
        <Link
          to="/concept-1"
          className="justify-self-center text-mckinsey-blue transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
          aria-label="McKinsey Blog — Concept 1 home"
        >
          <McKinseyLogo className="h-5 w-[150px] sm:h-6 sm:w-[170px]" color="#051C2C" />
        </Link>
        <div className="flex min-w-0 justify-end overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ShareBar vertical={false} />
        </div>
      </div>
    </motion.header>
  );
}
