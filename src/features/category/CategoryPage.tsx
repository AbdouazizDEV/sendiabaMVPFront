import { useParams } from "wouter";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CATEGORY_PAGE_META, isProductCategory } from "@/content/collection-categories";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getServices } from "@/app/di/services";
import { getManagedText } from "@/content/managed-content";

import { CategoryEditorialFooter } from "./components/CategoryEditorialFooter";
import { CategoryFiltersPanel } from "./components/CategoryFiltersPanel";
import { CategoryHeroSection } from "./components/CategoryHeroSection";
import { CategoryProductCard } from "./components/CategoryProductCard";
import { useCategoryFilters } from "./hooks/useCategoryFilters";

export default function CategoryPage() {
  const params = useParams<{ categoryId?: string }>();
  const rawId = params.categoryId ?? "";

  if (!isProductCategory(rawId)) {
    return <div className="p-20 text-center">Catégorie non trouvée</div>;
  }

  const categoryId = rawId;
  const meta = CATEGORY_PAGE_META[categoryId];

  const {
    subcategories,
    categoryArtisans,
    filteredProducts,
    selectedSubcats,
    selectedArtisans,
    priceRange,
    inStockOnly,
    sortBy,
    setPriceRange,
    setInStockOnly,
    setSortBy,
    toggleSubcat,
    toggleArtisan,
    resetFilters,
    activeFiltersCount,
  } = useCategoryFilters(categoryId);

  const { artisanService } = getServices();
  const emptyTitle = getManagedText(
    "category.empty.title",
    "Aucune creation ne correspond a vos criteres.",
  );
  const emptySubtitle = getManagedText(
    "category.empty.subtitle",
    "Essayez de modifier vos filtres pour voir plus de resultats.",
  );

  return (
    <main className="min-h-screen w-full bg-background">
      <Navbar />
      <CategoryHeroSection meta={meta} />

      <section className="py-16 container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-32 self-start h-[calc(100vh-8rem)] overflow-y-auto pr-6 custom-scrollbar">
            <CategoryFiltersPanel
              subcategories={subcategories}
              categoryArtisans={categoryArtisans}
              selectedSubcats={selectedSubcats}
              selectedArtisans={selectedArtisans}
              priceRange={priceRange}
              inStockOnly={inStockOnly}
              activeFiltersCount={activeFiltersCount}
              onToggleSubcat={toggleSubcat}
              onToggleArtisan={toggleArtisan}
              onPriceRangeChange={setPriceRange}
              onInStockChange={setInStockOnly}
              onReset={resetFilters}
            />
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground">{filteredProducts.length} pièce(s) trouvée(s)</p>

              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden rounded-none uppercase text-xs tracking-widest h-10 border-foreground/20">
                      <SlidersHorizontal size={14} className="mr-2" />
                      Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[320px] sm:w-[400px] overflow-y-auto">
                    <SheetHeader className="mb-8 text-left sr-only">
                      <SheetTitle>Filtres</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8">
                      <CategoryFiltersPanel
                        subcategories={subcategories}
                        categoryArtisans={categoryArtisans}
                        selectedSubcats={selectedSubcats}
                        selectedArtisans={selectedArtisans}
                        priceRange={priceRange}
                        inStockOnly={inStockOnly}
                        activeFiltersCount={activeFiltersCount}
                        onToggleSubcat={toggleSubcat}
                        onToggleArtisan={toggleArtisan}
                        onPriceRangeChange={setPriceRange}
                        onInStockChange={setInStockOnly}
                        onReset={resetFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="hidden sm:block">
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                    <SelectTrigger className="w-[200px] bg-transparent border-foreground/20 rounded-none h-10 text-xs uppercase tracking-widest font-medium focus:ring-primary focus:ring-offset-0">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="nouveau">Nouveautés</SelectItem>
                      <SelectItem value="prix_asc">Prix croissant</SelectItem>
                      <SelectItem value="prix_desc">Prix décroissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {filteredProducts.map((product, idx) => (
                  <CategoryProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                    artisanName={artisanService.getById(product.artisanId)?.name}
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center bg-muted/20 border border-dashed border-border">
                <p className="text-xl font-serif text-foreground mb-4">{emptyTitle}</p>
                <p className="text-muted-foreground mb-8">{emptySubtitle}</p>
                <Button onClick={resetFilters} variant="outline" className="rounded-none uppercase text-xs tracking-widest">
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <CategoryEditorialFooter collectionTitle={meta.title} />
      <Footer />
    </main>
  );
}
