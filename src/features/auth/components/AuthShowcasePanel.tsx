import { getServices } from "@/app/di/services";

export function AuthShowcasePanel() {
  const { productService, artisanService } = getServices();
  const visualProduct = productService.list()[0];
  const artisan = visualProduct
    ? artisanService.getById(visualProduct.artisanId)
    : undefined;

  return (
    <aside className="relative hidden lg:flex min-h-[620px] overflow-hidden border border-border bg-foreground text-background">
      {visualProduct && (
        <img
          src={visualProduct.image}
          alt={visualProduct.name}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/30" />

      <div className="relative z-10 flex w-full flex-col justify-between p-10">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Sendiaba</p>
          <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight">
            Le luxe artisanal africain, signe par son createur.
          </h2>
          <p className="mt-6 max-w-md text-sm text-background/80">
            Connectez-vous pour sauvegarder vos selections, suivre vos commandes et retrouver facilement vos pieces
            favorites.
          </p>
        </div>

        {visualProduct && (
          <div className="rounded-none border border-background/30 bg-background/10 p-5 backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary">Piece du moment</p>
            <p className="mt-2 font-serif text-xl">{visualProduct.name}</p>
            <p className="mt-1 text-sm text-background/80">{visualProduct.price.toLocaleString("fr-FR")} EUR</p>
            {artisan && (
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-background/70">Atelier {artisan.name}</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
