import { motion as Motion } from 'framer-motion';
import TopicTag from '../../components/TopicTag';
import ArticleMeta from '../../components/ArticleMeta';
import ContentTypeBadge from '../../components/ContentTypeBadge';
import McKinseyLogo from '../../components/McKinseyLogo';
import {
  FEATURED_ARTICLE,
  ARTICLES,
  TOPICS,
  PILLARS,
} from '../../data/content';

const EDITION_LABEL = 'Weekend Edition';
const EDITION_DATE = 'April 12, 2026';

const motionEase = [0.22, 1, 0.36, 1];

const fadeUpProps = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.55, ease: motionEase },
};

const latestListParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const latestListItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: motionEase },
  },
};

/** Analytical / perspective-led picks from the corpus */
const OPINION_ARTICLES = [
  ARTICLES[0],
  ARTICLES[3],
  ARTICLES[6],
  ARTICLES[10],
];

const LATEST_ARTICLES = ARTICLES.filter((a) => a.id !== FEATURED_ARTICLE.id).slice(0, 6);

const FROM_OUR_PEOPLE = [
  ARTICLES[5],
  ARTICLES[3],
  ARTICLES[7],
  ARTICLES[11],
];

function ThinRule({ className = '' }) {
  return <div className={`h-px w-full bg-mckinsey-border ${className}`} role="presentation" />;
}

function SectionLabel({ children, className = '' }) {
  return (
    <p
      className={`font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-mckinsey-text-tertiary ${className}`}
    >
      {children}
    </p>
  );
}

function ArticleHeadlineLink({ article, className = '', as = 'h3' }) {
  const Tag = as;
  return (
    <Tag className={className}>
      <a
        href={`#article-${article.id}`}
        className="text-mckinsey-text transition-colors duration-200 hover:text-mckinsey-blue-light decoration-transparent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mckinsey-accent"
      >
        {article.title}
      </a>
    </Tag>
  );
}

function LeadStory({ article }) {
  return (
    <article className="group">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <TopicTag topic={article.topic} size="sm" />
        <ContentTypeBadge type={article.type} />
      </div>
      <ArticleHeadlineLink
        article={article}
        as="h2"
        className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.08] tracking-tight text-mckinsey-blue"
      />
      <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-mckinsey-text-secondary">
        {article.subtitle}
      </p>
      <div className="mt-6">
        <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
      </div>
      <a
        href={`#article-${article.id}`}
        className="mt-8 block overflow-hidden border border-mckinsey-border bg-mckinsey-warm transition-colors duration-200 hover:border-mckinsey-warm-dark"
        aria-label={`Read: ${article.title}`}
      >
        <div className="aspect-[16/10] w-full">
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover opacity-[0.92] transition-opacity duration-300 group-hover:opacity-100"
            loading="eager"
          />
        </div>
      </a>
      <p className="mt-3 font-sans text-xs text-mckinsey-text-tertiary">
        Photograph for McKinsey Blog — {article.topic.label}
      </p>
    </article>
  );
}

function LatestItem({ article, index }) {
  return (
    <div className="flex gap-4">
      <span
        className="font-serif text-2xl font-medium tabular-nums text-mckinsey-border"
        aria-hidden
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-2">
          <TopicTag topic={article.topic} size="xs" />
        </div>
        <ArticleHeadlineLink
          article={article}
          as="h3"
          className="font-serif text-lg font-semibold leading-snug tracking-tight"
        />
        <div className="mt-2">
          <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
        </div>
      </div>
    </div>
  );
}

function OpinionCard({ article }) {
  return (
    <article className="flex flex-col border-t border-mckinsey-border pt-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ContentTypeBadge type={article.type} />
        <TopicTag topic={article.topic} size="xs" />
      </div>
      <ArticleHeadlineLink
        article={article}
        as="h3"
        className="font-serif text-xl font-semibold leading-snug tracking-tight text-mckinsey-blue md:text-2xl"
      />
      <p className="mt-3 line-clamp-3 font-sans text-sm leading-relaxed text-mckinsey-text-secondary">
        {article.subtitle}
      </p>
      <div className="mt-4">
        <ArticleMeta author={article.author} date={article.date} readTime={article.readTime} />
      </div>
    </article>
  );
}

