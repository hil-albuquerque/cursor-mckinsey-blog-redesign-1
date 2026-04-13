import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const concepts = [
  {
    id: 1,
    path: '/concept-1',
    title: 'Modular / Bento System',
    philosophy:
      'A dynamic, grid-based system that uses layout weight and card hierarchy to tell stories — every piece of content earns its space through editorial importance, creating a mosaic of insight that rewards exploration.',
    features: [
      'Grid-based layout with varied card sizes',
      'Hierarchical storytelling using layout weight',
      'Mix of large feature cards + smaller content',
      'Dynamic and flexible but still restrained',
    ],
    gradient: 'from-[#051C2C] to-[#0A3A5C]',
    accent: '#2251FF',
  },
  {
    id: 2,
    path: '/concept-2',
    title: 'Editorial / Magazine',
    philosophy:
      'A typographically-led editorial experience that channels the authority of the world\'s finest newspapers — content earns attention through hierarchy, pacing, and the power of words.',
    features: [
      'Clean, typography-led layout',
      'Strong hierarchy using headlines and sections',
      'Section-based storytelling (FT / NYT style)',
      'Minimal but intentional imagery',
    ],
    gradient: 'from-[#1A1A1A] to-[#4A4A4A]',
    accent: '#C4972A',
  },
  {
    id: 3,
    path: '/concept-3',
    title: 'Immersive / Storytelling',
    philosophy:
      'A cinematic, scroll-driven experience that draws readers into McKinsey\'s world of ideas — rich imagery, purposeful motion, and narrative pacing transform a blog into an editorial destination.',
    features: [
      'Visually rich entry points with hero modules',
      'Scroll-based storytelling patterns',
      'Expressive use of imagery and motion',
      'Cinematic yet professional tone',
    ],
    gradient: 'from-[#0A3A5C] to-[#00A9CE]',
    accent: '#00A9CE',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-mckinsey-bg">
      {/* Header */}
      <header className="border-b border-mckinsey-border bg-mckinsey-surface">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-mckinsey-text-tertiary mb-3">
              Design Exploration
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-mckinsey-blue leading-tight">
              New at McKinsey
            </h1>
            <p className="mt-4 text-lg md:text-xl text-mckinsey-text-secondary max-w-2xl leading-relaxed">
              Three distinct design directions for transforming the McKinsey Blog
              into a dynamic, editorial, and curated front door to McKinsey's thought leadership.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Design Principles */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {[
            { label: 'Authoritative & Polished', desc: 'Reinforcing McKinsey\'s position as the gold standard in strategic thinking' },
            { label: 'Editorial & Modern', desc: 'Moving beyond feeds into curated, storytelling-driven experiences' },
            { label: 'Restrained & Classy', desc: 'Premium design language inspired by Apple, FT, and NYT' },
          ].map((p, i) => (
            <div key={i} className="border-t-2 border-mckinsey-blue pt-4">
              <h3 className="font-medium text-sm tracking-wide uppercase text-mckinsey-blue mb-2">
                {p.label}
              </h3>
              <p className="text-mckinsey-text-secondary text-sm leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Concept Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="space-y-8 md:space-y-12">
          {concepts.map((concept, i) => (
            <motion.div
              key={concept.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
            >
              <Link
                to={concept.path}
                className="group block bg-mckinsey-surface rounded-lg overflow-hidden border border-mckinsey-border hover:border-mckinsey-blue/20 transition-all duration-500 hover:shadow-lg"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  {/* Gradient Preview */}
                  <div
                    className={`lg:col-span-2 bg-gradient-to-br ${concept.gradient} p-8 md:p-12 flex flex-col justify-between min-h-[240px] lg:min-h-[360px]`}
                  >
                    <div>
                      <span className="inline-block text-white/50 text-xs font-medium tracking-[0.2em] uppercase mb-4">
                        Concept {concept.id}
                      </span>
                      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white leading-tight">
                        {concept.title}
                      </h2>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                      <span>View prototype</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                    <p className="text-mckinsey-text-secondary leading-relaxed mb-6">
                      {concept.philosophy}
                    </p>
                    <ul className="space-y-2.5">
                      {concept.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-3 text-sm text-mckinsey-text-secondary">
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: concept.accent }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mckinsey-border bg-mckinsey-surface">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-mckinsey-text-tertiary">
            McKinsey Blog Redesign — Design Exploration Prototypes
          </p>
          <p className="text-xs text-mckinsey-text-tertiary">
            Built with React, Tailwind CSS, and Framer Motion
          </p>
        </div>
      </footer>
    </div>
  );
}
