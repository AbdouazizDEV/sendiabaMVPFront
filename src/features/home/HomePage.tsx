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
import { useHomePublicData } from "./useHomePublicData";

export default function HomePage() {
  const { data, errorMessage } = useHomePublicData();

  return (
    <ShopPageFrame mainClassName="min-h-screen w-full bg-background selection:bg-primary selection:text-primary-foreground">
      <Hero data={data.hero} />
      <BrandTicker items={data.brandTickerItems} />
      <TrustBar items={data.trustBarItems} />
      <Manifesto data={data.manifesto} />
      <Categories data={data.categories} />
      <HomepageShop
        tabsData={data.shopTabs}
        productsByCategory={data.shopProductsByCategory}
      />
      <PromoBanner data={data.promoBanner} />
      <EditorialSection data={data.editorial} />
      <SavoirFaire data={data.savoirFaire} />
      <Artisans data={data.artisans} />
      <FeaturedProducts data={data.featuredProducts} />
      <StatsSection items={data.statsItems} />
      <PressSection data={data.press} />
      <Newsletter data={data.newsletter} />
      {errorMessage && (
        <div className="container mx-auto px-6 pb-10 text-sm text-destructive md:px-12">
          {errorMessage}
        </div>
      )}
    </ShopPageFrame>
  );
}
