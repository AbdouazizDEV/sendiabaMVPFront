import type { Artisan } from "@/domain/types";

type ArtisanHeritageTimelineProps = {
  artisan: Artisan;
};

export function ArtisanHeritageTimeline({ artisan }: ArtisanHeritageTimelineProps) {
  const firstName = artisan.name.split(" ")[0] ?? artisan.name;

  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-serif mb-4">De père en fils</h2>
          <p className="text-background/70 text-lg">L&apos;histoire d&apos;un savoir-faire qui traverse le temps.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l border-primary/30 pl-8 space-y-12">
            <div className="relative">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[38px] top-2" />
              <h3 className="text-xl font-serif text-white mb-2">Les Racines</h3>
              <p className="text-background/60">
                L&apos;art a été introduit dans la famille il y a plusieurs générations, posant les bases des techniques
                traditionnelles encore utilisées aujourd&apos;hui dans l&apos;atelier.
              </p>
            </div>
            <div className="relative">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[38px] top-2" />
              <h3 className="text-xl font-serif text-white mb-2">L&apos;Apprentissage</h3>
              <p className="text-background/60">
                Dès son plus jeune âge, {firstName} a observé, imité et répété les gestes de ses aînés, apprenant la
                patience avant même de toucher la matière.
              </p>
            </div>
            <div className="relative">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[38px] top-2" />
              <h3 className="text-xl font-serif text-white mb-2">La Maîtrise</h3>
              <p className="text-background/60">
                Aujourd&apos;hui reconnu comme Maître dans son domaine, il allie l&apos;héritage intact de ses ancêtres à une
                vision esthétique personnelle et contemporaine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
