import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TopicTag from '../../../components/TopicTag.jsx';

export default function NextArticle({ article }) {
  if (!article) return null;

  return (
    <section className="border-t border-mckinsey-border" aria-label="Up next">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          to={`/concept-1/article/${article.id}`}
          className="group relative flex flex-col overflow-hidden bg-mckinsey-blue text-white transition-colors hover:bg-mckinsey-blue-light focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mckinsey-accent md:flex-row md:items-stretch"
        >
          <div className="relative aspect-[16/9] w-full shrink-0 md:aspect-auto md:w-[min(42%,520px)]">
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mckinsey-blue/80 via-mckinsey-blue/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-mckinsey-blue/35 md:to-mckinsey-blue" />
          </div>
          <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
              Up Next →
            </p>
            <div className="mt-4 max-w-2xl">
              <TopicTag topic={article.topic} size="md" />
            </div>
            <h2 className="mt-4 font-serif text-2xl leading-tight tracking-tight text-white sm:text-3xl lg:text-[2rem]">
              {article.title}
            </h2>
            {article.subtitle && (
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-white/70 sm:text-base">
                {article.subtitle}
              </p>
            )}
            <span className="mt-8 inline-flex w-fit items-center gap-2 font-sans text-sm font-semibold text-white underline-offset-4 transition-all group-hover:gap-3 group-hover:underline">
              Continue reading
              <span aria-hidden className="text-mckinsey-teal">
                →
              </span>
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
