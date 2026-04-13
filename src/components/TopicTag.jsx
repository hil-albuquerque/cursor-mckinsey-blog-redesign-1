export default function TopicTag({ topic, size = 'sm' }) {
  const sizes = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-block font-medium tracking-wide uppercase ${sizes[size]} rounded-sm`}
      style={{
        color: topic.color,
        backgroundColor: `${topic.color}10`,
        border: `1px solid ${topic.color}20`,
      }}
    >
      {topic.label}
    </span>
  );
}
