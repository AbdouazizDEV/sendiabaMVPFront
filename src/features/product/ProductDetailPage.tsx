import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth, useCart } from "@/app/state";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import { ProductDetailArtisanHighlight } from "./components/ProductDetailArtisanHighlight";
import { ProductDetailBreadcrumbTrail } from "./components/ProductDetailBreadcrumbTrail";
import { ProductDetailGallery } from "./components/ProductDetailGallery";
import { ProductDetailPurchaseColumn } from "./components/ProductDetailPurchaseColumn";
import { ProductDetailStickyBar } from "./components/ProductDetailStickyBar";
import { ProductSimilarProductsSection } from "./components/ProductSimilarProductsSection";
import { useProductStickyBarVisibility } from "./hooks/useProductStickyBarVisibility";

export default function ProductDetailPage() {
  const params = useParams<{ id?: string }>();
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const { authService, customerCatalogService, productService, artisanService, certificationService } = getServices();

  const [apiProduct, setApiProduct] = useState<{
    id: string;
    name: string;
    artisanId: string;
    category: "maroquinerie" | "maison" | "decoration" | "coffrets";
    subcategory: string;
    price: number;
    description: string;
    details: string[];
    image: string;
    inStock: boolean;
    tag?: "Nouveau" | "Pièce Unique" | "Best-Seller" | "Édition Limitée";
  } | null>(null);
  const [apiSimilar, setApiSimilar] = useState<
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
      inStock: boolean;
      tag?: "Nouveau" | "Pièce Unique" | "Best-Seller" | "Édition Limitée";
    }>
  >([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const token = authService.getAccessToken();
      const id = params.id ?? "";
      if (!token || !id) return;
      try {
        const [detail, similar] = await Promise.all([
          customerCatalogService.getProductById(token, id),
          customerCatalogService.getSimilarProducts(token, id, 4),
        ]);
        if (cancelled) return;
        setApiProduct({
          id: detail.id,
          name: detail.name,
          artisanId: detail.artisanId,
          category: (detail.category as "maroquinerie" | "maison" | "decoration" | "coffrets") ?? "maroquinerie",
          subcategory: detail.subcategory ?? "",
          price: detail.price,
          description: detail.description ?? "",
          details: detail.details ?? [],
          image: detail.imageUrl,
          inStock: detail.inStock,
          tag: (detail.tag as "Nouveau" | "Pièce Unique" | "Best-Seller" | "Édition Limitée" | null) ?? undefined,
        });
        setApiSimilar(
          similar.map((item) => ({
            id: item.id,
            name: item.name,
            artisanId: item.artisanId,
            category: (item.category as "maroquinerie" | "maison" | "decoration" | "coffrets") ?? "maroquinerie",
            subcategory: "",
            price: item.price,
            description: "",
            details: [],
            image: item.imageUrl,
            inStock: item.inStock,
            tag: (item.tag as "Nouveau" | "Pièce Unique" | "Best-Seller" | "Édition Limitée" | null) ?? undefined,
          })),
        );
      } catch {
        // keep local fallback
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [authService, customerCatalogService, params.id]);

  const product = apiProduct ?? productService.getById(params.id ?? "");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const stickyVisible = useProductStickyBarVisibility(420);

  const certId = useMemo(
    () => (product ? certificationService.buildCertId(product.id) : ""),
    [certificationService, product],
  );

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      setLocation(`/connexion?redirect=${encodeURIComponent(`/produit/${product.id}`)}`);
      return;
    }

    addToCart(product.id, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Produit non trouve</p>
      </main>
    );
  }

  const artisan = artisanService.getById(product.artisanId);
  const similarProducts = apiSimilar.length > 0 ? apiSimilar : productService.listSimilar(product, 4);

  const artisanNames = Object.fromEntries(
    similarProducts.map((p) => [p.artisanId, artisanService.getById(p.artisanId)?.name]),
  );

  return (
    <main className="min-h-screen w-full bg-background relative">
      <Navbar />
      <ProductDetailStickyBar
        visible={stickyVisible}
        product={product}
        isAdded={isAdded}
        onAddToCart={handleAddToCart}
      />

      <section className="pt-28 pb-16 px-6 md:px-12 container mx-auto">
        <ProductDetailBreadcrumbTrail product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <ProductDetailGallery
            product={product}
            isWishlisted={isWishlisted}
            onToggleWishlist={() => setIsWishlisted(!isWishlisted)}
          />
          <ProductDetailPurchaseColumn
            product={product}
            artisan={artisan}
            certId={certId}
            isAdded={isAdded}
            onAddToCart={handleAddToCart}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </section>

      {artisan && <ProductDetailArtisanHighlight artisan={artisan} />}

      <ProductSimilarProductsSection
        categoryId={product.category}
        products={similarProducts}
        artisanNames={artisanNames}
      />

      <Footer />
    </main>
  );
}
