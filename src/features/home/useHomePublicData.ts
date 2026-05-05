import { useEffect, useState } from "react";

import { getServices } from "@/app/di/services";
import type {
  HomeArtisans,
  HomeCategories,
  HomeEditorial,
  HomeFeaturedProducts,
  HomeHero,
  HomeManifesto,
  HomeNewsletter,
  HomePress,
  HomePromoBanner,
  HomeSavoirFaire,
  HomeShopProducts,
  HomeShopTabs,
  HomeStatItem,
  HomeTrustItem,
} from "@/services/home-public-service";

export type HomePublicData = {
  hero: HomeHero | null;
  brandTickerItems: string[];
  trustBarItems: HomeTrustItem[];
  manifesto: HomeManifesto | null;
  categories: HomeCategories | null;
  shopTabs: HomeShopTabs | null;
  shopProductsByCategory: Record<string, HomeShopProducts["items"]>;
  promoBanner: HomePromoBanner | null;
  editorial: HomeEditorial | null;
  savoirFaire: HomeSavoirFaire | null;
  artisans: HomeArtisans | null;
  featuredProducts: HomeFeaturedProducts | null;
  statsItems: HomeStatItem[];
  press: HomePress | null;
  newsletter: HomeNewsletter | null;
};

const INITIAL_DATA: HomePublicData = {
  hero: null,
  brandTickerItems: [],
  trustBarItems: [],
  manifesto: null,
  categories: null,
  shopTabs: null,
  shopProductsByCategory: {},
  promoBanner: null,
  editorial: null,
  savoirFaire: null,
  artisans: null,
  featuredProducts: null,
  statsItems: [],
  press: null,
  newsletter: null,
};

export function useHomePublicData() {
  const { homePublicService } = getServices();
  const [data, setData] = useState<HomePublicData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [
          hero,
          brandTicker,
          trustBar,
          manifesto,
          categories,
          shopTabs,
          promoBanner,
          editorial,
          savoirFaire,
          artisans,
          featuredProducts,
          stats,
          press,
          newsletter,
        ] = await Promise.all([
          homePublicService.getHero(),
          homePublicService.getBrandTicker(),
          homePublicService.getTrustBar(),
          homePublicService.getManifesto(),
          homePublicService.getCategories(),
          homePublicService.getShopTabs(),
          homePublicService.getPromoBanner(),
          homePublicService.getEditorial(),
          homePublicService.getSavoirFaire(),
          homePublicService.getArtisans(),
          homePublicService.getFeaturedProducts(),
          homePublicService.getStats(),
          homePublicService.getPress(),
          homePublicService.getNewsletter(),
        ]);

        const categoriesToLoad = shopTabs.tabs.map((tab) => tab.id);
        const productsEntries = await Promise.all(
          categoriesToLoad.map(async (category) => {
            const payload = await homePublicService.getShopProducts(category, 4);
            return [category, payload.items] as const;
          }),
        );

        if (cancelled) return;
        setData({
          hero,
          brandTickerItems: brandTicker.items,
          trustBarItems: trustBar.items,
          manifesto,
          categories,
          shopTabs,
          shopProductsByCategory: Object.fromEntries(productsEntries),
          promoBanner,
          editorial,
          savoirFaire,
          artisans,
          featuredProducts,
          statsItems: stats.items,
          press,
          newsletter,
        });
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Impossible de charger les contenus publics.",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [homePublicService]);

  return { data, isLoading, errorMessage };
}
