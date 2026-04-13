import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import ArticleNav from '../components/ArticleNav';
import SiteFooter from '../components/SiteFooter';
import RelatedContent from '../components/RelatedContent';
import NextArticle from '../components/NextArticle';
import ShareBar from '../components/ShareBar';
import ReadingProgress from '../components/ReadingProgress';

import TopicTag from '../../../components/TopicTag.jsx';
import ArticleMeta from '../../../components/ArticleMeta.jsx';

import { getRelatedArticles, getNextArticle } from '../../../data/content.js';

const easeOut = [0.22, 1, 0.36, 1];

const sectionReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px 0px' },
  transition: { duration: 0.55, ease: easeOut },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildTableOfContents(body) {
  if (!Array.isArray(body)) return [];
  return body
    .map((block, index) => ({ block, index }))
    .filter(({ block }) => block.type === 'heading' && block.content)
    .map(({ block, index }) => {
      const base = slugifyHeading(block.content);
      const id = base ? `section-${base}` : `section-${index}`;
      return { id, text: block.content };
    });
}

function extractKeyStats(article) {
  const stats = [];
  const seen = new Set();

  const add = (label, value) => {
    const key = `${label}|${value}`;
    if (seen.has(key) || stats.length >= 6) return;
    seen.add(key);
    stats.push({ label, value });
  };

  const { chartData, keyTakeaways, body } = article;

  if (chartData?.values?.length) {
    const values = chartData.values.map(Number);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const maxIdx = values.indexOf(max);
    const unit = chartData.unit ?? '';
    add('Series peak', `${max}${unit}`);
    if (chartData.labels?.[maxIdx]) {
      add('Top category', chartData.labels[maxIdx]);
    }
    if (values.length > 1) {
      add('Series floor', `${min}${unit}`);
    }
  }

  if (keyTakeaways?.length) {
    const first = keyTakeaways[0];
    if (first && stats.length < 6) {
      add('Lead takeaway', first.length > 72 ? `${first.slice(0, 69)}…` : first);
    }
  }

  const corpus = (body || [])
    .filter((b) => b.type === 'paragraph' || b.type === 'pullquote')
    .map((b) => b.content)
    .join(' ');

  const regexList = [
    { label: 'Referenced magnitude', pattern: /\$[\d,.]+(?:\s*(?:trillion|billion|million|T|B|M))?/gi },
    { label: 'Share / rate', pattern: /\b\d+(?:\.\d+)?%/g },
    { label: 'Performance multiple', pattern: /\b\d+(?:\.\d+)?x\b/gi },
    { label: 'Scale', pattern: /\b\d{1,3}(?:,\d{3})+\b/g },
  ];

  for (const { label, pattern } of regexList) {
    const m = corpus.match(pattern);
    if (m?.[0]) add(label, m[0]);
    if (stats.length >= 6) break;
  }

  return stats.slice(0, 5);
}

