import { useParams } from "wouter";

import { getServices } from "@/app/di/services";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import { ArtisanCreationsGrid } from "./components/ArtisanCreationsGrid";
import { ArtisanDetailBioSection } from "./components/ArtisanDetailBioSection";
import { ArtisanDetailHero } from "./components/ArtisanDetailHero";
import { ArtisanHeritageTimeline } from "./components/ArtisanHeritageTimeline";

export default function ArtisanDetailPage() {
  const params = useParams();
  const { artisanService, productService } = getServices();

  const artisan = artisanService.getById(params.id ?? "");

  if (!artisan) {
    return <div className="p-20 text-center">Artisan non trouvé</div>;
  }

  const artisanProducts = productService.listByArtisan(artisan.id);

  return (
    <main className="min-h-screen w-full bg-background">
      <Navbar />
      <ArtisanDetailHero artisan={artisan} />
      <ArtisanDetailBioSection artisan={artisan} />
      <ArtisanHeritageTimeline artisan={artisan} />
      <ArtisanCreationsGrid artisan={artisan} products={artisanProducts} />
      <Footer />
    </main>
  );
}
