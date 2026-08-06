import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

/** Counts up from 0 to `value` once it scrolls into view. */
export default function Counter({ value, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  const displayRef = useRef(null);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (displayRef.current) {
        displayRef.current.textContent =
          prefix + Math.round(latest).toLocaleString() + suffix;
      }
    });
  }, [spring, prefix, suffix]);

  return (
    <span ref={ref}>
      <span ref={displayRef}>{prefix + "0" + suffix}</span>
    </span>
  );
}