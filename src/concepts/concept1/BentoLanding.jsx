import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import SiteNav from './components/SiteNav';
import SiteFooter from './components/SiteFooter';
import TopicTag from '../../components/TopicTag';
import ArticleMeta from '../../components/ArticleMeta';
import ContentTypeBadge from '../../components/ContentTypeBadge';
import {
  FEATURED_ARTICLE,
  ARTICLES,
  TOPICS,
  PILLARS,
  RECOMMENDED,
} from '../../data/content';

const easePremium = [0.22, 1, 0.36, 1];

function sectionRevealProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px 0px' },
    transition: { duration: 0.65, ease: easePremium, delay },
  };
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: easePremium },
  },
};

const cardSpring = { type: 'spring', stiffness: 420, damping: 28 };

const cardHoverMotion = {
  rest: {
    scale: 1,
    boxShadow: '0 1px 2px rgba(5, 28, 44, 0.06)',
  },
  hover: {
    scale: 1.015,
    boxShadow:
      '0 28px 56px -14px rgba(5, 28, 44, 0.14), 0 14px 28px -10px rgba(5, 28, 44, 0.1)',
    transition: cardSpring,
  },
};

function articlePath(id) {
  return `/concept-1/article/${id}`;
}

function firstArticleForTopic(topicId) {
  const pool = [FEATURED_ARTICLE, ...ARTICLES];
  return pool.find((a) => a.topic.id === topicId) ?? ARTICLES[0];
}

function SectionLabel({ children, light }) {
  return (
    <p
      className={`font-sans text-[11px] font-semibold uppercase tracking-[0.2em] ${
        light ? 'text-white/55' : 'text-mckinsey-text-tertiary'
      }`}
    >
      {children}
    </p>
  );
}

function PlayIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

/* ——— Card primitives (all navigation via React Router Link) ——— */

