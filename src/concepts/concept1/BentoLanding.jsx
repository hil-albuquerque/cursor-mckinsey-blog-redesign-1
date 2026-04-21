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

const ease = [0.22, 1, 0.36, 1];

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px 0px' },
    transition: { duration: 0.6, ease, delay },
  };
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const cardSpring = { type: 'spring', stiffness: 380, damping: 30 };
const cardHover = {
  rest: { scale: 1, boxShadow: '0 1px 3px rgba(5,28,44,0.05)' },
  hover: {
    scale: 1.012,
    boxShadow: '0 20px 40px -12px rgba(5,28,44,0.12), 0 8px 20px -8px rgba(5,28,44,0.06)',
    transition: cardSpring,
  },
};

function path(id) {
  return `/concept-1/article/${id}`;
}

function firstForTopic(topicId) {
  return [FEATURED_ARTICLE, ...ARTICLES].find((a) => a.topic.id === topicId) ?? ARTICLES[0];
}

function SectionLabel({ children, className = '' }) {
  return (
    <p className={`font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary ${className}`}>
      {children}
    </p>
  );
}

function ArrowIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function PlayIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

/* ——————————————————————————————————————————————
   Card system
   —————————————————————————————————————————————— */

function FeatureCard({ article }) {
  return (
    <Link to={path(article.id)} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-2" aria-label={`Read ${article.title}`}>
      <motion.article className="relative flex h-full min-h-[280px] overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-blue lg:min-h-[320px]" variants={cardHover} initial="rest" whileHover="hover">
        <div className="absolute inset-0">
          <img src={article.image} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-mckinsey-blue/50 to-mckinsey-blue/10" />
        </div>
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <ContentTypeBadge type={article.type} variant="overlay" />
        </div>
        <div className="relative z-10 mt-auto w-full p-5 text-white md:p-7">
          <TopicTag topic={article.topic} size="xs" />
          <h3 className="mt-3 font-serif text-xl leading-[1.15] tracking-tight text-white md:text-2xl lg:text-[1.65rem]">{article.title}</h3>
          {article.subtitle && <p className="mt-2 font-sans text-sm leading-relaxed text-white/70 line-clamp-2">{article.subtitle}</p>}
          <div className="mt-4 border-t border-white/15 pt-4">
            <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} light />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function StandardCard({ article, dense = false }) {
  return (
    <Link to={path(article.id)} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-2" aria-label={`Read ${article.title}`}>
      <motion.article className="flex h-full flex-col overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-surface" variants={cardHover} initial="rest" whileHover="hover">
        <div className={`relative flex-1 overflow-hidden ${dense ? 'min-h-[120px]' : 'min-h-[150px]'}`}>
          <img src={article.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 z-10"><ContentTypeBadge type={article.type} variant="overlay" /></div>
        </div>
        <div className="shrink-0 p-4 md:p-5">
          <TopicTag topic={article.topic} size="xs" />
          <h3 className={`mt-2.5 font-serif tracking-tight text-mckinsey-text ${dense ? 'text-base leading-snug md:text-lg' : 'text-lg leading-snug md:text-xl'}`}>{article.title}</h3>
          {article.subtitle && !dense && <p className="mt-2 font-sans text-sm leading-relaxed text-mckinsey-text-secondary line-clamp-2">{article.subtitle}</p>}
          <div className="pt-3"><ArticleMeta author={article.author} date={article.date} readTime={article.readTime} /></div>
        </div>
      </motion.article>
    </Link>
  );
}

function MediaCard({ article }) {
  const isVid = article.isVideo || article.type === 'video';
  return (
    <Link to={path(article.id)} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-2" aria-label={`Read ${article.title}`}>
      <motion.article className="relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-blue text-white" variants={cardHover} initial="rest" whileHover="hover">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
          <img src={article.image} alt="" className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-mckinsey-blue/40 to-mckinsey-blue/15" />
          <div className="absolute left-3 top-3 z-10"><ContentTypeBadge type={article.type} variant="overlay" /></div>
          {isVid && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-mckinsey-blue shadow-lg transition-transform duration-500 group-hover:scale-110">
                <PlayIcon className="ml-0.5 h-6 w-6" />
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <TopicTag topic={article.topic} size="xs" />
          <h3 className="mt-2.5 font-serif text-lg leading-snug tracking-tight text-white md:text-xl">{article.title}</h3>
          {article.subtitle && <p className="mt-2 font-sans text-sm leading-relaxed text-white/65 line-clamp-2">{article.subtitle}</p>}
          <div className="mt-auto pt-3"><ArticleMeta author={article.author} date={article.date} readTime={article.readTime} light /></div>
        </div>
      </motion.article>
    </Link>
  );
}

function InsightCard({ article }) {
  const stat = Array.isArray(article.keyTakeaways) && article.keyTakeaways.length > 0 ? article.keyTakeaways[0] : null;
  return (
    <Link to={path(article.id)} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-2" aria-label={`Read ${article.title}`}>
      <motion.article className="flex h-full min-h-[200px] flex-col overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-warm/50 md:flex-row" variants={cardHover} initial="rest" whileHover="hover">
        <div className="relative h-32 shrink-0 overflow-hidden md:h-auto md:w-[36%] md:max-w-[200px]">
          <img src={article.image} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
          <div className="absolute left-2 top-2"><ContentTypeBadge type={article.type} variant="overlay" /></div>
        </div>
        <div className="flex flex-1 flex-col justify-center p-4 md:p-5">
          <TopicTag topic={article.topic} size="xs" />
          {stat && <p className="mt-3 border-l-2 border-mckinsey-blue/25 pl-3 font-serif text-base leading-snug text-mckinsey-blue md:text-lg">{stat}</p>}
          <h3 className="mt-3 font-serif text-base leading-snug tracking-tight text-mckinsey-text md:text-lg">{article.title}</h3>
          <div className="mt-3"><ArticleMeta author={article.author} date={article.date} readTime={article.readTime} /></div>
        </div>
      </motion.article>
    </Link>
  );
}

function CompactCard({ article }) {
  return (
    <Link to={path(article.id)} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-2" aria-label={`Read ${article.title}`}>
      <motion.div className="h-full overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-surface" variants={cardHover} initial="rest" whileHover="hover">
        <div className="flex h-full min-h-[140px] flex-row">
          <div
            className="w-[40%] shrink-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            style={{ backgroundImage: `url(${article.image})` }}
            role="img"
            aria-hidden="true"
          />
          <div className="flex flex-1 flex-col justify-center p-3.5 md:p-4">
            <ContentTypeBadge type={article.type} variant="overlay" />
            <TopicTag topic={article.topic} size="xs" />
            <h3 className="mt-1.5 font-serif text-sm leading-snug tracking-tight text-mckinsey-text line-clamp-2 md:text-base">{article.title}</h3>
            <div className="mt-2"><ArticleMeta author={article.author} date={article.date} readTime={article.readTime} /></div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function MiniCard({ article }) {
  return (
    <Link to={path(article.id)} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-2" aria-label={`Read ${article.title}`}>
      <motion.article className="flex h-full flex-col overflow-hidden rounded-lg border border-mckinsey-border bg-mckinsey-surface" variants={cardHover} initial="rest" whileHover="hover">
        <div className="relative h-28 overflow-hidden sm:h-32">
          <img src={article.image} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="absolute bottom-2 left-2 z-10"><TopicTag topic={article.topic} size="xs" /></div>
        </div>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="font-serif text-sm leading-snug tracking-tight text-mckinsey-text line-clamp-3">{article.title}</h3>
          <p className="mt-1.5 font-sans text-[11px] text-mckinsey-text-tertiary">{article.readTime}</p>
        </div>
      </motion.article>
    </Link>
  );
}

function CardByType({ article }) {
  const t = article.cardType || 'standard';
  if (t === 'feature') return <FeatureCard article={article} />;
  if (t === 'media') return <MediaCard article={article} />;
  if (t === 'insight') return <InsightCard article={article} />;
  return <StandardCard article={article} />;
}

/* ——————————————————————————————————————————————
   Page sections
   —————————————————————————————————————————————— */

function PageTitle() {
  return (
    <motion.section
      className="mx-auto max-w-[1440px] px-4 pt-8 pb-2 sm:px-6 sm:pt-10 lg:px-10 lg:pt-12"
      {...reveal(0)}
    >
      <h1 className="font-serif text-[2.5rem] leading-[1.08] tracking-tight text-mckinsey-blue sm:text-5xl lg:text-[3.25rem]">
        New at McKinsey
      </h1>
      <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-mckinsey-text-secondary">
        Latest thinking, stories, and updates from across the firm
      </p>
    </motion.section>
  );
}

function FeaturedStory() {
  const a = FEATURED_ARTICLE;
  return (
    <motion.section
      id="top"
      className="mx-auto max-w-[1440px] scroll-mt-20 px-4 py-6 sm:px-6 sm:py-8 lg:px-10"
      {...reveal(0.05)}
    >
      <Link
        to={path(a.id)}
        className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-4 focus-visible:ring-offset-mckinsey-bg"
      >
        <motion.div
          className="relative overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-blue"
          whileHover={{ scale: 1.003 }}
          transition={cardSpring}
        >
          <div className="grid lg:grid-cols-12">
            <div className="relative lg:col-span-7">
              <img
                src={a.image}
                alt=""
                className="h-48 w-full object-cover sm:h-56 lg:absolute lg:inset-0 lg:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-mckinsey-blue/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-mckinsey-blue/50 lg:to-mckinsey-blue" />
            </div>
            <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:col-span-5 lg:py-10 lg:pr-10 lg:pl-6">
              <div className="flex flex-wrap items-center gap-2">
                <ContentTypeBadge type={a.type} variant="overlay" />
                <TopicTag topic={a.topic} size="xs" />
              </div>
              <p className="mt-3 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Featured
              </p>
              <h2 className="mt-2 font-serif text-2xl leading-[1.12] tracking-tight text-white sm:text-[1.75rem] lg:text-[2rem]">
                {a.title}
              </h2>
              <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-white/70">
                {a.subtitle}
              </p>
              <div className="mt-5 border-t border-white/12 pt-4">
                <ArticleMeta author={a.author} date={a.date} readTime={a.readTime} light />
              </div>
              <span className="mt-5 inline-flex w-fit items-center gap-2 font-sans text-sm font-medium text-white/80 transition-colors group-hover:text-white">
                Read article <ArrowIcon className="w-3.5 h-3.5 text-white/50 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.section>
  );
}

function ExploreThemes() {
  const rows = useMemo(() => {
    const all = [FEATURED_ARTICLE, ...ARTICLES];
    return TOPICS.map((topic) => ({
      topic,
      count: all.filter((a) => a.topic.id === topic.id).length,
      lead: firstForTopic(topic.id),
    }));
  }, []);

  return (
    <motion.section
      className="border-y border-mckinsey-border/60 bg-mckinsey-surface"
      {...reveal(0)}
    >
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <SectionLabel>Six lenses on the forces reshaping business</SectionLabel>
        <h2 className="mt-2 font-serif text-2xl tracking-tight text-mckinsey-blue sm:text-3xl">
          Explore themes
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {rows.map(({ topic, count, lead }) => (
            <Link
              key={topic.id}
              to={path(lead.id)}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-mckinsey-border bg-mckinsey-bg transition-colors hover:border-mckinsey-blue/20 hover:bg-mckinsey-warm/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-2"
              aria-label={`${topic.label}: ${lead.title}`}
            >
              <div className="relative h-36 overflow-hidden sm:h-44">
                <img
                  src={lead.image}
                  alt=""
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center px-3.5 py-2.5">
                <span className="font-serif text-base font-medium tracking-tight text-mckinsey-blue lg:text-lg">
                  {topic.label}
                </span>
                <span className="mt-1 font-sans text-[11px] text-mckinsey-text-tertiary">
                  {count} {count === 1 ? 'story' : 'stories'}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 font-sans text-[11px] font-medium text-mckinsey-text-tertiary transition-colors group-hover:text-mckinsey-blue">
                  Explore <ArrowIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function TrendingSection() {
  const items = ARTICLES.slice(0, 7);

  return (
    <motion.section
      id="trending"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      {...reveal(0)}
    >
      <div className="mb-8">
        <SectionLabel>Trending now</SectionLabel>
        <h2 className="mt-2 font-serif text-2xl tracking-tight text-mckinsey-blue sm:text-3xl">
          What leaders are reading
        </h2>
        <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-mckinsey-text-secondary">
          Weighted by momentum, depth, and relevance to the decisions shaping industries this quarter.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:gap-5"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        <motion.div className="lg:col-span-7 lg:row-span-2" variants={staggerChild}>
          <CardByType article={items[0]} />
        </motion.div>
        <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-4 lg:col-span-5 lg:row-span-2 lg:grid-cols-1 lg:gap-4">
          <motion.div variants={staggerChild}><CompactCard article={items[1]} /></motion.div>
          <motion.div variants={staggerChild}><CompactCard article={items[2]} /></motion.div>
        </motion.div>
        <motion.div className="lg:col-span-6" variants={staggerChild}><CardByType article={items[3]} /></motion.div>
        <motion.div className="lg:col-span-6" variants={staggerChild}><CardByType article={items[4]} /></motion.div>
        <motion.div className="lg:col-span-12" variants={staggerChild}><InsightCard article={items[5]} /></motion.div>
        <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-2 lg:gap-5" variants={staggerChild}>
          <MiniCard article={items[6]} />
          <MiniCard article={items[5]} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function ImmersiveThemeSection() {
  const rows = useMemo(() => {
    const all = [FEATURED_ARTICLE, ...ARTICLES];
    return TOPICS.map((topic) => ({
      topic,
      count: all.filter((a) => a.topic.id === topic.id).length,
      lead: firstForTopic(topic.id),
    }));
  }, []);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const headerY = useTransform(scrollYProgress, [0, 1], [16, -16]);

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden bg-mckinsey-blue py-14 sm:py-16 lg:py-20"
      {...reveal(0)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_-15%,rgba(74,111,165,0.18),transparent)]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <motion.div style={{ y: headerY }} className="max-w-2xl">
          <SectionLabel className="text-white/40">Explore by theme</SectionLabel>
          <h2 className="mt-2 font-serif text-2xl tracking-tight text-white sm:text-3xl lg:text-[2rem]">
            Corridors into the ideas defining the agenda
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-white/50">
            Each theme opens into a signature story — a starting point for deeper exploration.
          </p>
        </motion.div>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory sm:gap-5 [&::-webkit-scrollbar]:hidden">
          {rows.map(({ topic, count, lead }) => (
            <motion.div
              key={topic.id}
              className="w-[min(100vw-2rem,280px)] shrink-0 snap-center sm:w-[300px] lg:w-[320px]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, ease }}
            >
              <Link
                to={path(lead.id)}
                className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-mckinsey-blue"
                aria-label={`${topic.label}: ${lead.title}`}
              >
                <article className="relative flex h-[360px] flex-col overflow-hidden rounded-xl border border-white/8 bg-white/5 transition-colors group-hover:bg-white/8 sm:h-[400px]">
                  <div className="relative h-[200px] shrink-0 overflow-hidden sm:h-[220px]">
                    <img src={lead.image} alt="" className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.06]" />
                  </div>
                  <div className="flex flex-1 flex-col px-5 py-4">
                    <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-white/40">
                      {count} {count === 1 ? 'story' : 'stories'}
                    </span>
                    <h3 className="mt-1.5 font-serif text-xl leading-tight tracking-tight text-white sm:text-[1.375rem]">
                      {topic.label}
                    </h3>
                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-white/45 line-clamp-2">
                      {lead.title}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 font-sans text-[11px] font-medium text-white/50 transition-colors group-hover:text-white/80">
                      Enter <ArrowIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
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
      className="scroll-mt-24 border-t border-mckinsey-border bg-mckinsey-bg/50 py-12 sm:py-14 lg:py-16"
      {...reveal(0)}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <SectionLabel>Pillar {String(index + 1).padStart(2, '0')}</SectionLabel>
          <h2 className="mt-2 font-serif text-2xl tracking-tight text-mckinsey-blue sm:text-3xl">{pillar.title}</h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-mckinsey-text-secondary">{pillar.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-8">
            <Link to={path(primary.id)} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-2" aria-label={`Read ${primary.title}`}>
              <motion.article className="flex h-full flex-col overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-surface" variants={cardHover} initial="rest" whileHover="hover">
                <div className="relative h-[220px] shrink-0 overflow-hidden sm:h-[260px]">
                  <img src={primary.image} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                  <div className="absolute left-4 top-4 z-10 flex gap-2">
                    <ContentTypeBadge type={primary.type} variant="overlay" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <TopicTag topic={primary.topic} size="xs" />
                  <h3 className="mt-2 font-serif text-xl leading-snug tracking-tight text-mckinsey-text md:text-2xl">{primary.title}</h3>
                  {primary.subtitle && <p className="mt-2 font-sans text-sm leading-relaxed text-mckinsey-text-secondary line-clamp-2">{primary.subtitle}</p>}
                  <div className="mt-auto pt-4"><ArticleMeta author={primary.author} date={primary.date} readTime={primary.readTime} /></div>
                </div>
              </motion.article>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:gap-4">
            {secondary.map((a) => <CompactCard key={a.id} article={a} />)}
          </div>
        </div>

        {rest.length > 0 && (
          <motion.div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
            {rest.map((a) => <motion.div key={a.id} variants={staggerChild}><MiniCard article={a} /></motion.div>)}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

function FeaturedCampaign() {
  const article = ARTICLES[6];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <motion.section ref={ref} className="relative my-2 overflow-hidden sm:my-4" {...reveal(0)}>
      <Link
        to={path(article.id)}
        className="group relative block min-h-[min(70vh,540px)] focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-4 focus-visible:ring-offset-mckinsey-bg"
        aria-label={`Read ${article.title}`}
      >
        <motion.div className="absolute inset-0 -z-10" style={{ y: imgY }}>
          <img src={article.image} alt="" className="h-[115%] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-mckinsey-blue via-mckinsey-blue/80 to-mckinsey-blue/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />

        <div className="relative mx-auto flex min-h-[min(70vh,540px)] max-w-[1440px] flex-col justify-end px-4 pb-12 pt-20 sm:px-6 sm:pb-14 lg:px-10 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="max-w-2xl"
          >
            <div className="flex flex-wrap items-center gap-2">
              <ContentTypeBadge type={article.type} variant="overlay" />
              <TopicTag topic={article.topic} size="xs" />
            </div>
            <h2 className="mt-4 font-serif text-[2rem] leading-[1.1] tracking-tight text-white sm:text-[2.5rem] lg:text-[2.75rem] lg:leading-[1.06]">
              {article.title}
            </h2>
            {article.subtitle && (
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-white/70 sm:text-base">
                {article.subtitle}
              </p>
            )}
            <div className="mt-5 border-t border-white/15 pt-4">
              <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} light />
            </div>
            <span className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-medium text-white/75 transition-colors group-hover:text-white">
              Read the analysis <ArrowIcon className="w-3.5 h-3.5 text-white/45 transition-transform group-hover:translate-x-0.5" />
            </span>
          </motion.div>
        </div>
      </Link>
    </motion.section>
  );
}

function FromOurPeople() {
  const people = [ARTICLES[5], ARTICLES[3], ARTICLES[7]];
  return (
    <motion.section className="bg-mckinsey-warm/60 py-12 sm:py-14 lg:py-16" {...reveal(0)}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionLabel>People &amp; culture</SectionLabel>
        <h2 className="mt-2 font-serif text-2xl tracking-tight text-mckinsey-blue sm:text-3xl">From our people</h2>
        <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-mckinsey-text-secondary">
          Portraits of colleagues advancing client impact across the firm.
        </p>

        <motion.div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
          {people.map((a) => (
            <motion.div key={a.id} variants={staggerChild}>
              <Link to={path(a.id)} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-mckinsey-warm" aria-label={`Read ${a.title}`}>
                <motion.article className="h-[480px] overflow-hidden rounded-xl border border-mckinsey-border bg-mckinsey-surface" variants={cardHover} initial="rest" whileHover="hover">
                  <div className="relative h-[300px] w-full overflow-hidden">
                    <img src={a.author?.image || a.image} alt="" className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                    <div className="absolute left-3 top-3"><ContentTypeBadge type={a.type} variant="overlay" /></div>
                  </div>
                  <div className="p-5">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-mckinsey-text-tertiary">{a.author?.name}</p>
                    <p className="mt-0.5 font-sans text-[11px] text-mckinsey-text-tertiary">{a.author?.role}</p>
                    <h3 className="mt-3 font-serif text-lg leading-snug tracking-tight text-mckinsey-text line-clamp-2">{a.title}</h3>
                    <p className="mt-1.5 font-sans text-sm text-mckinsey-text-secondary line-clamp-2">{a.subtitle}</p>
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

function Recommended() {
  return (
    <motion.section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16" {...reveal(0)}>
      <div className="mb-8">
        <SectionLabel>Recommended for you</SectionLabel>
        <h2 className="mt-2 font-serif text-2xl tracking-tight text-mckinsey-blue sm:text-3xl">Curated for depth</h2>
        <p className="mt-2 max-w-xl font-sans text-sm text-mckinsey-text-secondary">
          Long-form perspectives selected for strategic relevance.
        </p>
      </div>
      <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
        {RECOMMENDED.map((a) => (
          <motion.div key={a.id} variants={staggerChild}>
            <StandardCard article={a} dense />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

/* ——————————————————————————————————————————————
   Main layout
   —————————————————————————————————————————————— */

export default function BentoLanding() {
  return (
    <div className="min-h-screen bg-mckinsey-bg font-sans text-mckinsey-text antialiased">
      <SiteNav />
      <main>
        <PageTitle />
        <FeaturedStory />
        <ExploreThemes />
        <TrendingSection />
        <ImmersiveThemeSection />
        {PILLARS.map((pillar, i) => (
          <PillarSection key={pillar.id} pillar={pillar} index={i} />
        ))}
        <FeaturedCampaign />
        <FromOurPeople />
        <Recommended />
      </main>
      <SiteFooter />
    </div>
  );
}
