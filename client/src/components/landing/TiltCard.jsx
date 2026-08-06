import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * A card that tilts in 3D perspective toward the cursor, with a soft sheen
 * that sweeps across the surface. Used for the hero's floating book stack.
 */
export default function TiltCard({ children, className = "", style = {} }) {
  const ref = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 18,
  });

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
        ...style,
      }}
      className={`lp-glass rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </motion.div>
  );
}