function FeatureBentoCard({ article }) {
  return (
    <Link
      to={articlePath(article.id)}
      className="group block h-full min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
      aria-label={`Read ${article.title}`}
    >
      <motion.article
        className="relative flex h-full min-h-[320px] overflow-hidden rounded-2xl border border-mckinsey-border bg-mckinsey-blue shadow-sm lg:min-h-[420px]"
        variants={cardHoverMotion}
        initial="rest"
        whileHover="hover"
      >
        <div className="absolute inset-0">
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-mckinsey-blue/45 to-mckinsey-blue/15" />
        </div>
        <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2 md:left-5 md:top-5">
          <ContentTypeBadge type={article.type} variant="overlay" />
          <TopicTag topic={article.topic} size="sm" />
        </div>
        <div className="relative z-10 mt-auto flex w-full flex-col justify-end p-6 text-white md:p-8 lg:p-10">
          <h3 className="font-serif text-2xl leading-[1.15] tracking-tight text-white md:text-3xl lg:text-[2.125rem]">
            {article.title}
          </h3>
          {article.subtitle && (
            <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-white/80 line-clamp-2 md:text-base">
              {article.subtitle}
            </p>
          )}
          <div className="mt-6 border-t border-white/20 pt-5">
            <ArticleMeta
              author={article.author}
              date={article.date}
              readTime={article.readTime}
              light
            />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function StandardBentoCard({ article, dense = false }) {
  return (
    <Link
      to={articlePath(article.id)}
      className="group block h-full min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
      aria-label={`Read ${article.title}`}
    >
      <motion.article
        className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-mckinsey-border bg-mckinsey-surface"
        variants={cardHoverMotion}
        initial="rest"
        whileHover="hover"
      >
        <div
          className={`relative shrink-0 overflow-hidden ${dense ? 'h-[42%] min-h-[140px]' : 'h-[45%] min-h-[160px]'}`}
        >
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 z-10">
            <ContentTypeBadge type={article.type} variant="overlay" />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <TopicTag topic={article.topic} size={dense ? 'xs' : 'sm'} />
          <h3
            className={`mt-3 font-serif tracking-tight text-mckinsey-text ${
              dense
                ? 'text-lg leading-snug md:text-xl'
                : 'text-xl leading-snug md:text-2xl lg:text-[1.65rem]'
            }`}
          >
            {article.title}
          </h3>
          {article.subtitle && !dense && (
            <p className="mt-2 font-sans text-sm leading-relaxed text-mckinsey-text-secondary line-clamp-3">
              {article.subtitle}
            </p>
          )}
          <div className="mt-4">
            <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function MediaBentoCard({ article }) {
  const showPlay = article.isVideo || article.type === 'video';
  return (
    <Link
      to={articlePath(article.id)}
      className="group block h-full min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
      aria-label={`Read ${article.title}`}
    >
      <motion.article
        className="relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border border-mckinsey-blue-light/40 bg-mckinsey-blue text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        variants={cardHoverMotion}
        initial="rest"
        whileHover="hover"
      >
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-[21/9]">
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover opacity-90 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-mckinsey-blue/50 to-mckinsey-blue/20" />
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            <ContentTypeBadge type={article.type} variant="overlay" />
          </div>
          {showPlay && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-mckinsey-blue shadow-xl backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                <span className="sr-only">Play video</span>
                <PlayIcon className="ml-1 h-7 w-7" />
              </span>
            </div>
          )}
        </div>
        <div className="relative flex flex-1 flex-col p-5 md:p-6">
          <TopicTag topic={article.topic} size="sm" />
          <h3 className="mt-3 font-serif text-xl leading-snug tracking-tight text-white md:text-2xl">
            {article.title}
          </h3>
          {article.subtitle && (
            <p className="mt-2 font-sans text-sm leading-relaxed text-white/70 line-clamp-2">
              {article.subtitle}
            </p>
          )}
          <div className="mt-4">
            <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} light />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function InsightBentoCard({ article }) {
  const stat =
    Array.isArray(article.keyTakeaways) && article.keyTakeaways.length > 0
      ? article.keyTakeaways[0]
      : null;
  return (
    <Link
      to={articlePath(article.id)}
      className="group block h-full min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
      aria-label={`Read ${article.title}`}
    >
      <motion.article
        className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-mckinsey-border bg-[color-mix(in_srgb,var(--color-mckinsey-warm)_88%,white)] md:flex-row"
        variants={cardHoverMotion}
        initial="rest"
        whileHover="hover"
      >
        <div className="relative h-36 shrink-0 overflow-hidden md:h-auto md:w-[38%] md:max-w-[220px]">
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute left-2 top-2">
            <ContentTypeBadge type={article.type} variant="overlay" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center p-5 md:p-6">
          <TopicTag topic={article.topic} size="xs" />
          {stat && (
            <p className="mt-4 border-l-[3px] border-mckinsey-accent pl-4 font-serif text-lg leading-snug tracking-tight text-mckinsey-blue md:text-xl">
              {stat}
            </p>
          )}
          <h3 className="mt-4 font-serif text-lg leading-snug tracking-tight text-mckinsey-text md:text-xl">
            {article.title}
          </h3>
          {article.subtitle && (
            <p className="mt-2 font-sans text-sm text-mckinsey-text-secondary line-clamp-2">
              {article.subtitle}
            </p>
          )}
          <div className="mt-4">
            <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function CompactBentoCard({ article }) {
  return (
    <Link
      to={articlePath(article.id)}
      className="group block h-full min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
      aria-label={`Read ${article.title}`}
    >
      <motion.article
        className="flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-mckinsey-border bg-mckinsey-surface md:min-h-[220px]"
        variants={cardHoverMotion}
        initial="rest"
        whileHover="hover"
      >
        <div className="relative flex flex-1 flex-col md:flex-row">
          <div className="relative h-40 shrink-0 overflow-hidden md:h-auto md:w-2/5">
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            />
            <div className="absolute left-3 top-3 z-10">
              <ContentTypeBadge type={article.type} variant="overlay" />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center p-4 md:p-5">
            <TopicTag topic={article.topic} size="xs" />
            <h3 className="mt-2 font-serif text-base leading-snug tracking-tight text-mckinsey-text line-clamp-3 md:text-lg">
              {article.title}
            </h3>
            <div className="mt-3">
              <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function MiniBentoCard({ article }) {
  return (
    <Link
      to={articlePath(article.id)}
      className="group block h-full min-h-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
      aria-label={`Read ${article.title}`}
    >
      <motion.article
        className="flex h-full flex-col overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-warm-dark/35"
        variants={cardHoverMotion}
        initial="rest"
        whileHover="hover"
      >
        <div className="relative h-32 overflow-hidden sm:h-36">
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <TopicTag topic={article.topic} size="xs" />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <h3 className="font-serif text-sm leading-snug tracking-tight text-mckinsey-text line-clamp-3 sm:text-base">
            {article.title}
          </h3>
          <p className="mt-2 font-sans text-xs text-mckinsey-text-tertiary">{article.readTime}</p>
        </div>
      </motion.article>
    </Link>
  );
}

function TrendingCardByType({ article }) {
  const t = article.cardType || 'standard';
  if (t === 'feature') return <FeatureBentoCard article={article} />;
  if (t === 'media') return <MediaBentoCard article={article} />;
  if (t === 'insight') return <InsightBentoCard article={article} />;
  return <StandardBentoCard article={article} />;
}

function PillarPrimaryCard({ article }) {
  return (
    <Link
      to={articlePath(article.id)}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
      aria-label={`Read ${article.title}`}
    >
      <motion.article
        className="relative flex min-h-[400px] overflow-hidden rounded-2xl border border-mckinsey-border bg-mckinsey-blue lg:min-h-[440px]"
        variants={cardHoverMotion}
        initial="rest"
        whileHover="hover"
      >
        <div className="absolute inset-0">
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mckinsey-blue/95 via-mckinsey-blue/45 to-mckinsey-blue/10" />
        </div>
        <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
          <ContentTypeBadge type={article.type} variant="overlay" />
          <TopicTag topic={article.topic} size="sm" />
        </div>
        <div className="relative z-10 mt-auto flex w-full flex-col justify-end p-6 text-white md:p-8 lg:p-10">
          <h3 className="font-serif text-2xl leading-snug tracking-tight text-white md:text-3xl lg:text-[2rem]">
            {article.title}
          </h3>
          {article.subtitle && (
            <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-white/78 line-clamp-3 md:text-base">
              {article.subtitle}
            </p>
          )}
          <div className="mt-6 border-t border-white/20 pt-5">
            <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} light />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function RecommendedCard({ article }) {
  return <StandardBentoCard article={article} dense />;
}

/* ——— Sections ——— */

function HeroSection() {
  const a = FEATURED_ARTICLE;
  const heroId = `hero-${a.id}`;

  return (
    <motion.section
      id="top"
      className="relative mx-auto max-w-[1440px] scroll-mt-28 px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:px-10 lg:pb-16"
      {...sectionRevealProps(0)}
    >
      <Link
        to={articlePath(a.id)}
        className="group block rounded-[2rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-4 focus-visible:ring-offset-mckinsey-bg"
        aria-labelledby={heroId}
      >
        <motion.div
          className="relative overflow-hidden rounded-[2rem] border border-mckinsey-border bg-mckinsey-blue shadow-[0_32px_64px_-24px_rgba(5,28,44,0.42)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.004 }}
          transition={{
            opacity: { duration: 0.75, ease: easePremium, delay: 0.08 },
            y: { duration: 0.75, ease: easePremium, delay: 0.08 },
            scale: cardSpring,
          }}
        >
          <div className="grid min-h-[min(76vh,700px)] lg:grid-cols-12">
            <div className="relative lg:col-span-7">
              <img
                src={a.image}
                alt=""
                className="h-56 w-full object-cover sm:h-72 lg:absolute lg:inset-0 lg:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-mckinsey-blue/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-mckinsey-blue/55 lg:to-mckinsey-blue" />
              <div className="absolute bottom-4 left-4 z-10 flex gap-2 lg:hidden">
                <ContentTypeBadge type={a.type} variant="overlay" />
              </div>
            </div>
            <div className="relative flex flex-col justify-end p-8 sm:p-10 lg:col-span-5 lg:justify-center lg:p-12 lg:pl-8">
              <div className="mb-4 hidden flex-wrap gap-2 lg:flex">
                <ContentTypeBadge type={a.type} variant="overlay" />
                <TopicTag topic={a.topic} size="sm" />
              </div>
              <SectionLabel light>Featured insight</SectionLabel>
              <p className="mt-2 font-sans text-xs uppercase tracking-[0.18em] text-mckinsey-teal">
                {a.pillar}
              </p>
              <h1
                id={heroId}
                className="mt-5 font-serif text-[2.125rem] leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.85rem] lg:leading-[1.06]"
              >
                {a.title}
              </h1>
              <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-white/76 sm:text-lg">
                {a.subtitle}
              </p>
              <div className="mt-6 lg:hidden">
                <TopicTag topic={a.topic} size="md" />
              </div>
              <div className="mt-8 border-t border-white/15 pt-6">
                <ArticleMeta author={a.author} date={a.date} readTime={a.readTime} light />
              </div>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 font-sans text-sm font-semibold text-mckinsey-blue transition-colors group-hover:bg-mckinsey-warm">
                Read the full analysis
                <span aria-hidden className="text-mckinsey-accent">
                  →
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.section>
  );
}

function TopicAnchorsStrip() {
  return (
    <motion.div
      className="sticky top-[4.25rem] z-30 border-y border-mckinsey-border/90 bg-mckinsey-surface/92 backdrop-blur-md supports-[backdrop-filter]:bg-mckinsey-surface/80 md:top-[4.5rem] lg:top-[4.75rem]"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easePremium, delay: 0.15 }}
    >
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-10">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-mckinsey-text-tertiary">
          Explore by topic
        </p>
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:gap-3 [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="Topic filters"
        >
          {TOPICS.map((topic) => {
            const lead = firstArticleForTopic(topic.id);
            return (
              <div
                key={topic.id}
                id={`topic-${topic.id}`}
                className="snap-start scroll-mt-36 shrink-0"
                role="listitem"
              >
                <Link
                  to={articlePath(lead.id)}
                  className="inline-block rounded-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
                  aria-label={`${topic.label}: open lead story`}
                >
                  <TopicTag topic={topic} size="md" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function TrendingBentoSection() {
  const [t0, t1, t2, t3, t4, t5, t6] = ARTICLES.slice(0, 7);

  return (
    <motion.section
      id="trending"
      className="mx-auto max-w-[1440px] scroll-mt-32 px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
      {...sectionRevealProps(0)}
    >
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel>Trending now</SectionLabel>
          <h2 className="mt-2 font-serif text-3xl tracking-tight text-mckinsey-blue sm:text-4xl lg:text-[2.5rem]">
            What leaders are reading
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-mckinsey-text-secondary sm:text-base">
            A living mosaic of ideas—weighted by momentum, depth, and relevance to the decisions
            shaping industries this quarter.
          </p>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto] lg:gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        <motion.div
          className="lg:col-span-7 lg:row-span-2 lg:min-h-[420px]"
          variants={staggerItem}
        >
          <TrendingCardByType article={t0} />
        </motion.div>
        <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:col-span-5 lg:row-span-2 lg:grid-cols-1 lg:gap-6">
          <motion.div className="min-h-[240px] lg:min-h-[200px]" variants={staggerItem}>
            <CompactBentoCard article={t1} />
          </motion.div>
          <motion.div className="min-h-[240px] lg:min-h-[200px]" variants={staggerItem}>
            <CompactBentoCard article={t2} />
          </motion.div>
        </motion.div>

        <motion.div className="lg:col-span-6" variants={staggerItem}>
          <TrendingCardByType article={t3} />
        </motion.div>
        <motion.div className="lg:col-span-6" variants={staggerItem}>
          <TrendingCardByType article={t4} />
        </motion.div>
        <motion.div className="lg:col-span-12" variants={staggerItem}>
          <InsightBentoCard article={t5} />
        </motion.div>
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-2 lg:gap-6"
          variants={staggerItem}
        >
          <MiniBentoCard article={t6} />
          <MiniBentoCard article={t5} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function ExploreByThemeSection() {
  const topicRows = useMemo(() => {
    const all = [FEATURED_ARTICLE, ...ARTICLES];
    return TOPICS.map((topic) => ({
      topic,
      count: all.filter((a) => a.topic.id === topic.id).length,
      lead: firstArticleForTopic(topic.id),
    }));
  }, []);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const headerY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden bg-mckinsey-blue py-16 sm:py-20 lg:py-24"
      {...sectionRevealProps(0)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_-20%,rgba(34,81,255,0.22),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mckinsey-blue-light/25 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <motion.div style={{ y: headerY }} className="max-w-3xl">
          <SectionLabel light>Immersive</SectionLabel>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Explore by theme
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-white/65 sm:text-base">
            Move horizontally through the ideas defining the agenda—each corridor opens into a
            signature story from that theme.
          </p>
        </motion.div>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:gap-6 lg:gap-8 [&::-webkit-scrollbar]:hidden">
          {topicRows.map(({ topic, count, lead }) => (
            <motion.div
              key={topic.id}
              className="w-[min(100vw-2.5rem,320px)] shrink-0 snap-center sm:w-[340px] lg:w-[380px]"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: easePremium }}
            >
              <Link
                to={articlePath(lead.id)}
                className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-teal focus-visible:ring-offset-2 focus-visible:ring-offset-mckinsey-blue"
                aria-label={`${topic.label}: open ${lead.title}`}
              >
                <motion.article
                  className="relative flex h-[420px] flex-col overflow-hidden rounded-2xl border border-white/12 bg-mckinsey-blue-light/40 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.45)] sm:h-[460px]"
                  whileHover={{ scale: 1.02 }}
                  transition={cardSpring}
                >
                  <div className="relative h-[55%] overflow-hidden">
                    <img
                      src={lead.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col justify-end p-6 sm:p-7">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-mckinsey-teal">
                      {count} related {count === 1 ? 'story' : 'stories'}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl leading-tight tracking-tight text-white sm:text-[1.75rem]">
                      {topic.label}
                    </h3>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-white/60 line-clamp-2">
                      {lead.title}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider text-white/80">
                      Enter theme
                      <span aria-hidden className="text-mckinsey-teal">
                        →
                      </span>
                    </span>
                  </div>
                </motion.article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function PillarSection({ pillar, index }) {
  const articles = pillar.articles;
  if (!articles.length) return null;

  const primary = articles[0];
  const secondary = articles.slice(1, 3);
  const rest = articles.slice(3);

  return (
    <motion.section
      id={`pillar-${pillar.id}`}
      className="scroll-mt-32 border-t border-mckinsey-border bg-mckinsey-bg/60 py-14 sm:py-16 lg:py-20"
      {...sectionRevealProps(0)}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 max-w-3xl">
          <SectionLabel>Pillar {String(index + 1).padStart(2, '0')}</SectionLabel>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-mckinsey-blue sm:text-4xl">
            {pillar.title}
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-mckinsey-text-secondary sm:text-base">
            {pillar.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-8">
            <PillarPrimaryCard article={primary} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:gap-6">
            {secondary.map((article) => (
              <CompactBentoCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {rest.length > 0 && (
          <motion.div
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {rest.map((article) => (
              <motion.div key={article.id} variants={staggerItem}>
                <MiniBentoCard article={article} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

function FeaturedCampaignSection() {
  const article = ARTICLES[6];
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <motion.section
      ref={sectionRef}
      className="relative my-4 overflow-hidden sm:my-6 lg:my-8"
      {...sectionRevealProps(0)}
    >
      <Link
        to={articlePath(article.id)}
        className="group relative block min-h-[min(88vh,720px)] focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-teal focus-visible:ring-offset-4 focus-visible:ring-offset-mckinsey-bg"
        aria-label={`Read ${article.title}`}
      >
        <motion.div className="absolute inset-0 -z-10" style={{ y: imgY }}>
          <img
            src={article.image}
            alt=""
            className="h-[120%] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-mckinsey-blue via-mckinsey-blue/85 to-mckinsey-blue/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        <div className="relative mx-auto flex min-h-[min(88vh,720px)] max-w-[1440px] flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: easePremium }}
            className="max-w-3xl"
          >
            <SectionLabel light>Featured campaign</SectionLabel>
            <div className="mt-4 flex flex-wrap gap-2">
              <ContentTypeBadge type={article.type} variant="overlay" />
              <TopicTag topic={article.topic} size="sm" />
            </div>
            <h2 className="mt-6 font-serif text-[2.25rem] leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[3.25rem] lg:leading-[1.05]">
              {article.title}
            </h2>
            {article.subtitle && (
              <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-white/78 sm:text-lg">
                {article.subtitle}
              </p>
            )}
            <div className="mt-8 border-t border-white/20 pt-6">
              <ArticleMeta
                author={article.author}
                date={article.date}
                readTime={article.readTime}
                light
              />
            </div>
            <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-sans text-sm font-semibold text-mckinsey-blue transition-colors group-hover:bg-mckinsey-warm">
              Explore the analysis
              <span aria-hidden className="text-mckinsey-accent">
                →
              </span>
            </span>
          </motion.div>
        </div>
      </Link>
    </motion.section>
  );
}

function FromOurPeopleSection() {
  const peopleArticles = [ARTICLES[5], ARTICLES[3], ARTICLES[7]];

  return (
    <motion.section
      className="bg-mckinsey-warm py-16 sm:py-20 lg:py-24"
      {...sectionRevealProps(0)}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionLabel>People &amp; culture</SectionLabel>
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-mckinsey-blue sm:text-4xl">
          From our people
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-mckinsey-text-secondary sm:text-base">
          Portraits of colleagues advancing client impact—told with the same rigor we bring to the
          boardroom.
        </p>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {peopleArticles.map((article) => (
            <motion.div key={article.id} variants={staggerItem}>
              <Link
                to={articlePath(article.id)}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2 focus-visible:ring-offset-mckinsey-warm"
                aria-label={`Read ${article.title}`}
              >
                <motion.article
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-mckinsey-border bg-mckinsey-surface shadow-sm"
                  variants={cardHoverMotion}
                  initial="rest"
                  whileHover="hover"
                >
                  <div className="relative aspect-[3/4] max-h-[420px] w-full overflow-hidden bg-mckinsey-warm-dark">
                    <img
                      src={article.author?.image || article.image}
                      alt=""
                      className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mckinsey-blue/55 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4">
                      <ContentTypeBadge type={article.type} variant="overlay" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-mckinsey-text-tertiary">
                      {article.author?.name}
                    </p>
                    <p className="mt-1 font-sans text-xs text-mckinsey-text-secondary">
                      {article.author?.role}
                    </p>
                    <h3 className="mt-4 font-serif text-xl leading-snug tracking-tight text-mckinsey-text">
                      {article.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm text-mckinsey-text-secondary line-clamp-2">
                      {article.subtitle}
                    </p>
                    <div className="mt-4">
                      <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
                    </div>
                  </div>
                </motion.article>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

function RecommendedSection() {
  return (
    <motion.section
      className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
      {...sectionRevealProps(0)}
    >
      <div className="mb-10">
        <SectionLabel>Recommended for you</SectionLabel>
        <h2 className="mt-2 font-serif text-3xl tracking-tight text-mckinsey-blue sm:text-4xl">
          Curated for depth
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-sm text-mckinsey-text-secondary sm:text-base">
          Long-form perspectives selected for strategic relevance—ready when you are.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {RECOMMENDED.map((article) => (
          <motion.div key={article.id} variants={staggerItem} className="min-h-[300px]">
            <RecommendedCard article={article} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default function BentoLanding() {
  return (
    <div className="min-h-screen bg-mckinsey-bg font-sans text-mckinsey-text antialiased">
      <SiteNav />
      <main>
        <HeroSection />
        <TopicAnchorsStrip />
        <TrendingBentoSection />
        <ExploreByThemeSection />
        {PILLARS.map((pillar, index) => (
          <PillarSection key={pillar.id} pillar={pillar} index={index} />
        ))}
        <FeaturedCampaignSection />
        <FromOurPeopleSection />
        <RecommendedSection />
      </main>
      <SiteFooter />
    </div>
  );
}
