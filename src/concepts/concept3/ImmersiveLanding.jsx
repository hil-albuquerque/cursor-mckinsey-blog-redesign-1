import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion, useScroll, useTransform, useSpring } from 'framer-motion';
import McKinseyLogo from '../../components/McKinseyLogo.jsx';
import TopicTag from '../../components/TopicTag.jsx';
import ArticleMeta from '../../components/ArticleMeta.jsx';
import ContentTypeBadge from '../../components/ContentTypeBadge.jsx';
import {
  FEATURED_ARTICLE,
  ARTICLES,
  TOPICS,
  RECOMMENDED,
  INDUSTRIES,
} from '../../data/content.js';

const NAV_LINKS = [
  { id: 'featured', label: 'Featured' },
  { id: 'themes', label: 'Themes' },
  { id: 'impact', label: 'Impact' },
  { id: 'video', label: 'Video' },
  { id: 'people', label: 'People' },
  { id: 'recommended', label: 'For You' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

function scrollToId(id) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function useTopicHeroImage(topicId) {
  return useMemo(() => {
    const match = ARTICLES.find((a) => a.topic.id === topicId);
    return match?.image ?? FEATURED_ARTICLE.image;
  }, [topicId]);
}

function StickyHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? 'bg-mckinsey-surface/95 shadow-sm backdrop-blur-md border-b border-mckinsey-border'
          : 'bg-transparent'
      }`}
      initial={false}
      animate={{ height: solid ? 64 : 72 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
          aria-label="McKinsey Blog home"
        >
          <McKinseyLogo
            className="h-5 w-auto sm:h-6"
            color={solid ? '#051C2C' : '#FFFFFF'}
          />
        </a>
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Section navigation"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToId(link.id)}
              className={`rounded px-3 py-2 font-sans text-xs font-medium tracking-wide uppercase transition-colors ${
                solid
                  ? 'text-mckinsey-text-secondary hover:text-mckinsey-blue'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <Motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`rounded-full px-4 py-2 font-sans text-xs font-semibold tracking-wide uppercase transition-colors ${
            solid
              ? 'bg-mckinsey-blue text-white hover:bg-mckinsey-blue-light'
              : 'bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25'
          }`}
        >
          Subscribe
        </Motion.button>
      </div>
    </Motion.header>
  );
}

function ScrollIndicator() {
  return (
    <Motion.div
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      aria-hidden
    >
      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.25em]">
        Scroll
      </span>
      <Motion.div
        className="h-9 w-5 rounded-full border border-white/40"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      >
        <Motion.div
          className="mx-auto mt-2 h-1.5 w-1.5 rounded-full bg-white"
          animate={{ opacity: [0.4, 1, 0.4], y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
      </Motion.div>
    </Motion.div>
  );
}

function ParallaxHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0.35]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-mckinsey-blue"
    >
      <Motion.div
        style={{ y, scale }}
        className="absolute inset-0 h-[120%] w-full will-change-transform"
      >
        <img
          src={FEATURED_ARTICLE.image}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mckinsey-blue/55 via-mckinsey-blue/35 to-mckinsey-blue/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
      </Motion.div>

      <Motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col justify-end px-4 pb-28 pt-32 sm:px-8 lg:px-16 lg:pb-36"
      >
        <div className="mx-auto w-full max-w-5xl">
          <Motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <Motion.div variants={staggerItem}>
              <ContentTypeBadge type="article" variant="overlay" />
            </Motion.div>
            <Motion.h1
              variants={staggerItem}
              className="font-serif text-4xl font-medium leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Ideas that move industries forward
            </Motion.h1>
            <Motion.p
              variants={staggerItem}
              className="max-w-2xl font-sans text-base leading-relaxed text-white/85 sm:text-lg md:text-xl"
            >
              {FEATURED_ARTICLE.subtitle}
            </Motion.p>
            <Motion.div variants={staggerItem} className="pt-2">
              <ArticleMeta
                author={FEATURED_ARTICLE.author}
                date={FEATURED_ARTICLE.date}
                readTime={FEATURED_ARTICLE.readTime}
                light
              />
            </Motion.div>
            <Motion.div variants={staggerItem} className="flex flex-wrap gap-3 pt-4">
              <Motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToId('featured')}
                className="rounded-full bg-white px-6 py-3 font-sans text-sm font-semibold text-mckinsey-blue shadow-lg shadow-black/20"
              >
                Begin the story
              </Motion.button>
              <Motion.button
                type="button"
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToId('themes')}
                className="rounded-full border border-white/40 bg-white/10 px-6 py-3 font-sans text-sm font-semibold text-white backdrop-blur"
              >
                Explore themes
              </Motion.button>
            </Motion.div>
          </Motion.div>
        </div>
      </Motion.div>
      <ScrollIndicator />
    </section>
  );
}

