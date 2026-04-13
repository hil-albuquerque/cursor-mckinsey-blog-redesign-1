import { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArticleNav from '../components/ArticleNav.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import RelatedContent from '../components/RelatedContent.jsx';
import NextArticle from '../components/NextArticle.jsx';
import ShareBar from '../components/ShareBar.jsx';
import ReadingProgress from '../components/ReadingProgress.jsx';
import TopicTag from '../../../components/TopicTag.jsx';
import ArticleMeta from '../../../components/ArticleMeta.jsx';
import ContentTypeBadge from '../../../components/ContentTypeBadge.jsx';
import { getRelatedArticles, getNextArticle } from '../../../data/content.js';

const easeOut = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.65, ease: easeOut },
  }),
};

const revealBlock = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeOut },
  },
};

const galleryImage = {
  hidden: { opacity: 0, y: 64, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.85, ease: easeOut },
  },
};

const pullquoteEnter = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
};

function ScrollIndicator() {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-10"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.6, ease: easeOut }}
      aria-hidden
    >
      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-white/55">
        Scroll
      </span>
      <motion.div
        className="flex h-9 w-5 justify-center rounded-full border border-white/35 pt-1.5"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-white/80" />
      </motion.div>
    </motion.div>
  );
}

function HeroPlayButton({ onClick, visible, disabled = false }) {
  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.92,
      }}
      transition={{ duration: 0.35, ease: easeOut }}
      whileHover={disabled ? {} : { scale: 1.06 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      aria-disabled={disabled}
      className={`group absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-28 sm:w-28 ${
        disabled ? 'cursor-default opacity-80' : ''
      }`}
      aria-label={disabled ? 'Video unavailable' : 'Play video'}
    >
      <span className="ml-1 flex h-0 w-0 border-y-[14px] border-l-[22px] border-y-transparent border-l-white sm:border-y-[16px] sm:border-l-[26px]" />
      <span className="pointer-events-none absolute inset-0 rounded-full bg-white/0 transition-colors group-hover:bg-white/10" />
    </motion.button>
  );
}

