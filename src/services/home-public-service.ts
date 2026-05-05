import { API_BASE_URL } from "@/core/config";

type HomeEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

export type HomeHero = {
  badge: string;
  title: string;
  cta: string;
  backgroundImageUrl: string;
};

export type HomeTrustItem = { title: string; desc: string };

export type HomeManifesto = {
  title: string;
  paragraphs: string[];
};

export type HomeCategoryItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
};

export type HomeCategories = {
  title: string;
  subtitle: string;
  items: HomeCategoryItem[];
};

export type HomeShopTab = {
  id: string;
  label: string;
  accent: string;
};

export type HomeShopTabs = {
  badge: string;
  title: string;
  tabs: HomeShopTab[];
};

export type HomeShopProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  tag: string | null;
  inStock: boolean;
  href: string;
  artisan?: {
    id: string;
    name: string;
  };
};

export type HomeShopProducts = {
  category: string;
  items: HomeShopProduct[];
};

export type HomePromoBanner = {
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  targetDate: string;
  remainingPieces: number;
  backgroundImageUrl: string;
  href: string;
};

export type HomeEditorialBlock = {
  label: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
};

export type HomeEditorial = {
  block1: HomeEditorialBlock;
  block2: HomeEditorialBlock;
};

export type HomeSavoirFaire = {
  badge: string;
  title: string;
  paragraphs: string[];
  imageUrl: string;
  cta: string;
};

export type HomeArtisanItem = {
  id: string;
  name: string;
  title: string;
  location: string;
  heritage: string;
  quote: string;
  imageUrl: string;
};

export type HomeArtisans = {
  title: string;
  subtitle: string;
  items: HomeArtisanItem[];
};

export type HomeFeaturedProducts = {
  title: string;
  subtitle: string;
  items: HomeShopProduct[];
};

export type HomeStatItem = {
  value: number;
  suffix: string;
  label: string;
};

export type HomePress = {
  badge: string;
  subtitle: string;
  logos: Array<{ name: string }>;
  quote: {
    text: string;
    source: string;
  };
};

export type HomeNewsletter = {
  title: string;
  subtitle: string;
  consentText: string;
  placeholder: string;
  buttonLabel: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Impossible de charger les donnees publiques.";
    try {
      const payload = (await response.json()) as { message?: string };
      if (payload.message) message = payload.message;
    } catch {
      // ignore and keep fallback
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

async function getHome<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const payload = await parseJson<T | HomeEnvelope<T>>(response);
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as HomeEnvelope<T>).data as T;
  }
  return payload as T;
}

export class HomePublicService {
  getHero(): Promise<HomeHero> {
    return getHome<HomeHero>("/v1/home/hero");
  }

  getBrandTicker(): Promise<{ items: string[] }> {
    return getHome<{ items: string[] }>("/v1/home/brand-ticker");
  }

  getTrustBar(): Promise<{ items: HomeTrustItem[] }> {
    return getHome<{ items: HomeTrustItem[] }>("/v1/home/trust-bar");
  }

  getManifesto(): Promise<HomeManifesto> {
    return getHome<HomeManifesto>("/v1/home/manifesto");
  }

  getCategories(): Promise<HomeCategories> {
    return getHome<HomeCategories>("/v1/home/categories");
  }

  getShopTabs(): Promise<HomeShopTabs> {
    return getHome<HomeShopTabs>("/v1/home/shop-tabs");
  }

  getShopProducts(category: string, limit = 4): Promise<HomeShopProducts> {
    const params = new URLSearchParams();
    params.set("category", category);
    params.set("limit", String(limit));
    return getHome<HomeShopProducts>(`/v1/home/shop-products?${params.toString()}`);
  }

  getPromoBanner(): Promise<HomePromoBanner> {
    return getHome<HomePromoBanner>("/v1/home/promo-banner");
  }

  getEditorial(): Promise<HomeEditorial> {
    return getHome<HomeEditorial>("/v1/home/editorial");
  }

  getSavoirFaire(): Promise<HomeSavoirFaire> {
    return getHome<HomeSavoirFaire>("/v1/home/savoir-faire");
  }

  getArtisans(): Promise<HomeArtisans> {
    return getHome<HomeArtisans>("/v1/home/artisans");
  }

  getFeaturedProducts(): Promise<HomeFeaturedProducts> {
    return getHome<HomeFeaturedProducts>("/v1/home/featured-products");
  }

  getStats(): Promise<{ items: HomeStatItem[] }> {
    return getHome<{ items: HomeStatItem[] }>("/v1/home/stats");
  }

  getPress(): Promise<HomePress> {
    return getHome<HomePress>("/v1/home/press");
  }

  getNewsletter(): Promise<HomeNewsletter> {
    return getHome<HomeNewsletter>("/v1/home/newsletter");
  }
}
