import { useEffect, useState } from "react";
import { useParams } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import { ArtisanCreationsGrid } from "./components/ArtisanCreationsGrid";
import { ArtisanDetailBioSection } from "./components/ArtisanDetailBioSection";
import { ArtisanDetailHero } from "./components/ArtisanDetailHero";
import { ArtisanHeritageTimeline } from "./components/ArtisanHeritageTimeline";

export default function ArtisanDetailPage() {
  const params = useParams<{ id?: string }>();
  const { authService, customerCatalogService, artisanService, productService } = getServices();
  const { isAuthenticated } = useAuth();
  const [apiArtisan, setApiArtisan] = useState<ReturnType<typeof artisanService.getById>>();
  const [apiProducts, setApiProducts] = useState<
    Array<{
      id: string;
      name: string;
      artisanId: string;
      category: "maroquinerie" | "maison" | "decoration" | "coffrets";
      subcategory: string;
      price: number;
      description: string;
      details: string[];
      image: string;
      tag?: "Nouveau" | "Pièce Unique" | "Best-Seller" | "Édition Limitée";
      inStock: boolean;
    }>
  >([]);

  useEffect(() => {
    if (!isAuthenticated || !params.id) return;
    let cancelled = false;
    const load = async () => {
      const token = authService.getAccessToken();
      if (!token) return;
      try {
        const [artisanRes, productsRes] = await Promise.all([
          customerCatalogService.getArtisanById(token, params.id!),
          customerCatalogService.getArtisanProducts(token, params.id!),
        ]);
        if (cancelled) return;
        setApiArtisan({
          id: artisanRes.id,
          name: artisanRes.name,
          title: artisanRes.title,
          location: artisanRes.location,
          heritage: artisanRes.heritage,
          quote: artisanRes.quote,
          bio: artisanRes.bio,
          image: artisanRes.imageUrl,
          speciality: artisanRes.speciality,
          yearsExperience: artisanRes.yearsExperience,
          productsCount: artisanRes.productsCount,
        });
        setApiProducts(
          productsRes.map((item) => ({
            id: item.id,
            name: item.name,
            artisanId: artisanRes.id,
            category: (item.category as "maroquinerie" | "maison" | "decoration" | "coffrets") ?? "maroquinerie",
            subcategory: "",
            price: item.price,
            description: "",
            details: [],
            image: item.imageUrl,
            tag: (item.tag as "Nouveau" | "Pièce Unique" | "Best-Seller" | "Édition Limitée" | null) ?? undefined,
            inStock: item.inStock,
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
  }, [isAuthenticated, params.id, authService, customerCatalogService]);

  const artisan = apiArtisan ?? artisanService.getById(params.id ?? "");

  if (!artisan) {
    return <div className="p-20 text-center">Artisan non trouvé</div>;
  }

  const artisanProducts = apiProducts.length > 0 ? apiProducts : productService.listByArtisan(artisan.id);

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
