import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import McKinseyLogo from '../../../components/McKinseyLogo.jsx';

function scrollToSectionIfOnConcept1(pathname, elementId, event) {
  if (pathname !== '/concept-1') return;
  const el = document.getElementById(elementId);
  if (el) {
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function SiteFooter() {
  const location = useLocation();

  return (
    <motion.footer
      className="border-t border-mckinsey-border bg-mckinsey-blue text-white"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link
              to="/concept-1"
              className="inline-block text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-teal focus-visible:ring-offset-2 focus-visible:ring-offset-mckinsey-blue"
              aria-label="McKinsey Blog — Concept 1 home"
            >
              <McKinseyLogo className="h-[36px] w-[120px]" color="#FFFFFF" />
            </Link>
            <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-white/70">
              Ideas and analysis from McKinsey colleagues worldwide—structured for clarity,
              grounded in evidence, and built to support better decisions.
            </p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl tracking-tight text-white">The Week Ahead</h2>
            <p className="mt-2 font-sans text-sm text-white/65">
              A concise briefing of new research, interviews, and events—delivered weekly.
            </p>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter signup"
            >
              <label htmlFor="concept1-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="concept1-newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Work email"
                className="min-h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 font-sans text-sm text-white placeholder:text-white/45 backdrop-blur-sm transition-colors focus:border-mckinsey-teal focus:outline-none focus:ring-2 focus:ring-mckinsey-teal/40"
              />
              <button
                type="submit"
                className="min-h-12 shrink-0 rounded-xl bg-white px-8 font-sans text-sm font-semibold text-mckinsey-blue transition-colors hover:bg-mckinsey-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-teal focus-visible:ring-offset-2 focus-visible:ring-offset-mckinsey-blue"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 font-sans text-xs text-white/45">
              By subscribing you agree to receive editorial updates. You can unsubscribe at any time.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-8 font-sans text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} McKinsey & Company. Concept exploration.</p>
          <nav className="flex flex-wrap gap-4" aria-label="Footer">
            <Link
              to="/concept-1"
              onClick={(e) => scrollToSectionIfOnConcept1(location.pathname, 'top', e)}
              className="transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-teal focus-visible:ring-offset-2 focus-visible:ring-offset-mckinsey-blue"
            >
              Back to top
            </Link>
            <span aria-hidden className="text-white/25">
              |
            </span>
            <Link
              to="/concept-1"
              onClick={(e) => scrollToSectionIfOnConcept1(location.pathname, 'trending', e)}
              className="transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-teal focus-visible:ring-offset-2 focus-visible:ring-offset-mckinsey-blue"
            >
              Trending
            </Link>
          </nav>
        </div>
      </div>
    </motion.footer>
  );
}