function InsightBarChart({ chartData, reduceMotion }) {
  const { title, labels = [], values = [], unit = '' } = chartData;
  const numeric = values.map((v) => Number(v));
  const max = Math.max(1, ...numeric.map((n) => (Number.isFinite(n) ? Math.abs(n) : 0)));

  return (
    <motion.div
      className="rounded-xl border border-mckinsey-border bg-mckinsey-surface p-6 shadow-sm sm:p-8"
      {...sectionReveal}
    >
      <div className="flex flex-col gap-1 border-b border-mckinsey-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-xl tracking-tight text-mckinsey-blue sm:text-2xl">{title}</h2>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-mckinsey-text-tertiary">
          Indexed view · {unit.trim() || 'units'}
        </p>
      </div>

      <div className="mt-6 space-y-4" role="img" aria-label={`Bar chart: ${title}`}>
        {labels.map((label, i) => {
          const raw = numeric[i];
          const v = Number.isFinite(raw) ? raw : 0;
          const pct = Math.round((Math.abs(v) / max) * 100);
          const display = `${v}${unit}`.replace(/\s+/g, ' ').trim();

          return (
            <div key={`${label}-${i}`} className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,7.5rem)_1fr_minmax(0,4.5rem)] sm:items-center sm:gap-4">
              <p className="font-sans text-xs font-medium text-mckinsey-text-secondary sm:text-right">{label}</p>

              <div className="relative h-2.5 overflow-hidden rounded-sm bg-mckinsey-warm-dark/80">
                <motion.div
                  className="h-full rounded-sm bg-mckinsey-accent"
                  initial={reduceMotion ? false : { width: 0 }}
                  whileInView={reduceMotion ? undefined : { width: `${pct}%` }}
                  viewport={{ once: true, margin: '-20% 0px' }}
                  transition={{
                    duration: 0.85,
                    ease: easeOut,
                    delay: reduceMotion ? 0 : i * 0.07,
                  }}
                  style={reduceMotion ? { width: `${pct}%` } : undefined}
                />
              </div>

              <p className="font-sans text-xs tabular-nums text-mckinsey-text sm:text-right">{display}</p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 border-t border-mckinsey-border pt-4 font-sans text-[11px] leading-relaxed text-mckinsey-text-tertiary">
        Values shown as share of the largest observation in this series. Designed for at-a-glance comparison across
        categories—consistent with exhibit-style reporting in briefings.
      </p>
    </motion.div>
  );
}

function KeyTakeawaysModule({ items, reduceMotion }) {
  const itemVariants = reduceMotion
    ? { hidden: { opacity: 1, x: 0 }, show: { opacity: 1, x: 0 } }
    : staggerItem;

  return (
    <motion.section
      className="relative overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-warm pl-5 pr-6 py-7 shadow-sm sm:pl-7 sm:pr-8 sm:py-9"
      style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--color-mckinsey-accent)' }}
      variants={staggerContainer}
      initial={reduceMotion ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-60px 0px' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-mckinsey-accent/[0.06]"
      />
      <h2 className="font-serif text-xl tracking-tight text-mckinsey-blue sm:text-2xl">Key takeaways</h2>
      <p className="mt-2 max-w-2xl font-sans text-sm text-mckinsey-text-secondary">
        Executive summary of the analysis—what leaders should carry into the room.
      </p>

      <ol className="mt-8 space-y-5">
        {items.map((text, i) => (
          <motion.li key={i} className="flex gap-4" variants={itemVariants} custom={i}>
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-mckinsey-accent/25 bg-mckinsey-surface font-sans text-xs font-bold text-mckinsey-accent"
              aria-hidden
            >
              {i + 1}
            </span>
            <p className="font-sans text-sm leading-relaxed text-mckinsey-text sm:text-[15px]">{text}</p>
          </motion.li>
        ))}
      </ol>
    </motion.section>
  );
}

function BodyBlock({ block, headingIds }) {
  if (block.type === 'paragraph') {
    return (
      <p className="font-sans text-[15px] leading-[1.75] text-mckinsey-text-secondary sm:text-base sm:leading-[1.8]">
        {block.content}
      </p>
    );
  }

  if (block.type === 'heading') {
    const id = headingIds.get(block.content);
    return (
      <h3
        id={id}
        className="scroll-mt-36 font-serif text-2xl tracking-tight text-mckinsey-blue sm:text-[1.75rem]"
      >
        {block.content}
      </h3>
    );
  }

  if (block.type === 'pullquote') {
    return (
      <blockquote className="rounded-lg border border-mckinsey-border bg-mckinsey-warm px-5 py-5 sm:px-7 sm:py-6">
        <p className="font-serif text-lg leading-snug text-mckinsey-blue sm:text-xl">&ldquo;{block.content}&rdquo;</p>
      </blockquote>
    );
  }

  return null;
}

function TableOfContents({ items, activeId }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-xl border border-mckinsey-border bg-mckinsey-surface p-5">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
        On this page
      </p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block font-sans text-sm leading-snug transition-colors ${
                  active ? 'font-semibold text-mckinsey-accent' : 'text-mckinsey-text-secondary hover:text-mckinsey-blue'
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function KeyStatsPanel({ stats }) {
  if (!stats.length) return null;

  return (
    <div className="rounded-xl border border-mckinsey-border bg-mckinsey-bg p-5">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
        Signals from the text
      </p>
      <ul className="mt-4 space-y-4">
        {stats.map((s) => (
          <li key={`${s.label}-${s.value}`} className="border-b border-mckinsey-border/70 pb-3 last:border-0 last:pb-0">
            <p className="font-sans text-[10px] font-medium uppercase tracking-wider text-mckinsey-text-tertiary">
              {s.label}
            </p>
            <p className="mt-1 font-sans text-sm font-semibold tabular-nums text-mckinsey-text">{s.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InsightArticle({ article }) {
  const reduceMotion = useReducedMotion();
  const mainRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const labelId = useId();

  const toc = useMemo(() => buildTableOfContents(article?.body), [article]);
  const headingIds = useMemo(() => {
    const map = new Map();
    toc.forEach((item) => {
      map.set(item.text, item.id);
    });
    return map;
  }, [toc]);

  const keyStats = useMemo(() => extractKeyStats(article), [article]);
  const related = useMemo(() => getRelatedArticles(article, 4), [article]);
  const nextArticle = useMemo(() => getNextArticle(article), [article]);

  const observeHeadings = useCallback(() => {
    const ids = toc.map((t) => t.id);
    if (!ids.length) return undefined;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    const cleanup = observeHeadings();
    return cleanup;
  }, [observeHeadings]);

  const tocActiveId = activeId ?? toc[0]?.id ?? null;

  if (!article) {
    return (
      <div className="min-h-screen bg-mckinsey-bg px-4 py-24 text-center font-sans text-mckinsey-text-secondary">
        Article not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mckinsey-bg font-sans text-mckinsey-text antialiased">
      <ReadingProgress />
      <ArticleNav />

      <main id="insight-article-main" ref={mainRef}>
        {/* Hero — analytical header, not full-bleed */}
        <motion.header
          className="border-b border-mckinsey-border bg-mckinsey-surface"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 lg:px-10">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <TopicTag topic={article.topic} size="sm" />
              </div>
              <h1
                id={labelId}
                className="mt-5 font-serif text-[2rem] leading-[1.12] tracking-tight text-mckinsey-blue sm:text-4xl lg:text-[2.75rem]"
              >
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="mx-auto mt-4 max-w-2xl font-sans text-base leading-relaxed text-mckinsey-text-secondary lg:mx-0 lg:max-w-3xl">
                  {article.subtitle}
                </p>
              )}

              <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:items-start lg:justify-start">
                {article.author?.image && (
                  <img
                    src={article.author.image}
                    alt=""
                    className="h-14 w-14 rounded-full border border-mckinsey-border object-cover shadow-sm"
                  />
                )}
                <div className="text-center sm:text-left">
                  {article.author?.name && (
                    <p className="font-sans text-sm font-semibold text-mckinsey-text">{article.author.name}</p>
                  )}
                  {article.author?.role && (
                    <p className="mt-0.5 font-sans text-xs text-mckinsey-text-tertiary">{article.author.role}</p>
                  )}
                  <div className="mt-2">
                    <ArticleMeta
                      author={null}
                      date={article.date}
                      readTime={article.readTime}
                    />
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-warm/40 shadow-sm lg:mx-0 lg:max-w-5xl"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: easeOut }}
            >
              <div className="aspect-video w-full">
                <img src={article.image} alt="" className="h-full w-full object-cover" />
              </div>
            </motion.div>

            {article.pillar && (
              <p className="mx-auto mt-4 max-w-4xl text-center font-sans text-xs text-mckinsey-text-tertiary lg:text-left">
                <span className="font-semibold uppercase tracking-wider text-mckinsey-text-secondary">Strategic pillar</span>
                <span aria-hidden> · </span>
                {article.pillar}
              </p>
            )}
          </div>
        </motion.header>

        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">
            <div className="space-y-12 lg:col-span-8 xl:col-span-8">
              {article.keyTakeaways?.length > 0 && (
                <KeyTakeawaysModule items={article.keyTakeaways} reduceMotion={reduceMotion} />
              )}

              {article.chartData && (
                <InsightBarChart chartData={article.chartData} reduceMotion={reduceMotion} />
              )}

              <motion.section
                aria-labelledby={labelId}
                className="mx-auto max-w-2xl space-y-8 lg:mx-0"
                initial={reduceMotion ? false : { opacity: 0 }}
                whileInView={reduceMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
              >
                {(article.body || []).map((block, idx) => (
                  <motion.div
                    key={idx}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px 0px' }}
                    transition={{ duration: 0.45, ease: easeOut, delay: reduceMotion ? 0 : (idx % 5) * 0.04 }}
                  >
                    <BodyBlock block={block} headingIds={headingIds} />
                  </motion.div>
                ))}
              </motion.section>
            </div>

            <aside className="lg:col-span-4 xl:col-span-4">
              <div className="space-y-8 lg:sticky lg:top-32">
                <TableOfContents items={toc} activeId={tocActiveId} />
                <KeyStatsPanel stats={keyStats} />
                <div className="rounded-xl border border-mckinsey-border bg-mckinsey-surface p-5">
                  <ShareBar title={article.title} />
                  <div className="mt-6 border-t border-mckinsey-border pt-6">
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-mckinsey-text-tertiary">
                      Export
                    </p>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="mt-3 w-full rounded-lg border border-mckinsey-blue/20 bg-mckinsey-blue px-4 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-mckinsey-blue-light"
                    >
                      Print / save PDF
                    </button>
                    <p className="mt-2 font-sans text-[10px] text-mckinsey-text-tertiary">
                      Use your browser print dialog to save a clean copy for offline review.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <RelatedContent articles={related} currentArticleId={article.id} />
        <NextArticle article={nextArticle} />
      </main>

      <SiteFooter />
    </div>
  );
}
