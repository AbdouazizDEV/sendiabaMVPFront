import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const dotX = useSpring(mouseX, { damping: 22, stiffness: 900, mass: 0.3 });
  const dotY = useSpring(mouseY, { damping: 22, stiffness: 900, mass: 0.3 });

  const ringX = useSpring(mouseX, { damping: 38, stiffness: 260, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 38, stiffness: 260, mass: 0.6 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], [data-cursor-hover]")) {
        setHovering(true);
      }
    };

    const onHoverEnd = () => setHovering(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onHoverStart);
    window.addEventListener("mouseout", onHoverEnd);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onHoverStart);
      window.removeEventListener("mouseout", onHoverEnd);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.style.cursor = "";
    };
  }, [visible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "hsl(var(--primary) / 0.5)",
          width: hovering ? 44 : 32,
          height: hovering ? 44 : 32,
          opacity: visible ? 1 : 0,
          transition: "width 0.25s ease, height 0.25s ease, opacity 0.2s ease",
        }}
      />
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "hsl(var(--primary))",
          width: hovering ? 6 : 5,
          height: hovering ? 6 : 5,
          opacity: visible ? 1 : 0,
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease",
        }}
      />
    </>
  );
}
