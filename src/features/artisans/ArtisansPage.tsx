import { useEffect, useState } from "react";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { ShopPageFrame } from "@/features/layout/components/ShopPageFrame";

import { ArtisansGridSection } from "./components/ArtisansGridSection";
import { ArtisansListingHero } from "./components/ArtisansListingHero";
import { ArtisansTraceabilitySection } from "./components/ArtisansTraceabilitySection";

export default function ArtisansPage() {
  const { authService, customerCatalogService, artisanService } = getServices();
  const { isAuthenticated } = useAuth();
  const [apiArtisans, setApiArtisans] = useState(artisanService.list());

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const load = async () => {
      const token = authService.getAccessToken();
      if (!token) return;
      try {
        const items = await customerCatalogService.listArtisans(token, 200);
        if (cancelled) return;
        setApiArtisans(
          items.map((item) => ({
            id: item.id,
            name: item.name,
            title: item.title,
            location: item.location,
            heritage: item.heritage,
            quote: item.quote,
            bio: item.bio,
            image: item.imageUrl,
            speciality: item.speciality,
            yearsExperience: item.yearsExperience,
            productsCount: item.productsCount,
          })),
        );
      } catch {
        // fallback static
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authService, customerCatalogService]);

  return (
    <ShopPageFrame mainClassName="min-h-screen w-full bg-background">
      <ArtisansListingHero />
      <ArtisansGridSection artisans={apiArtisans} />
      <ArtisansTraceabilitySection />
    </ShopPageFrame>
  );
}
