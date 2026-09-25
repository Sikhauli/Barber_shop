import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useInView } from "../../hooks/useInView";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
};

export function Reveal({ children, delay = 0, y = 16, className, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const Comp = motion[as] as typeof motion.div;

  if (reduce) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <Comp
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </Comp>
  );
}