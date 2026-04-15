import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

export function useProductStickyBarVisibility(thresholdPx = 420) {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > thresholdPx);
  });

  return visible;
}
