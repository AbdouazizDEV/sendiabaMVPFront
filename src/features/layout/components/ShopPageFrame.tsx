import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

type ShopPageFrameProps = {
  children: ReactNode;
  /** Classes on the outer `<main>` (layout, background, selection). */
  mainClassName?: string;
};

/** Shared chrome: navbar + footer inside one `<main>` — preserves existing DOM structure. */
export function ShopPageFrame({ children, mainClassName }: ShopPageFrameProps) {
  return (
    <main className={mainClassName}>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
