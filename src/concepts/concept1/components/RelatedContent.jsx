import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TopicTag from '../../../components/TopicTag.jsx';
import ArticleMeta from '../../../components/ArticleMeta.jsx';

const cardMotion = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { type: 'spring', stiffness: 420, damping: 28 },
  },
};

export default function RelatedContent({ articles, currentArticleId }) {
  const list = (articles ?? [])
    .filter((a) => a.id !== currentArticleId)
    .slice(0, 4);

  if (!list.length) return null;

  return (
    <section
      className="border-t border-mckinsey-border bg-mckinsey-bg/60 py-14 sm:py-16 lg:py-20"
      aria-labelledby="related-content-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <h2
          id="related-content-heading"
          className="font-serif text-3xl tracking-tight text-mckinsey-blue sm:text-4xl"
        >
          Continue Reading
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          {list.map((article) => (
            <motion.article
              key={article.id}
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={cardMotion}
              className="group relative"
            >
              <Link
                to={`/concept-1/article/${article.id}`}
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-mckinsey-border bg-mckinsey-surface shadow-[0_1px_2px_rgba(5,28,44,0.04)] transition-shadow group-hover:shadow-[0_24px_48px_-12px_rgba(5,28,44,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-mckinsey-accent focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={article.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="mb-3">
                    <TopicTag topic={article.topic} size="sm" />
                  </div>
                  <h3 className="font-serif text-xl leading-snug tracking-tight text-mckinsey-text md:text-2xl">
                    {article.title}
                  </h3>
                  <div className="mt-4">
                    <ArticleMeta
                      author={article.author}
                      date={article.date}
                      readTime={article.readTime}
                    />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
