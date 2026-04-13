import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';

const iconTap = { scale: 0.94 };

function resolveShareTitle(propTitle) {
  if (propTitle) return propTitle;
  if (typeof document !== 'undefined' && document.title) return document.title;
  return 'McKinsey Blog';
}

function buildShareTargets(title, url) {
  const encodedUrl = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  return {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${text}&body=${encodedUrl}`,
  };
}

function IconButton({ label, children, onClick, href, external }) {
  const className =
    'flex h-10 w-10 items-center justify-center rounded-full border border-mckinsey-border bg-mckinsey-surface text-mckinsey-blue transition-colors hover:border-mckinsey-blue-light/35 hover:bg-mckinsey-warm focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2';

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={className}
        aria-label={label}
        whileHover={{ y: -1 }}
        whileTap={iconTap}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={className}
      aria-label={label}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={iconTap}
    >
      {children}
    </motion.button>
  );
}

export default function ShareBar({ title = '', vertical = false, className = '' }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const resolvedTitle = resolveShareTitle(title);

  const copyLink = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const { twitter, linkedin, email } = buildShareTargets(resolvedTitle, url);

  const layoutClass = vertical
    ? 'flex flex-col items-center gap-2'
    : 'flex flex-row flex-wrap items-center gap-2';

  return (
    <div className={`${layoutClass} ${className}`.trim()} role="group" aria-label="Share and save">
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
      <IconButton label="Copy link to clipboard" onClick={copyLink}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      </IconButton>
      <IconButton label="Share on X (opens in a new tab)" href={twitter} external>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </IconButton>
      <IconButton label="Share on LinkedIn (opens in a new tab)" href={linkedin} external>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </IconButton>
      <IconButton label="Share by email" href={email}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      </IconButton>
      <motion.button
        type="button"
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2 ${
          saved
            ? 'border-mckinsey-accent bg-mckinsey-accent/10 text-mckinsey-accent'
            : 'border-mckinsey-border bg-mckinsey-surface text-mckinsey-blue hover:border-mckinsey-blue-light/35 hover:bg-mckinsey-warm'
        }`}
        aria-label={saved ? 'Remove bookmark' : 'Save article'}
        aria-pressed={saved}
        onClick={() => setSaved((s) => !s)}
        whileHover={{ y: -1 }}
        whileTap={iconTap}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      </motion.button>
    </div>
  );
}
