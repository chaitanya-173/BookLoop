import { motion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1];

/**
 * Wraps children in a scroll-triggered fade + blur + rise reveal.
 * Pass `delay` for manual stagger, or use <RevealGroup> for automatic stagger.
 */
export function Reveal({ children, delay = 0, y = 24, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers any direct motion children using variants. */
export function RevealGroup({ children, stagger = 0.12, className = "" }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Use as a direct child of <RevealGroup> to inherit stagger timing. */
export function RevealItem({ children, y = 20, className = "" }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease: easeOut },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}