function PillarBlock({ pillar, index }) {
  const picks = pillar.articles.slice(0, 3);
  const [primary, ...rest] = picks;

  if (!primary) return null;

  return (
    <Motion.section {...fadeUpProps} className="scroll-mt-24" id={`pillar-${pillar.id}`}>
      <ThinRule className="mb-10" />
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <header className="lg:col-span-4">
          <SectionLabel className="mb-3">Focus</SectionLabel>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-mckinsey-blue md:text-[2rem]">
            {pillar.title}
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-mckinsey-text-secondary">
            {pillar.description}
          </p>
        </header>
        <div className="lg:col-span-8">
          <div className="grid gap-8 md:grid-cols-2">
            <article className="md:col-span-2 md:flex md:gap-8">
              <a
                href={`#article-${primary.id}`}
                className="mb-4 block shrink-0 overflow-hidden border border-mckinsey-border bg-mckinsey-warm transition-colors duration-200 hover:border-mckinsey-warm-dark md:mb-0 md:w-[42%]"
              >
                <div className="aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-[200px]">
                  <img
                    src={primary.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </a>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <TopicTag topic={primary.topic} size="xs" />
                  <ContentTypeBadge type={primary.type} />
                </div>
                <ArticleHeadlineLink
                  article={primary}
                  as="h3"
                  className="font-serif text-2xl font-semibold leading-snug tracking-tight text-mckinsey-text md:text-[1.65rem]"
                />
                <p className="mt-3 font-sans text-sm leading-relaxed text-mckinsey-text-secondary">
                  {primary.subtitle}
                </p>
                <div className="mt-4">
                  <ArticleMeta
                    author={primary.author}
                    date={primary.date}
                    readTime={primary.readTime}
                  />
                </div>
              </div>
            </article>
            {rest.map((a) => (
              <article key={a.id} className="border-t border-mckinsey-border pt-6 md:border-t-0 md:border-l md:border-mckinsey-border md:pl-6 md:pt-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <TopicTag topic={a.topic} size="xs" />
                </div>
                <ArticleHeadlineLink
                  article={a}
                  as="h4"
                  className="font-serif text-lg font-semibold leading-snug tracking-tight"
                />
                <div className="mt-3">
                  <ArticleMeta author={a.author} date={a.date} readTime={a.readTime} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      {index < PILLARS.length - 1 ? null : <ThinRule className="mt-14" />}
    </Motion.section>
  );
}

function PeopleProfile({ article }) {
  return (
    <article className="flex flex-col border border-mckinsey-border bg-mckinsey-surface p-5 transition-colors duration-200 hover:border-mckinsey-warm-dark">
      <div className="mb-4 aspect-[3/4] w-full max-w-[200px] overflow-hidden bg-mckinsey-warm">
        <img src={article.image} alt="" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <ContentTypeBadge type={article.type} />
      <ArticleHeadlineLink
        article={article}
        as="h3"
        className="mt-3 font-serif text-lg font-semibold leading-snug tracking-tight"
      />
      <p className="mt-2 line-clamp-3 font-sans text-xs leading-relaxed text-mckinsey-text-secondary">
        {article.subtitle}
      </p>
      <div className="mt-4 border-t border-mckinsey-border pt-4">
        <p className="font-sans text-xs font-medium text-mckinsey-text">{article.author.name}</p>
        {article.author.role ? (
          <p className="mt-1 font-sans text-[11px] text-mckinsey-text-tertiary">{article.author.role}</p>
        ) : null}
      </div>
    </article>
  );
}

function NewsletterBlock() {
  return (
    <Motion.aside
      {...fadeUpProps}
      className="border border-mckinsey-blue bg-mckinsey-blue text-mckinsey-warm"
    >
      <div className="grid gap-10 p-8 md:grid-cols-2 md:p-12 lg:gap-16">
        <div>
          <SectionLabel className="!text-mckinsey-warm/60">Dispatches</SectionLabel>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight md:text-[2.25rem]">
            The week in ideas, delivered Saturday morning
          </h2>
          <p className="mt-5 font-sans text-sm leading-relaxed text-mckinsey-warm/85">
            Each edition brings you a curated selection of our newest analysis, interviews, and
            long reads — the stories leadership teams are discussing inside boardrooms and operating
            committees around the world.
          </p>
        </div>
        <div className="flex flex-col justify-end border-t border-white/15 pt-8 md:border-t-0 md:border-l md:border-white/15 md:pl-10 md:pt-0">
          <form
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Subscribe to the McKinsey Blog newsletter"
          >
            <label htmlFor="editorial-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="editorial-newsletter-email"
              type="email"
              name="email"
              placeholder="you@company.com"
              autoComplete="email"
              className="w-full border-b border-mckinsey-warm/40 bg-transparent py-3 font-sans text-sm text-mckinsey-warm placeholder:text-mckinsey-warm/45 focus:border-mckinsey-teal focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center border border-mckinsey-warm/50 px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-mckinsey-warm transition-colors duration-200 hover:border-mckinsey-teal hover:text-mckinsey-teal md:w-auto"
            >
              Subscribe
            </button>
            <p className="font-sans text-[11px] leading-relaxed text-mckinsey-warm/55">
              By subscribing, you agree to receive editorial emails from McKinsey. You may
              unsubscribe at any time. We treat your correspondence with the same care we bring to
              our client work.
            </p>
          </form>
        </div>
      </div>
    </Motion.aside>
  );
}

function TopNavigation() {
  return (
    <header className="sticky top-0 z-40 border-b border-mckinsey-border bg-mckinsey-bg/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            className="group flex min-w-0 items-baseline gap-2 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mckinsey-accent"
          >
            <span className="font-serif text-xl font-semibold tracking-tight text-mckinsey-blue transition-colors duration-200 group-hover:text-mckinsey-blue-light sm:text-2xl">
              McKinsey
            </span>
            <span className="hidden font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-mckinsey-text-tertiary sm:inline">
              Blog
            </span>
          </a>
          <McKinseyLogo className="hidden h-5 shrink-0 opacity-40 sm:block md:hidden" color="#051C2C" />
          <nav
            className="hidden overflow-x-auto md:flex md:items-center md:gap-1 lg:gap-2"
            aria-label="Topics"
          >
            {TOPICS.map((topic) => (
              <a
                key={topic.id}
                href={`#topic-${topic.id}`}
                className="whitespace-nowrap px-2 py-1 font-sans text-xs text-mckinsey-text-secondary transition-colors duration-200 hover:text-mckinsey-blue hover:underline hover:underline-offset-4"
                style={{ textDecorationColor: 'transparent' }}
              >
                {topic.label}
              </a>
            ))}
          </nav>
        </div>
        <nav
          className="flex gap-3 overflow-x-auto border-t border-mckinsey-border/80 py-3 md:hidden"
          aria-label="Topics"
        >
          {TOPICS.map((topic) => (
            <a
              key={topic.id}
              href={`#topic-${topic.id}`}
              className="whitespace-nowrap font-sans text-[11px] text-mckinsey-text-secondary transition-colors duration-200 hover:text-mckinsey-blue"
            >
              {topic.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Masthead() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: motionEase }}
      className="border-b-2 border-mckinsey-blue pb-8 pt-10 text-center"
    >
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-mckinsey-text-tertiary">
        {EDITION_LABEL}
        <span className="mx-3 text-mckinsey-border" aria-hidden>
          —
        </span>
        <time dateTime="2026-04-12">{EDITION_DATE}</time>
      </p>
      <div className="mt-6 flex flex-col items-center gap-2">
        <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-none tracking-tight text-mckinsey-blue">
          McKinsey Blog
        </h1>
        <p className="max-w-md font-sans text-sm italic text-mckinsey-text-secondary">
          Where strategy, technology, and society meet — reported with rigor and read with care.
        </p>
      </div>
      <ThinRule className="mx-auto mt-8 max-w-xs bg-mckinsey-gold" />
    </Motion.div>
  );
}

function TopicAnchorsRow() {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-mckinsey-border py-5">
      {TOPICS.map((t) => (
        <a
          key={t.id}
          id={`topic-${t.id}`}
          href={`#topic-${t.id}`}
          className="font-sans text-xs text-mckinsey-text-tertiary transition-colors duration-200 hover:text-mckinsey-blue-light"
          style={{ scrollMarginTop: '6rem' }}
        >
          <span className="font-medium" style={{ color: t.color }}>
            {t.label}
          </span>
        </a>
      ))}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-mckinsey-border bg-mckinsey-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-xl font-semibold text-mckinsey-blue">McKinsey Blog</p>
            <p className="mt-3 max-w-sm font-sans text-xs leading-relaxed text-mckinsey-text-tertiary">
              Insights for leaders navigating transformation. Nothing herein constitutes professional
              advice; see your McKinsey team for tailored guidance.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 font-sans text-xs text-mckinsey-text-secondary">
            <a
              href="#top"
              className="transition-colors duration-200 hover:text-mckinsey-blue hover:underline hover:underline-offset-4"
            >
              Back to top
            </a>
            <a
              href="https://www.mckinsey.com"
              className="transition-colors duration-200 hover:text-mckinsey-blue hover:underline hover:underline-offset-4"
              rel="noreferrer"
            >
              McKinsey.com
            </a>
          </div>
        </div>
        <ThinRule className="my-8" />
        <p className="font-sans text-[11px] text-mckinsey-text-tertiary">
          © {new Date().getFullYear()} McKinsey & Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function EditorialLanding() {
  return (
    <div id="top" className="min-h-screen bg-mckinsey-bg text-mckinsey-text">
      <TopNavigation />

      <main>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Masthead />
          <TopicAnchorsRow />

          <Motion.section {...fadeUpProps} className="py-12 md:py-16" aria-labelledby="lead-heading">
            <span id="lead-heading" className="sr-only">
              Lead story
            </span>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-0">
              <div className="lg:col-span-8 lg:pr-10 xl:pr-14">
                <SectionLabel className="mb-4">Cover Story</SectionLabel>
                <LeadStory article={FEATURED_ARTICLE} />
              </div>
              <aside className="lg:col-span-4 lg:border-l lg:border-mckinsey-border lg:pl-10 xl:pl-12">
                <SectionLabel className="mb-2">Latest</SectionLabel>
                <p className="mb-6 font-sans text-xs text-mckinsey-text-tertiary">
                  The stories our newsroom published this week, in the order readers are sharing them.
                </p>
                <Motion.ul
                  className="border-t border-mckinsey-border"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={latestListParent}
                >
                  {LATEST_ARTICLES.map((article, index) => (
                    <Motion.li
                      key={article.id}
                      variants={latestListItem}
                      className="border-b border-mckinsey-border py-5 last:border-b-0 last:pb-0"
                    >
                      <LatestItem article={article} index={index} />
                    </Motion.li>
                  ))}
                </Motion.ul>
              </aside>
            </div>
          </Motion.section>

          <ThinRule className="my-4" />

          <Motion.section
            {...fadeUpProps}
            className="py-14 md:py-20"
            aria-labelledby="opinion-heading"
          >
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel className="mb-2">Perspective</SectionLabel>
                <h2
                  id="opinion-heading"
                  className="font-serif text-3xl font-semibold tracking-tight text-mckinsey-blue md:text-[2.25rem]"
                >
                  Opinion &amp; Analysis
                </h2>
              </div>
              <p className="max-w-md font-sans text-sm text-mckinsey-text-secondary">
                Essays and evidence from our partners and experts — the arguments shaping how
                executives invest, hire, and lead.
              </p>
            </div>
            <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {OPINION_ARTICLES.map((article, i) => (
                <div
                  key={article.id}
                  className={
                    i > 0 ? 'border-t border-mckinsey-border pt-6 md:border-t-0 md:pt-0 lg:border-l lg:border-mckinsey-border lg:pl-8' : ''
                  }
                >
                  <OpinionCard article={article} />
                </div>
              ))}
            </div>
          </Motion.section>

          <div className="space-y-2 pb-6">
            {PILLARS.map((pillar, index) => (
              <PillarBlock key={pillar.id} pillar={pillar} index={index} />
            ))}
          </div>

          <Motion.section {...fadeUpProps} className="py-14 md:py-16" aria-labelledby="people-heading">
            <ThinRule className="mb-10" />
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel className="mb-2">Voices</SectionLabel>
                <h2
                  id="people-heading"
                  className="font-serif text-3xl font-semibold tracking-tight text-mckinsey-blue md:text-[2.25rem]"
                >
                  From Our People
                </h2>
              </div>
              <p className="max-w-md font-sans text-sm text-mckinsey-text-secondary">
                The colleagues behind our work — in their words, on the problems they cannot stop
                thinking about.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FROM_OUR_PEOPLE.map((article) => (
                <PeopleProfile key={article.id} article={article} />
              ))}
            </div>
          </Motion.section>

          <section className="py-14 md:py-20" aria-labelledby="newsletter-heading">
            <span id="newsletter-heading" className="sr-only">
              Newsletter
            </span>
            <NewsletterBlock />
          </section>
        </div>
      </main>

      <SiteFooter />

      {/* In-page anchors for article deep links (layout reference) */}
      <div className="sr-only" aria-hidden>
        {[FEATURED_ARTICLE, ...ARTICLES].map((a) => (
          <div key={a.id} id={`article-${a.id}`} />
        ))}
      </div>
    </div>
  );
}