function StoryBeatSection() {
  return (
    <section className="relative bg-mckinsey-bg px-4 py-24 sm:px-8 sm:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-3xl text-center">
        <Motion.p
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-2xl font-normal leading-snug text-mckinsey-text sm:text-3xl md:text-4xl"
        >
          McKinsey Blog is an editorial destination for leaders navigating
          technology, sustainability, talent, and growth — told with the depth
          of research and the clarity of a single narrative thread.
        </Motion.p>
        <Motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-12 h-px w-24 origin-center bg-mckinsey-gold"
        />
      </div>
    </section>
  );
}

function FeaturedStorySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section
      id="featured"
      ref={ref}
      className="scroll-mt-20 bg-mckinsey-warm px-0 py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-10">
        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
              Featured story
            </span>
            <h2 className="mt-2 font-serif text-3xl text-mckinsey-blue sm:text-4xl md:text-5xl">
              The piece defining the moment
            </h2>
          </div>
          <TopicTag topic={FEATURED_ARTICLE.topic} size="md" />
        </Motion.div>

        <Motion.article
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="group overflow-hidden rounded-2xl bg-mckinsey-surface shadow-xl shadow-mckinsey-border/40 ring-1 ring-mckinsey-border/60"
        >
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative aspect-[4/3] min-h-[280px] overflow-hidden lg:aspect-auto lg:min-h-[480px]">
              <Motion.div style={{ y: imageY }} className="absolute inset-0 h-[115%] w-full">
                <Motion.img
                  src={FEATURED_ARTICLE.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </Motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent lg:bg-gradient-to-r" />
              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <ContentTypeBadge type={FEATURED_ARTICLE.type} variant="overlay" />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:p-14">
              <h3 className="font-serif text-2xl leading-tight text-mckinsey-text sm:text-3xl md:text-4xl">
                {FEATURED_ARTICLE.title}
              </h3>
              <p className="font-sans text-base leading-relaxed text-mckinsey-text-secondary sm:text-lg">
                {FEATURED_ARTICLE.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-sans text-xs font-medium uppercase tracking-wide text-mckinsey-text-tertiary">
                  {FEATURED_ARTICLE.pillar}
                </span>
              </div>
              <ArticleMeta
                author={FEATURED_ARTICLE.author}
                date={FEATURED_ARTICLE.date}
                readTime={FEATURED_ARTICLE.readTime}
              />
              <Motion.button
                type="button"
                whileHover={{ x: 4 }}
                className="group/btn inline-flex items-center gap-2 font-sans text-sm font-semibold text-mckinsey-accent"
              >
                Read the full analysis
                <span
                  className="transition-transform group-hover/btn:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </Motion.button>
            </div>
          </div>
        </Motion.article>
      </div>
    </section>
  );
}

function ThemeCard({ topic, index }) {
  const image = useTopicHeroImage(topic.id);
  return (
    <Motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="group relative min-w-[min(100%,320px)] flex-1 snap-center sm:min-w-[380px] lg:min-w-[420px]"
    >
      <Motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-mckinsey-blue shadow-lg ring-1 ring-black/5"
      >
        <Motion.img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-mckinsey-blue/40 to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <TopicTag topic={topic} size="sm" />
          <h3 className="mt-4 font-serif text-2xl text-white sm:text-3xl">
            {topic.label}
          </h3>
          <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-white/75">
            Curated perspectives from McKinsey on {topic.label.toLowerCase()}{' '}
            and what it means for leaders.
          </p>
          <Motion.span
            className="mt-6 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-white/90"
            initial={false}
            whileHover={{ x: 4 }}
          >
            View collection
            <span aria-hidden>→</span>
          </Motion.span>
        </div>
      </Motion.div>
    </Motion.div>
  );
}

