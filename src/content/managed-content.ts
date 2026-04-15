export type ManagedContentEntry = {
  key: string;
  scope: string;
  label: string;
  defaultValue: string;
};

const STORAGE_KEY = "sendiaba.backoffice.content-overrides";

export const MANAGED_CONTENT_ENTRIES: ManagedContentEntry[] = [
  { key: "home.hero.badge", scope: "home", label: "Hero - Badge", defaultValue: "Porte. Pose. Vecu. Fait main." },
  { key: "home.hero.title", scope: "home", label: "Hero - Titre", defaultValue: "L'ame de l'artisanat africain." },
  { key: "home.hero.cta", scope: "home", label: "Hero - CTA", defaultValue: "Decouvrir l'Atelier" },
  { key: "home.manifesto.title", scope: "home", label: "Manifesto - Titre", defaultValue: "Nous ne sommes pas une marketplace. Nous sommes un pont culturel entre les maitres artisans d'Afrique et le monde." },
  { key: "home.categories.title", scope: "home", label: "Categories - Titre", defaultValue: "Les Collections" },
  { key: "home.categories.subtitle", scope: "home", label: "Categories - Sous-titre", defaultValue: "L'excellence de l'artisanat ouest-africain, declinee en quatre univers d'exception." },
  { key: "home.editorial.block1.title", scope: "home", label: "Editorial bloc 1 - Titre", defaultValue: "Le sac qui voyage avec vous" },
  { key: "home.editorial.block2.title", scope: "home", label: "Editorial bloc 2 - Titre", defaultValue: "L'art du tissu, eleve au rang de decoration" },
  { key: "home.newsletter.title", scope: "home", label: "Newsletter - Titre", defaultValue: "Rejoignez l'Atelier" },
  { key: "home.newsletter.subtitle", scope: "home", label: "Newsletter - Sous-titre", defaultValue: "Inscrivez-vous pour decouvrir en avant-premiere nos nouvelles creations, les histoires de nos artisans et nos editions limitees." },
  { key: "home.artisans.title", scope: "home", label: "Section artisans - Titre", defaultValue: "Derriere chaque objet, une lignee." },
  { key: "home.artisans.subtitle", scope: "home", label: "Section artisans - Sous-titre", defaultValue: "Le vrai luxe reside dans l'humanite de la creation. Rencontrez les maitres artisans dont les noms signent l'authenticite de nos collections." },
  { key: "home.featured.title", scope: "home", label: "Featured - Titre", defaultValue: "Selection Singuliere" },
  { key: "home.featured.subtitle", scope: "home", label: "Featured - Sous-titre", defaultValue: "Des pieces choisies pour leur aura et leur perfection technique." },
  { key: "home.shop.badge", scope: "home", label: "Boutique - Badge", defaultValue: "La Boutique" },
  { key: "home.shop.title", scope: "home", label: "Boutique - Titre", defaultValue: "Chaque piece, une histoire." },
  { key: "home.press.badge", scope: "home", label: "Press - Badge", defaultValue: "Ils parlent de nous" },
  { key: "home.press.subtitle", scope: "home", label: "Press - Sous-titre", defaultValue: "Sendiaba est reconnue par les medias africains et internationaux comme la reference du luxe artisanal de la sous-region." },
  { key: "home.promo.badge", scope: "home", label: "Promo - Badge", defaultValue: "Collection Exclusive" },
  { key: "home.promo.title", scope: "home", label: "Promo - Titre", defaultValue: "Tabaski 2026 - Edition Limitee" },
  { key: "home.promo.subtitle", scope: "home", label: "Promo - Sous-titre", defaultValue: "Des coffrets et creations artisanales penses pour celebrer la fete avec raffinement. Chaque piece est numerotee, signee par son artisan, et livree dans un ecrin premium." },
  { key: "home.promo.cta", scope: "home", label: "Promo - CTA", defaultValue: "Decouvrir la Collection" },
  { key: "home.savoirfaire.badge", scope: "home", label: "Savoir-faire - Badge", defaultValue: "L'Art du Temps" },
  { key: "home.savoirfaire.title", scope: "home", label: "Savoir-faire - Titre", defaultValue: "Le temps est notre matiere premiere." },
  { key: "artisans.hero.badge", scope: "artisans", label: "Artisans - Hero badge", defaultValue: "Nos Maitres Artisans" },
  { key: "artisans.hero.title", scope: "artisans", label: "Artisans - Hero titre", defaultValue: "Les Mains de l'Excellence" },
  { key: "artisans.hero.subtitle", scope: "artisans", label: "Artisans - Hero sous-titre", defaultValue: "Le vrai luxe n'est pas silencieux. Il parle des mains qui l'ont forge, du temps qu'il a fallu pour l'apprivoiser, et des generations qui ont transmis le geste." },
  { key: "cart.page.title", scope: "cart", label: "Panier - Titre", defaultValue: "Vos pieces selectionnees" },
  { key: "cart.page.link", scope: "cart", label: "Panier - Lien retour", defaultValue: "Continuer les achats" },
  { key: "cart.empty.title", scope: "cart", label: "Panier vide - Titre", defaultValue: "Votre selection est vide" },
  { key: "cart.empty.subtitle", scope: "cart", label: "Panier vide - Texte", defaultValue: "Decouvrez nos pieces d exception et ajoutez celles qui vous inspirent pour composer votre prochaine commande." },
  { key: "collections.hero.badge", scope: "collections", label: "Collections - Hero badge", defaultValue: "Le Catalogue Sendiaba" },
  { key: "collections.hero.title", scope: "collections", label: "Collections - Hero titre", defaultValue: "Nos Collections" },
  { key: "collections.hero.quote", scope: "collections", label: "Collections - Hero citation", defaultValue: "Le veritable luxe est celui qui porte en lui l'empreinte d'une culture, la noblesse d'une matiere et la passion d'un createur." },
  { key: "category.empty.title", scope: "category", label: "Categorie - Aucun resultat titre", defaultValue: "Aucune creation ne correspond a vos criteres." },
  { key: "category.empty.subtitle", scope: "category", label: "Categorie - Aucun resultat texte", defaultValue: "Essayez de modifier vos filtres pour voir plus de resultats." },
  { key: "checkout.hero.badge", scope: "checkout", label: "Checkout - Hero badge", defaultValue: "Paiement securise" },
  { key: "checkout.hero.title", scope: "checkout", label: "Checkout - Hero titre", defaultValue: "Finalisez votre commande en toute serenite" },
  { key: "checkout.hero.subtitle", scope: "checkout", label: "Checkout - Hero texte", defaultValue: "Renseignez vos informations de livraison et choisissez votre moyen de paiement. Chaque commande est confirmee avec une facture imprimable et un suivi detaille." },
];

function inBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readContentOverrides(): Record<string, string> {
  if (!inBrowser()) return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function writeContentOverrides(next: Record<string, string>): void {
  if (!inBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getManagedText(key: string, fallback: string): string {
  const overrides = readContentOverrides();
  const direct = overrides[key];
  if (direct != null && direct.trim() !== "") {
    return direct;
  }
  return fallback;
}
