import { Artisans } from "@/components/Artisans";
import { BrandTicker } from "@/components/BrandTicker";
import { Categories } from "@/components/Categories";
import { EditorialSection } from "@/components/EditorialSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Hero } from "@/components/Hero";
import { HomepageShop } from "@/components/HomepageShop";
import { Manifesto } from "@/components/Manifesto";
import { Newsletter } from "@/components/Newsletter";
import { PressSection } from "@/components/PressSection";
import { PromoBanner } from "@/components/PromoBanner";
import { SavoirFaire } from "@/components/SavoirFaire";
import { StatsSection } from "@/components/StatsSection";
import { TrustBar } from "@/components/TrustBar";
import { ShopPageFrame } from "@/features/layout/components/ShopPageFrame";

export default function HomePage() {
  return (
    <ShopPageFrame mainClassName="min-h-screen w-full bg-background selection:bg-primary selection:text-primary-foreground">
      <Hero />
      <BrandTicker />
      <TrustBar />
      <Manifesto />
      <Categories />
      <HomepageShop />
      <PromoBanner />
      <EditorialSection />
      <SavoirFaire />
      <Artisans />
      <FeaturedProducts />
      <StatsSection />
      <PressSection />
      <Newsletter />
    </ShopPageFrame>
  );
}
