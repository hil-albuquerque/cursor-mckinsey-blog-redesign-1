const TYPE_CONFIG = {
  article: { label: 'Article', icon: '📄' },
  'case-study': { label: 'Case Study', icon: '📊' },
  profile: { label: 'People', icon: '👤' },
  impact: { label: 'Impact Story', icon: '🌍' },
  video: { label: 'Video', icon: '▶' },
};

export default function ContentTypeBadge({ type, variant = 'default' }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.article;
  const variants = {
    default: 'bg-mckinsey-warm text-mckinsey-text-secondary',
    overlay: 'bg-black/60 text-white backdrop-blur-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-sm ${variants[variant]}`}>
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
}
