import type { Artisan } from "@/domain/types";

type ArtisanDetailBioSectionProps = {
  artisan: Artisan;
};

export function ArtisanDetailBioSection({ artisan }: ArtisanDetailBioSectionProps) {
  return (
    <section className="py-20 container mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-4 space-y-8">
          <div className="p-8 bg-muted/50 border border-border">
            <h3 className="text-sm uppercase tracking-widest font-medium mb-6">Profil</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Titre</span>
                <span className="font-medium text-right">{artisan.title}</span>
              </li>
              <li className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Expérience</span>
                <span className="font-medium text-right">{artisan.yearsExperience} ans</span>
              </li>
              <li className="flex justify-between pb-4 border-b border-border">
                <span className="text-muted-foreground">Héritage</span>
                <span className="font-medium text-right">{artisan.heritage}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Créations</span>
                <span className="font-medium text-right">{artisan.productsCount} pièces</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-center">
          <div className="relative mb-16">
            <div className="absolute -top-10 -left-6 text-8xl text-primary/10 font-serif z-0">&quot;</div>
            <blockquote className="text-3xl md:text-4xl font-serif italic text-foreground leading-snug relative z-10">
              {artisan.quote}
            </blockquote>
          </div>

          <div className="prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none">
            <p>{artisan.bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
