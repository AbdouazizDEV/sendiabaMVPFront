import { useEffect, useState } from "react";

import { getServices } from "@/app/di/services";
import { ShopPageFrame } from "@/features/layout/components/ShopPageFrame";
import type {
  CatalogNewArrivalItem,
  CollectionsHeroPayload,
  ShowcaseCategoryItem,
} from "@/services/catalog-public-service";

import { CollectionsCatalogHero } from "./components/CollectionsCatalogHero";
import { CollectionsCategoryShowcase } from "./components/CollectionsCategoryShowcase";
import { CollectionsNewArrivalsSection } from "./components/CollectionsNewArrivalsSection";

export default function CollectionsPage() {
  const { catalogPublicService } = getServices();
  const [hero, setHero] = useState<CollectionsHeroPayload | null>(null);
  const [showcase, setShowcase] = useState<ShowcaseCategoryItem[]>([]);
  const [newArrivals, setNewArrivals] = useState<CatalogNewArrivalItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [heroRes, showcaseRes, arrivals] = await Promise.all([
          catalogPublicService.getCollectionsHero(),
          catalogPublicService.getShowcaseCategories(),
          catalogPublicService.getNewArrivals(4),
        ]);
        if (!cancelled) {
          setHero(heroRes);
          setShowcase(showcaseRes.items);
          setNewArrivals(arrivals);
        }
      } catch {
        if (!cancelled) {
          setHero(null);
          setShowcase([]);
          setNewArrivals([]);
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [catalogPublicService]);

  return (
    <ShopPageFrame mainClassName="min-h-screen w-full bg-background selection:bg-primary selection:text-primary-foreground">
      <CollectionsCatalogHero data={hero} />
      <CollectionsCategoryShowcase apiCategories={showcase} />
      <CollectionsNewArrivalsSection items={newArrivals} />
    </ShopPageFrame>
  );
}
