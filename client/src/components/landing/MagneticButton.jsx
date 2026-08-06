import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";

/**
 * A button that gently pulls toward the cursor while hovered (magnetic effect),
 * with a soft glow that tracks pointer position. Falls back to a static button
 * on touch devices where hover doesn't apply.
 */
export default function MagneticButton({
  children,
  onClick,
  href,
  variant = "primary", // "primary" | "glass"
  className = "",
}) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowBg = useMotionTemplate`radial-gradient(120px circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.35), transparent 70%)`;

  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    x.set((relX - rect.width / 2) * 0.35);
    y.set((relY - rect.height / 2) * 0.35);

    glowX.set((relX / rect.width) * 100);
    glowY.set((relY / rect.height) * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-medium text-[15px] overflow-hidden select-none transition-shadow duration-300";

  const variants = {
    primary: "text-white shadow-[0_8px_30px_-8px_var(--accent)]",
    glass: "lp-glass text-[var(--text)]",
  };

  const Tag = href ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Tag
        href={href}
        onClick={onClick}
        className={`${base} ${variants[variant]} ${className} group`}
      >
        {variant === "primary" && (
          <span
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, var(--primary)))",
            }}
          />
        )}

        {/* Cursor-following glow */}
        <motion.span
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: glowBg }}
        />

        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Tag>
    </motion.div>
  );
}