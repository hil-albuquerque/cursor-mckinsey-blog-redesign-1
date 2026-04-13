import { motion, useScroll, useSpring } from 'framer-motion';

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    restDelta: 0.0005,
  });

  return (
    <motion.div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[200] h-[2px] origin-left bg-mckinsey-accent"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
