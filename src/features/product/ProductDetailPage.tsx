import { useMemo, useState } from "react";
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

  const { productService, artisanService, certificationService } = getServices();

  const product = productService.getById(params.id ?? "");

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
  const similarProducts = productService.listSimilar(product, 4);

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