function ExploreThemesSection() {
  return (
    <section
      id="themes"
      className="scroll-mt-20 bg-mckinsey-surface py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-10">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-12 max-w-2xl"
        >
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
            Explore by theme
          </span>
          <h2 className="mt-3 font-serif text-3xl text-mckinsey-blue sm:text-4xl md:text-5xl">
            Six lenses on the forces reshaping business
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-mckinsey-text-secondary">
            Each theme brings together articles, case studies, and multimedia
            from across the firm — designed for depth, not noise.
          </p>
        </Motion.div>

        <div className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-4 pt-2 snap-x snap-mandatory scrollbar-thin sm:mx-0 sm:px-0 md:gap-6">
          {TOPICS.map((topic, i) => (
            <ThemeCard key={topic.id} topic={topic} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const IMPACT_ARTICLES = ARTICLES.filter(
  (a) =>
    a.type === 'impact' ||
    a.pillar === 'Positive societal impact'
).slice(0, 3);

function ImpactStoryPanel({ article, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  const isEven = index % 2 === 0;

  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.9 }}
      className="relative min-h-[85vh] w-full overflow-hidden bg-mckinsey-blue"
    >
      <Motion.div style={{ y }} className="absolute inset-0 h-[110%] w-full">
        <img
          src={article.image}
          alt=""
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
      </Motion.div>
      <div
        className={`relative z-10 flex min-h-[85vh] items-end px-4 py-20 sm:px-10 lg:px-20 lg:py-28 ${
          isEven ? '' : 'lg:justify-end'
        }`}
      >
        <Motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl lg:max-w-2xl"
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <ContentTypeBadge type={article.type} variant="overlay" />
            <TopicTag topic={article.topic} size="sm" />
          </div>
          <h3 className="font-serif text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
            {article.title}
          </h3>
          <p className="mt-5 font-sans text-base leading-relaxed text-white/85 sm:text-lg">
            {article.subtitle}
          </p>
          <div className="mt-6">
            <ArticleMeta
              author={article.author}
              date={article.date}
              readTime={article.readTime}
              light
            />
          </div>
          <Motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-wide text-mckinsey-blue"
          >
            Read impact story
          </Motion.button>
        </Motion.div>
      </div>
    </Motion.div>
  );
}

function ImpactStoriesSection() {
  return (
    <section id="impact" className="scroll-mt-20">
      <div className="bg-mckinsey-blue px-4 py-16 text-center sm:px-8 lg:px-16 lg:py-20">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            Impact stories
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl text-white sm:text-4xl md:text-5xl">
            Where ambition meets responsibility
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-base text-white/75">
            Field notes from teams helping clients deliver measurable outcomes
            for business, society, and the planet.
          </p>
        </Motion.div>
      </div>
      {IMPACT_ARTICLES.map((article, i) => (
        <ImpactStoryPanel key={article.id} article={article} index={i} />
      ))}
    </section>
  );
}

function VideoShowcaseSection() {
  const video = ARTICLES.find((a) => a.isVideo || a.type === 'video');
  if (!video) return null;

  return (
    <section
      id="video"
      className="scroll-mt-20 bg-mckinsey-blue py-20 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-10">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-10 max-w-2xl"
        >
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Video
          </span>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl md:text-5xl">
            Watch: leadership in motion
          </h2>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10"
        >
          <div className="relative aspect-video w-full bg-black">
            <Motion.img
              src={video.image}
              alt=""
              className="h-full w-full object-cover opacity-75 transition-opacity duration-500 group-hover:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
              <ContentTypeBadge type="video" variant="overlay" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6 text-center">
              <Motion.button
                type="button"
                aria-label="Play video"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-mckinsey-blue shadow-2xl shadow-black/50 backdrop-blur"
              >
                <span className="ml-1 text-2xl" aria-hidden>
                  ▶
                </span>
              </Motion.button>
              <div className="max-w-2xl space-y-3">
                <h3 className="font-serif text-2xl text-white sm:text-3xl md:text-4xl">
                  {video.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-white/80 sm:text-base">
                  {video.subtitle}
                </p>
                <div className="flex justify-center pt-2">
                  <ArticleMeta
                    author={video.author}
                    date={video.date}
                    readTime={video.readTime}
                    light
                  />
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
}

const PEOPLE_ARTICLES = [
  ARTICLES[5],
  ARTICLES[3],
  ARTICLES[7],
  ARTICLES[0],
].filter(Boolean);

function PeopleCard({ article, index }) {
  return (
    <Motion.article
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="flex flex-col overflow-hidden rounded-2xl bg-mckinsey-surface shadow-md ring-1 ring-mckinsey-border/80"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-mckinsey-warm-dark">
        <Motion.img
          src={article.image}
          alt=""
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mckinsey-blue/70 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <ContentTypeBadge type={article.type} variant="overlay" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <TopicTag topic={article.topic} size="xs" />
        <h3 className="font-serif text-xl leading-snug text-mckinsey-text">
          {article.title}
        </h3>
        <p className="line-clamp-3 font-sans text-sm leading-relaxed text-mckinsey-text-secondary">
          {article.subtitle}
        </p>
        <div className="mt-auto pt-2">
          <ArticleMeta
            author={article.author}
            date={article.date}
            readTime={article.readTime}
          />
        </div>
      </div>
    </Motion.article>
  );
}

function OurPeopleSection() {
  return (
    <section
      id="people"
      className="scroll-mt-20 bg-mckinsey-warm px-4 py-20 sm:px-8 sm:py-28 lg:px-16 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12 max-w-2xl"
        >
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
            Our people
          </span>
          <h2 className="mt-3 font-serif text-3xl text-mckinsey-blue sm:text-4xl md:text-5xl">
            Voices from the work
          </h2>
          <p className="mt-4 font-sans text-base text-mckinsey-text-secondary">
            Portraits of the experts behind the insights — how they think, what
            they see, and why it matters for your agenda.
          </p>
        </Motion.div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PEOPLE_ARTICLES.map((article, i) => (
            <PeopleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecommendedCarousel() {
  const scrollerRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 8);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scrollByDir = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(el.clientWidth * 0.85, 480),
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="recommended"
      className="scroll-mt-20 bg-mckinsey-bg px-4 py-20 sm:px-8 sm:py-28 lg:px-16 lg:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
              Recommended for you
            </span>
            <h2 className="mt-3 font-serif text-3xl text-mckinsey-blue sm:text-4xl md:text-5xl">
              Continue your reading
            </h2>
          </Motion.div>
          <div className="flex gap-2">
            <Motion.button
              type="button"
              aria-label="Scroll recommendations left"
              disabled={!canLeft}
              whileHover={canLeft ? { scale: 1.05 } : {}}
              whileTap={canLeft ? { scale: 0.95 } : {}}
              onClick={() => scrollByDir(-1)}
              className={`rounded-full border px-4 py-2 font-sans text-sm font-semibold ${
                canLeft
                  ? 'border-mckinsey-border bg-mckinsey-surface text-mckinsey-blue hover:bg-mckinsey-warm'
                  : 'cursor-not-allowed border-mckinsey-border/50 text-mckinsey-text-tertiary'
              }`}
            >
              ←
            </Motion.button>
            <Motion.button
              type="button"
              aria-label="Scroll recommendations right"
              disabled={!canRight}
              whileHover={canRight ? { scale: 1.05 } : {}}
              whileTap={canRight ? { scale: 0.95 } : {}}
              onClick={() => scrollByDir(1)}
              className={`rounded-full border px-4 py-2 font-sans text-sm font-semibold ${
                canRight
                  ? 'border-mckinsey-border bg-mckinsey-surface text-mckinsey-blue hover:bg-mckinsey-warm'
                  : 'cursor-not-allowed border-mckinsey-border/50 text-mckinsey-text-tertiary'
              }`}
            >
              →
            </Motion.button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {RECOMMENDED.map((article, index) => (
            <Motion.article
              key={article.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: index * 0.08,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              className="group relative min-w-[min(100%,300px)] max-w-[340px] flex-1 snap-start overflow-hidden rounded-2xl bg-mckinsey-surface shadow-lg ring-1 ring-mckinsey-border/70 sm:min-w-[300px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={article.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <ContentTypeBadge type={article.type} variant="overlay" />
                </div>
              </div>
              <div className="space-y-3 p-5">
                <TopicTag topic={article.topic} size="xs" />
                <h3 className="font-serif text-lg leading-snug text-mckinsey-text line-clamp-3">
                  {article.title}
                </h3>
                <ArticleMeta
                  author={article.author}
                  date={article.date}
                  readTime={article.readTime}
                />
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-mckinsey-border bg-mckinsey-surface px-4 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <McKinseyLogo className="h-5 w-auto" color="#051C2C" />
        <p className="max-w-md font-sans text-sm text-mckinsey-text-secondary">
          McKinsey Blog — perspectives on the defining issues for leaders. This
          concept explores an immersive, editorial presentation; content is
          illustrative.
        </p>
        <div className="flex flex-wrap gap-4 font-sans text-xs font-medium uppercase tracking-wide text-mckinsey-text-tertiary">
          {INDUSTRIES.slice(0, 4).map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function ImmersiveLanding() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-mckinsey-bg text-mckinsey-text">
      <Motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-mckinsey-accent"
        style={{ scaleX }}
        aria-hidden
      />
      <StickyHeader />
      <main>
        <ParallaxHero />
        <StoryBeatSection />
        <FeaturedStorySection />
        <ExploreThemesSection />
        <ImpactStoriesSection />
        <VideoShowcaseSection />
        <OurPeopleSection />
        <RecommendedCarousel />
        <SiteFooter />
      </main>
    </div>
  );
}
