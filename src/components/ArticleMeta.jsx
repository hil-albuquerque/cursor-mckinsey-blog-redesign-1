export default function ArticleMeta({ author, date, readTime, light = false }) {
  const textColor = light ? 'text-white/70' : 'text-mckinsey-text-tertiary';
  const nameColor = light ? 'text-white/90' : 'text-mckinsey-text-secondary';

  return (
    <div className={`flex items-center gap-2 text-xs ${textColor}`}>
      {author && (
        <>
          <span className={`font-medium ${nameColor}`}>{author.name}</span>
          <span aria-hidden>·</span>
        </>
      )}
      <time>{date}</time>
      <span aria-hidden>·</span>
      <span>{readTime}</span>
    </div>
  );
}
