import { useMemo } from 'react';
import { motion } from 'framer-motion';

import ArticleNav from '../components/ArticleNav';
import SiteFooter from '../components/SiteFooter';
import RelatedContent from '../components/RelatedContent';
import NextArticle from '../components/NextArticle';
import ShareBar from '../components/ShareBar';
import ReadingProgress from '../components/ReadingProgress';

import TopicTag from '../../../components/TopicTag';
import ArticleMeta from '../../../components/ArticleMeta';

import { getRelatedArticles, getNextArticle } from '../../../data/content';

const easeOut = [0.22, 1, 0.36, 1];

const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.05 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: easeOut },
  },
};

const heroImageReveal = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.88, ease: easeOut, delay: 0.12 },
  },
};

const sectionReveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px 0px' },
  transition: { duration: 0.6, ease: easeOut },
};

const bodyStaggerParent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.052, delayChildren: 0.06 },
  },
};

const bodyStaggerChild = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: easeOut },
  },
};

const railReveal = {
  initial: { opacity: 0, x: -12 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-60px 0px' },
  transition: { duration: 0.5, ease: easeOut },
};

function BodyBlock({ block, isFirstHeading }) {
  switch (block.type) {
    case 'heading':
      return (
        <motion.h2
          variants={bodyStaggerChild}
          className={`font-serif text-2xl sm:text-[1.65rem] font-medium leading-snug tracking-tight text-mckinsey-blue mb-6 ${
            isFirstHeading ? 'mt-0' : 'mt-14 sm:mt-16'
          }`}
        >
          {block.content}
        </motion.h2>
      );
    case 'pullquote':
      return (
        <motion.figure
          variants={bodyStaggerChild}
          className="my-12 sm:my-16 pl-6 sm:pl-8 border-l-[3px] border-mckinsey-accent"
        >
          <blockquote className="font-serif text-xl sm:text-2xl md:text-[1.65rem] leading-relaxed italic text-mckinsey-text">
            {block.content}
          </blockquote>
        </motion.figure>
      );
    case 'paragraph':
    default:
      return (
        <motion.p
          variants={bodyStaggerChild}
          className="font-sans text-[1.0625rem] sm:text-lg leading-[1.75] text-mckinsey-text-secondary mb-7 last:mb-0"
        >
          {block.content}
        </motion.p>
      );
  }
}

function AuthorByline({ author }) {
  if (!author?.name) return null;

  return (
    <div className="flex items-start gap-4 justify-center sm:justify-center text-left max-w-lg mx-auto">
      {author.image ? (
        <div className="shrink-0">
          <img
            src={author.image}
            alt=""
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover ring-1 ring-mckinsey-border/80 shadow-sm"
          />
        </div>
      ) : null}
      <div className="min-w-0 pt-1">
        <p className="font-sans text-[15px] font-semibold text-mckinsey-text tracking-tight">{author.name}</p>
        {author.role ? (
          <p className="font-sans text-sm text-mckinsey-text-tertiary mt-1.5 leading-snug">{author.role}</p>
        ) : null}
      </div>
    </div>
  );
}

function PublicationStrip({ article }) {
  const topic = article?.topic;

  return (
    <motion.aside
      {...railReveal}
      className="mb-12 sm:mb-14 rounded-sm border border-mckinsey-border/70 bg-mckinsey-warm/40 px-5 py-5 sm:px-6 sm:py-6"
      aria-label="Article details"
    >
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 font-sans text-sm">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mckinsey-text-tertiary">
            Published
          </dt>
          <dd className="mt-1.5 text-mckinsey-text-secondary">{article?.date ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mckinsey-text-tertiary">
            Reading time
          </dt>
          <dd className="mt-1.5 text-mckinsey-text-secondary">{article?.readTime ?? '—'}</dd>
        </div>
        {topic?.label ? (
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mckinsey-text-tertiary">
              Topic
            </dt>
            <dd className="mt-1.5">
              <span className="text-mckinsey-text-secondary">{topic.label}</span>
            </dd>
          </div>
        ) : null}
      </dl>
    </motion.aside>
  );
}

export default function EditorialArticle({ article }) {
  const relatedArticles = useMemo(() => getRelatedArticles(article), [article]);
  const nextArticle = useMemo(() => getNextArticle(article), [article]);
  const bodyBlocks = Array.isArray(article?.body) ? article.body : [];

  const firstHeadingIndex = bodyBlocks.findIndex((b) => b.type === 'heading');

  const pillarLabel = article?.pillar;

  return (
    <div className="min-h-screen bg-mckinsey-bg text-mckinsey-text antialiased">
      <ReadingProgress />

      <ArticleNav />

      <main id="main-content">
        <header className="relative overflow-hidden border-b border-mckinsey-border/60 bg-mckinsey-surface">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-mckinsey-warm/30 via-transparent to-transparent" />

          <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-12 sm:pb-16">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              variants={heroContainer}
              initial="hidden"
              animate="show"
            >
              {pillarLabel ? (
                <motion.p
                  variants={heroItem}
                  className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-mckinsey-text-tertiary mb-6"
                >
                  {pillarLabel}
                </motion.p>
              ) : null}

              <motion.h1
                id="article-title"
                variants={heroItem}
                className="font-serif text-[2rem] sm:text-4xl md:text-[2.75rem] lg:text-[3.1rem] font-medium leading-[1.12] tracking-tight text-mckinsey-blue"
              >
                {article?.title}
              </motion.h1>

              {article?.subtitle ? (
                <motion.p
                  variants={heroItem}
                  className="mt-6 font-sans text-lg sm:text-xl leading-relaxed text-mckinsey-text-secondary max-w-2xl mx-auto"
                >
                  {article.subtitle}
                </motion.p>
              ) : null}

              {article?.topic ? (
                <motion.div variants={heroItem} className="mt-8 flex justify-center">
                  <TopicTag topic={article.topic} size="md" />
                </motion.div>
              ) : null}

              <motion.div variants={heroItem} className="mt-6 flex justify-center">
                <ArticleMeta date={article?.date} readTime={article?.readTime} />
              </motion.div>

              <motion.div variants={heroItem} className="mt-8">
                <AuthorByline author={article?.author} />
              </motion.div>
            </motion.div>

            {article?.image ? (
              <motion.div
                variants={heroImageReveal}
                initial="hidden"
                animate="show"
                className="mt-12 sm:mt-16 mx-auto max-w-[1100px]"
              >
                <div className="relative overflow-hidden rounded-sm bg-mckinsey-warm-dark shadow-[0_1px_0_rgba(5,28,44,0.06)] ring-1 ring-mckinsey-border/50">
                  <div className="aspect-[16/9] sm:aspect-[21/9] w-full">
                    <img
                      src={article.image}
                      alt=""
                      className="h-full w-full object-cover"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        </header>

        <div className="relative">
          <div
            className="pointer-events-none fixed z-30 bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom,0px)] xl:bottom-auto xl:left-[max(1rem,calc((100vw-42rem)/2-5.5rem))] xl:right-auto xl:top-1/2 xl:-translate-y-1/2 xl:pb-0"
          >
            <div className="pointer-events-auto flex justify-center px-4 pb-4 xl:justify-start xl:p-0">
              <div className="w-full max-w-md rounded-lg border border-mckinsey-border/80 bg-mckinsey-surface/95 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-mckinsey-surface/85 xl:max-w-none xl:rounded-none xl:border-0 xl:bg-transparent xl:shadow-none xl:backdrop-blur-none">
                <ShareBar title={article?.title} vertical />
              </div>
            </div>
          </div>

          <article
            className="mx-auto max-w-2xl px-5 sm:px-8 lg:px-6 py-14 sm:py-20 xl:py-24 pb-28 xl:pb-24"
            aria-labelledby="article-title"
          >
            <motion.div {...sectionReveal}>
              <div className="mb-10 sm:mb-12 flex items-center gap-4" aria-hidden="true">
                <span className="h-px w-12 bg-mckinsey-accent" />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary">
                  Long read
                </span>
              </div>
              <p className="font-sans text-sm leading-[1.65] text-mckinsey-text-tertiary">
                The views expressed in this article are those of the author and do not necessarily reflect the views of
                McKinsey &amp; Company.
              </p>
            </motion.div>

            <PublicationStrip article={article} />

            <motion.div
              variants={bodyStaggerParent}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-48px 0px' }}
            >
              {bodyBlocks.map((block, index) => (
                <BodyBlock
                  key={`${block.type}-${index}`}
                  block={block}
                  isFirstHeading={block.type === 'heading' && index === firstHeadingIndex}
                />
              ))}
            </motion.div>

            <motion.footer
              className="mt-16 sm:mt-20 pt-10 border-t border-mckinsey-border"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px 0px' }}
              transition={{ duration: 0.55, ease: easeOut }}
            >
              <p className="font-serif text-lg sm:text-xl text-mckinsey-text-secondary leading-relaxed italic">
                Thank you for reading.
              </p>
            </motion.footer>
          </article>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px 0px' }}
          transition={{ duration: 0.65, ease: easeOut }}
        >
          <RelatedContent articles={relatedArticles} currentArticleId={article?.id} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px 0px' }}
          transition={{ duration: 0.65, ease: easeOut, delay: 0.05 }}
        >
          <NextArticle article={nextArticle} />
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}
