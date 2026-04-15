import { getServices } from "@/app/di/services";
import { ShopPageFrame } from "@/features/layout/components/ShopPageFrame";

import { ArtisansGridSection } from "./components/ArtisansGridSection";
import { ArtisansListingHero } from "./components/ArtisansListingHero";
import { ArtisansTraceabilitySection } from "./components/ArtisansTraceabilitySection";

export default function ArtisansPage() {
  const artisans = getServices().artisanService.list();

  return (
    <ShopPageFrame mainClassName="min-h-screen w-full bg-background">
      <ArtisansListingHero />
      <ArtisansGridSection artisans={artisans} />
      <ArtisansTraceabilitySection />
    </ShopPageFrame>
  );
}
