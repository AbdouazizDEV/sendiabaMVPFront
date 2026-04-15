import { motion } from "framer-motion";
import { Link } from "wouter";
import { SiInstagram, SiPinterest } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 py-24 border-t border-background/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-serif text-background mb-6">SENDIABA</h2>
            <p className="max-w-md text-background/60 leading-relaxed mb-8">
              Porté. Posé. Vécu. Fait main.<br/>
              Un pont culturel entre les maîtres artisans d'Afrique et le monde. Chaque pièce raconte une histoire, chaque artisan a un nom.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <SiInstagram size={20} />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <SiPinterest size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest text-background mb-6 font-medium">Collections</h3>
            <ul className="space-y-4">
              <li><Link href="/collections/maroquinerie" className="hover:text-primary transition-colors">Maroquinerie & Cuir</Link></li>
              <li><Link href="/collections/maison" className="hover:text-primary transition-colors">Maison & Textile d'Art</Link></li>
              <li><Link href="/collections/decoration" className="hover:text-primary transition-colors">Décoration & Objets d'Art</Link></li>
              <li><Link href="/collections/coffrets" className="hover:text-primary transition-colors">Coffrets & Cadeaux</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest text-background mb-6 font-medium">La Maison</h3>
            <ul className="space-y-4">
              <li><Link href="/artisans" className="hover:text-primary transition-colors">Nos Maîtres Artisans</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Notre Manifeste</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/50 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Sendiaba. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-background transition-colors">Politique de Confidentialité</a>
            <a href="#" className="hover:text-background transition-colors">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
