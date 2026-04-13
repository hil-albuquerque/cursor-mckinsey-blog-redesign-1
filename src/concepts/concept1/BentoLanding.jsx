import { motion } from 'framer-motion';
import McKinseyLogo from '../../components/McKinseyLogo.jsx';
import TopicTag from '../../components/TopicTag.jsx';
import ArticleMeta from '../../components/ArticleMeta.jsx';
import ContentTypeBadge from '../../components/ContentTypeBadge.jsx';
import {
  FEATURED_ARTICLE,
  ARTICLES,
  TOPICS,
  PILLARS,
  RECOMMENDED,
} from '../../data/content.js';

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px 0px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardHover = {
  rest: { scale: 1, boxShadow: '0 1px 2px rgba(5, 28, 44, 0.04)' },
  hover: {
    scale: 1.015,
    boxShadow: '0 24px 48px -12px rgba(5, 28, 44, 0.12), 0 12px 24px -8px rgba(5, 28, 44, 0.08)',
    transition: { type: 'spring', stiffness: 420, damping: 28 },
  },
};

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

function SectionLabel({ children }) {
  return (
    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
      {children}
    </p>
  );
}

function BentoCard({
  article,
  className = '',
  imageClassName = '',
  overlay = false,
  dense = false,
  showSubtitle = true,
}) {
  const isVideo = article.isVideo || article.type === 'video';
  const imgAlt = article.title;

  const topBadges = (
    <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
      <ContentTypeBadge type={article.type} variant="overlay" />
      {isVideo && (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-mckinsey-blue shadow-md backdrop-blur-sm">
          <span className="sr-only">Video</span>
          <span className="ml-0.5 text-xs" aria-hidden>
            ▶
          </span>
        </span>
      )}
    </div>
  );

  if (overlay) {
    return (
      <motion.article
        className={`group relative flex h-full min-h-0 overflow-hidden rounded-2xl border border-mckinsey-border bg-mckinsey-blue ${className}`}
        variants={cardHover}
        initial="rest"
        whileHover="hover"
      >
        <a
          href={`#article-${article.id}`}
          className="absolute inset-0 z-20 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
          aria-label={`Read ${article.title}`}
        />
        <div className="absolute inset-0">
          <img
            src={article.image}
            alt={imgAlt}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mckinsey-blue/92 via-mckinsey-blue/40 to-mckinsey-blue/10" />
          {topBadges}
        </div>
        <div className="relative z-10 flex min-h-full w-full flex-col justify-end p-6 text-white md:p-8 lg:p-10">
          <div className="mb-3">
            <TopicTag topic={article.topic} size="md" />
          </div>
          <h3 className="font-serif text-2xl leading-snug tracking-tight text-white md:text-3xl lg:text-[2rem] lg:leading-tight">
            {article.title}
          </h3>
          {showSubtitle && article.subtitle && !dense && (
            <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-white/82 line-clamp-3 md:text-base">
              {article.subtitle}
            </p>
          )}
          <div className="mt-5 border-t border-white/20 pt-5">
            <ArticleMeta
              author={article.author}
              date={article.date}
              readTime={article.readTime}
              light
            />
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      className={`group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-mckinsey-border bg-mckinsey-surface ${className}`}
      variants={cardHover}
      initial="rest"
      whileHover="hover"
    >
      <a
        href={`#article-${article.id}`}
        className="absolute inset-0 z-20 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
        aria-label={`Read ${article.title}`}
      />
      <div className={`relative shrink-0 overflow-hidden ${imageClassName}`}>
        <img
          src={article.image}
          alt={imgAlt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        {topBadges}
      </div>
      <div className="relative z-10 flex flex-1 flex-col justify-end bg-mckinsey-surface p-5 md:p-6">
        <div className="mb-3">
          <TopicTag topic={article.topic} size={dense ? 'xs' : 'sm'} />
        </div>
        <h3
          className={`font-serif tracking-tight text-mckinsey-text ${
            dense
              ? 'text-lg leading-snug md:text-xl'
              : 'text-xl leading-snug md:text-2xl lg:text-3xl'
          }`}
        >
          {article.title}
        </h3>
        {showSubtitle && article.subtitle && !dense && (
          <p className="mt-2 font-sans text-sm leading-relaxed text-mckinsey-text-secondary line-clamp-3">
            {article.subtitle}
          </p>
        )}
        <div className="mt-4">
          <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
        </div>
      </div>
    </motion.article>
  );
}

function CompactBentoCard({ article }) {
  return (
    <motion.article
      className="group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-mckinsey-border bg-mckinsey-surface md:min-h-[220px]"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
    >
      <a
        href={`#article-${article.id}`}
        className="absolute inset-0 z-20 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
        aria-label={`Read ${article.title}`}
      />
      <div className="relative flex flex-1 flex-col md:flex-row">
        <div className="relative h-40 shrink-0 overflow-hidden md:h-auto md:w-2/5">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute left-3 top-3 z-10">
            <ContentTypeBadge type={article.type} variant="overlay" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center p-4 md:p-5">
          <TopicTag topic={article.topic} size="xs" />
          <h3 className="mt-2 font-serif text-base leading-snug tracking-tight text-mckinsey-text md:text-lg line-clamp-3">
            {article.title}
          </h3>
          <div className="mt-3">
            <ArticleMeta
              author={article.author}
              date={article.date}
              readTime={article.readTime}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MiniBentoCard({ article }) {
  return (
    <motion.article
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-warm/40"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
    >
      <a
        href={`#article-${article.id}`}
        className="absolute inset-0 z-20 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
        aria-label={`Read ${article.title}`}
      />
      <div className="relative h-32 overflow-hidden sm:h-36">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 z-10">
          <TopicTag topic={article.topic} size="xs" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="font-serif text-sm leading-snug tracking-tight text-mckinsey-text line-clamp-3 sm:text-base">
          {article.title}
        </h3>
        <p className="mt-1.5 font-sans text-xs text-mckinsey-text-tertiary">{article.readTime}</p>
      </div>
    </motion.article>
  );
}

function SiteNav() {
  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-mckinsey-border/80 bg-mckinsey-surface/90 backdrop-blur-md"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <a href="#top" className="shrink-0 text-mckinsey-blue transition-opacity hover:opacity-80">
          <McKinseyLogo className="h-6 w-[180px] sm:h-7" color="#051C2C" />
        </a>
        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Topics"
        >
          {TOPICS.map((topic) => (
            <a
              key={topic.id}
              href={`#topic-${topic.id}`}
              className="rounded-lg px-3 py-2 font-sans text-[13px] font-medium text-mckinsey-text-secondary transition-colors hover:bg-mckinsey-warm hover:text-mckinsey-blue"
            >
              {topic.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-mckinsey-border bg-mckinsey-surface text-mckinsey-blue transition-colors hover:border-mckinsey-blue-light/30 hover:bg-mckinsey-warm"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </div>
      </div>
      <div className="border-t border-mckinsey-border/60 bg-mckinsey-bg/80 px-4 py-2 lg:hidden">
        <div className="mx-auto flex max-w-[1440px] gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TOPICS.map((topic) => (
            <a
              key={topic.id}
              href={`#topic-${topic.id}`}
              className="shrink-0 rounded-full border border-mckinsey-border bg-mckinsey-surface px-3 py-1.5 font-sans text-xs font-medium text-mckinsey-text-secondary whitespace-nowrap"
            >
              {topic.label}
            </a>
          ))}
        </div>
      </div>
    </motion.header>
  );
}

function HeroSection() {
  const a = FEATURED_ARTICLE;

  return (
    <motion.section
      id="top"
      className="relative mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-10 lg:pb-20"
      {...reveal}
    >
      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-mckinsey-border bg-mckinsey-blue shadow-[0_32px_64px_-24px_rgba(5,28,44,0.45)]"
        variants={cardHover}
        initial="rest"
        whileHover="hover"
      >
        <div className="grid min-h-[min(78vh,720px)] lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <img
              src={a.image}
              alt={a.title}
              className="h-56 w-full object-cover sm:h-72 lg:absolute lg:inset-0 lg:h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-mckinsey-blue/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-mckinsey-blue/50 lg:to-mckinsey-blue" />
            <div className="absolute bottom-4 left-4 z-10 lg:hidden">
              <ContentTypeBadge type={a.type} variant="overlay" />
            </div>
          </div>
          <div className="relative flex flex-col justify-end p-8 sm:p-10 lg:col-span-5 lg:justify-center lg:p-12 lg:pl-8">
            <div className="mb-4 hidden lg:block">
              <ContentTypeBadge type={a.type} variant="overlay" />
            </div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
              Featured insight
            </p>
            <p className="mt-2 font-sans text-xs uppercase tracking-[0.18em] text-mckinsey-teal">
              {a.pillar}
            </p>
            <h1 className="mt-5 font-serif text-3xl leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
              {a.title}
            </h1>
            <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-white/75 sm:text-lg">
              {a.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <TopicTag topic={a.topic} size="md" />
            </div>
            <div className="mt-8 border-t border-white/15 pt-6">
              <ArticleMeta
                author={a.author}
                date={a.date}
                readTime={a.readTime}
                light
              />
            </div>
            <a
              href={`#article-${a.id}`}
              className="relative z-10 mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 font-sans text-sm font-semibold text-mckinsey-blue transition-colors hover:bg-mckinsey-warm"
            >
              Read the full analysis
              <span aria-hidden className="text-mckinsey-accent">
                →
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

function TrendingSection() {
  const [t1, t2, t3, t4, t5, t6, t7] = ARTICLES;

  return (
    <motion.section
      id="trending"
      className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
      {...reveal}
    >
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel>Trending now</SectionLabel>
          <h2 className="mt-2 font-serif text-3xl tracking-tight text-mckinsey-blue sm:text-4xl">
            What leaders are reading
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-mckinsey-text-secondary sm:text-base">
            A living mosaic of ideas—weighted by momentum, depth, and relevance to the decisions
            shaping industries this quarter.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:grid-rows-[repeat(3,minmax(0,1fr))] lg:gap-6">
        <div className="lg:col-span-7 lg:row-span-2 lg:min-h-[420px]">
          <BentoCard
            article={t1}
            className="h-full min-h-[380px]"
            imageClassName="h-[52%] min-h-[200px] lg:h-[55%]"
            showSubtitle
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:col-span-5 lg:row-span-2 lg:grid-cols-1 lg:gap-6">
          <div className="min-h-[280px] sm:min-h-0 lg:min-h-[200px] lg:flex-1">
            <CompactBentoCard article={t2} />
          </div>
          <div className="min-h-[280px] sm:min-h-0 lg:min-h-[200px] lg:flex-1">
            <CompactBentoCard article={t3} />
          </div>
        </div>
        <div className="lg:col-span-4 lg:row-start-3">
          <BentoCard
            article={t4}
            className="min-h-[320px]"
            imageClassName="h-[45%] min-h-[160px]"
            dense
          />
        </div>
        <div className="lg:col-span-4 lg:row-start-3">
          <BentoCard
            article={t5}
            className="min-h-[320px]"
            imageClassName="h-[45%] min-h-[160px]"
            dense
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:row-start-3 lg:grid-cols-2 lg:gap-6">
          <MiniBentoCard article={t6} />
          <MiniBentoCard article={t7} />
        </div>
      </div>
    </motion.section>
  );
}

function PillarBento({ pillar, index }) {
  const articles = pillar.articles;
  if (!articles.length) return null;

  const primary = articles[0];
  const secondary = articles.slice(1, 3);
  const rest = articles.slice(3);

  return (
    <motion.section
      id={`pillar-${pillar.id}`}
      className="border-t border-mckinsey-border bg-mckinsey-bg/50 py-14 sm:py-16 lg:py-20"
      {...reveal}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 max-w-3xl">
          <SectionLabel>
            Pillar {String(index + 1).padStart(2, '0')}
          </SectionLabel>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-mckinsey-blue sm:text-4xl">
            {pillar.title}
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-mckinsey-text-secondary sm:text-base">
            {pillar.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-8">
            <BentoCard
              article={primary}
              className="min-h-[400px] lg:min-h-[440px]"
              imageClassName="h-[48%] min-h-[220px] lg:h-[52%]"
              overlay
              showSubtitle
            />
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

function RecommendedSection() {
  return (
    <motion.section
      className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
      {...reveal}
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
          <motion.div key={article.id} variants={staggerItem} className="min-h-[320px]">
            <BentoCard
              article={article}
              className="h-full"
              imageClassName="h-[42%] min-h-[140px]"
              dense
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function TopicAnchorsStrip() {
  return (
    <motion.section
      className="border-y border-mckinsey-border bg-mckinsey-surface"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
          Explore by topic
        </p>
        <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
          {TOPICS.map((topic) => (
            <a
              key={topic.id}
              id={`topic-${topic.id}`}
              href={`#topic-${topic.id}`}
              className="inline-flex scroll-mt-32"
            >
              <TopicTag topic={topic} size="md" />
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function SiteFooter() {
  return (
    <motion.footer
      className="border-t border-mckinsey-border bg-mckinsey-blue text-white"
      {...reveal}
    >
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <McKinseyLogo className="h-6 w-[180px]" color="#FFFFFF" />
            <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-white/65">
              Ideas and analysis from McKinsey colleagues worldwide—structured for clarity,
              grounded in evidence, and built to support better decisions.
            </p>
          </div>
          <div className="lg:col-span-7">
            <h3 className="font-serif text-2xl tracking-tight text-white">The Week Ahead</h3>
            <p className="mt-2 font-sans text-sm text-white/65">
              A concise briefing of new research, interviews, and events—delivered weekly.
            </p>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Work email"
                className="min-h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 font-sans text-sm text-white placeholder:text-white/45 backdrop-blur-sm transition-colors focus:border-mckinsey-teal focus:outline-none focus:ring-2 focus:ring-mckinsey-teal/40"
              />
              <button
                type="submit"
                className="min-h-12 shrink-0 rounded-xl bg-white px-8 font-sans text-sm font-semibold text-mckinsey-blue transition-colors hover:bg-mckinsey-warm"
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
          <div className="flex flex-wrap gap-4">
            <a href="#top" className="transition-colors hover:text-white">
              Back to top
            </a>
            <span aria-hidden className="text-white/25">
              |
            </span>
            <a href="#trending" className="transition-colors hover:text-white">
              Trending
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default function BentoLanding() {
  return (
    <div className="min-h-screen bg-mckinsey-bg font-sans text-mckinsey-text antialiased">
      <SiteNav />
      <main>
        <HeroSection />
        <TopicAnchorsStrip />
        <TrendingSection />
        {PILLARS.map((pillar, index) => (
          <PillarBento key={pillar.id} pillar={pillar} index={index} />
        ))}
        <RecommendedSection />
      </main>
      <SiteFooter />
    </div>
  );
}