function GallerySection({ images, paragraphPool, pillar }) {
  if (!images?.length) return null;

  return (
    <section className="bg-mckinsey-bg py-16 sm:py-24 lg:py-32" aria-label="Image gallery">
      <div className="mx-auto max-w-[1600px] px-0 sm:px-6 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14 } },
          }}
          className="flex flex-col gap-16 sm:gap-24 lg:gap-32"
        >
          {images.map((src, index) => {
            const caption =
              paragraphPool[index] ??
              paragraphPool[paragraphPool.length - 1] ??
              pillar ??
              '';
            const reverse = index % 2 === 1;

            return (
              <motion.article
                key={`${src}-${index}`}
                variants={galleryImage}
                viewport={{ once: true, margin: '-60px' }}
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
              >
                <div
                  className={`lg:col-span-8 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="overflow-hidden shadow-[0_40px_100px_-40px_rgba(5,28,44,0.45)] lg:rounded-lg"
                  >
                    <img
                      src={src}
                      alt=""
                      className="aspect-[21/9] w-full object-cover sm:aspect-[2/1] lg:min-h-[420px]"
                      loading="lazy"
                    />
                  </motion.div>
                </div>
                <div
                  className={`px-4 sm:px-0 lg:col-span-4 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-mckinsey-text-tertiary">
                    {String(index + 1).padStart(2, '0')} — Gallery
                  </p>
                  <p className="mt-4 font-serif text-xl leading-relaxed text-mckinsey-text sm:text-2xl">
                    {caption}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function AuthorProfileCard({ author }) {
  if (!author?.name) return null;

  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={revealBlock}
      className="mt-16 border border-mckinsey-border bg-mckinsey-surface p-6 sm:mt-20 sm:p-8 lg:mt-24"
    >
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
        About the author
      </p>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-mckinsey-border bg-mckinsey-warm sm:h-28 sm:w-28"
        >
          {author.image ? (
            <img src={author.image} alt="" className="h-full w-full object-cover" />
          ) : null}
        </motion.div>
        <div>
          <p className="font-serif text-xl font-semibold text-mckinsey-blue">{author.name}</p>
          {author.role ? (
            <p className="mt-1 font-sans text-sm leading-relaxed text-mckinsey-text-secondary">
              {author.role}
            </p>
          ) : null}
        </div>
      </div>
    </motion.aside>
  );
}

function BodyBlocks({ blocks }) {
  return (
    <div className="space-y-8 sm:space-y-10">
      {blocks.map((block, idx) => {
        if (block.type === 'pullquote') {
          return (
            <motion.section
              key={`pq-${idx}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-12%' }}
              variants={pullquoteEnter}
              className="relative left-1/2 right-1/2 -mx-[50vw] mt-14 mb-14 w-screen bg-mckinsey-blue sm:mt-20 sm:mb-20"
            >
              <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:px-10 sm:py-24 lg:py-28">
                <blockquote className="font-serif text-[clamp(1.35rem,2.8vw,2.15rem)] font-medium leading-[1.35] tracking-tight text-white">
                  <span className="text-mckinsey-gold/90" aria-hidden>
                    “
                  </span>
                  {block.content}
                  <span className="text-mckinsey-gold/90" aria-hidden>
                    ”
                  </span>
                </blockquote>
                <motion.div
                  className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-mckinsey-teal to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: easeOut }}
                />
              </div>
            </motion.section>
          );
        }

        if (block.type === 'heading') {
          return (
            <motion.h2
              key={`h-${idx}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={revealBlock}
              className="font-serif text-2xl font-semibold tracking-tight text-mckinsey-blue sm:text-3xl lg:text-[2rem]"
            >
              {block.content}
            </motion.h2>
          );
        }

        return (
          <motion.p
            key={`p-${idx}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={revealBlock}
            className="font-sans text-lg leading-[1.75] text-mckinsey-text-secondary sm:text-[1.125rem]"
          >
            {block.content}
          </motion.p>
        );
      })}
    </div>
  );
}

export default function MediaArticle({ article }) {
  const heroRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const heroOverlayOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 48]);

  const related = useMemo(() => getRelatedArticles(article, 4), [article]);
  const nextArticle = useMemo(() => getNextArticle(article), [article]);

  const paragraphPool = useMemo(() => {
    const paras = article.body?.filter((b) => b.type === 'paragraph').map((b) => b.content) ?? [];
    return paras;
  }, [article.body]);

  const handlePlay = () => {
    if (article.heroVideo) setVideoPlaying(true);
  };

  return (
    <div className="min-h-screen bg-mckinsey-bg text-mckinsey-text">
      <ReadingProgress />
      <ArticleNav />

      <section
        ref={heroRef}
        className="relative h-[100dvh] min-h-[28rem] w-full overflow-hidden bg-mckinsey-blue"
        aria-label="Article hero"
      >
        <motion.div
          className="absolute inset-0 h-[120%] w-full -top-[10%]"
          style={{ y: heroImageY, scale: heroImageScale }}
        >
          {videoPlaying && article.heroVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={article.heroVideo}
              poster={article.image}
              autoPlay
              playsInline
              controls
              aria-label="Featured video"
            />
          ) : (
            <img
              src={article.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-mckinsey-blue via-mckinsey-blue/55 to-mckinsey-blue/20"
            style={{ opacity: heroOverlayOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-mckinsey-blue/50 via-transparent to-transparent" />
        </motion.div>

        {article.isVideo && !videoPlaying ? (
          <HeroPlayButton
            onClick={handlePlay}
            visible
            disabled={!article.heroVideo}
          />
        ) : null}

        <div className="relative z-10 flex h-full flex-col justify-end pb-16 pt-28 sm:pb-24 sm:pt-32">
          <motion.div
            className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10"
            style={{ y: heroTextY }}
          >
            <motion.div
              className="mb-5 flex flex-wrap items-center gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
              }}
            >
              <motion.div variants={fadeUp} custom={0}>
                <TopicTag topic={article.topic} size="md" />
              </motion.div>
              <motion.div variants={fadeUp} custom={1}>
                <ContentTypeBadge type={article.type} variant="overlay" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="max-w-4xl font-serif text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-tight text-white"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.75, ease: easeOut }}
            >
              {article.title}
            </motion.h1>

            {article.subtitle ? (
              <motion.p
                className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-white/85 sm:text-lg"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: easeOut }}
              >
                {article.subtitle}
              </motion.p>
            ) : null}

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: easeOut }}
            >
              <ArticleMeta
                author={article.author}
                date={article.date}
                readTime={article.readTime}
                light
              />
            </motion.div>
          </motion.div>
        </div>

        <ScrollIndicator />
      </section>

      <GallerySection
        images={article.galleryImages}
        paragraphPool={paragraphPool}
        pillar={article.pillar}
      />

      <main className="relative mx-auto max-w-[1600px] px-4 pb-20 sm:px-6 lg:px-10 lg:pb-28">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_52rem_minmax(0,1fr)] lg:gap-10">
          <div className="hidden lg:block" />
          <div className="relative min-w-0 pt-12 sm:pt-16 lg:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: easeOut }}
              className="mb-10 flex flex-col gap-6 border-b border-mckinsey-border pb-10 sm:mb-12 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="max-w-3xl">
                {article.pillar ? (
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-mckinsey-text-tertiary">
                    {article.pillar}
                  </p>
                ) : null}
                <p className="mt-3 font-serif text-xl leading-snug text-mckinsey-text sm:text-2xl">
                  {article.subtitle}
                </p>
              </div>
            </motion.div>

            <div className="hidden xl:block">
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: easeOut }}
                className="absolute -right-4 top-2 xl:-right-2 2xl:right-8"
              >
                <div className="sticky top-32">
                  <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
                    Share
                  </p>
                  <ShareBar title={article.title} vertical />
                </div>
              </motion.div>
            </div>

            <div className="mb-10 xl:hidden">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
                Share
              </p>
              <div className="mt-3">
                <ShareBar title={article.title} vertical={false} className="justify-start" />
              </div>
            </div>

            <article className="max-w-3xl">
              <BodyBlocks blocks={article.body ?? []} />
              <AuthorProfileCard author={article.author} />
            </article>
          </div>
          <div className="hidden lg:block" />
        </div>
      </main>

      <RelatedContent articles={related} currentArticleId={article.id} />
      <NextArticle article={nextArticle} />
      <SiteFooter />
    </div>
  );
}
