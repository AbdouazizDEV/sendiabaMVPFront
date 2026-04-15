import { useMemo } from "react";

import { getServices } from "@/app/di/services";
import { ShopPageFrame } from "@/features/layout/components/ShopPageFrame";

import { CollectionsCatalogHero } from "./components/CollectionsCatalogHero";
import { CollectionsCategoryShowcase } from "./components/CollectionsCategoryShowcase";
import { CollectionsNewArrivalsSection } from "./components/CollectionsNewArrivalsSection";

export default function CollectionsPage() {
  const newArrivals = useMemo(() => getServices().catalogService.sampleNewArrivals(4), []);

  return (
    <ShopPageFrame mainClassName="min-h-screen w-full bg-background selection:bg-primary selection:text-primary-foreground">
      <CollectionsCatalogHero />
      <CollectionsCategoryShowcase />
      <CollectionsNewArrivalsSection products={newArrivals} />
    </ShopPageFrame>
  );
}
