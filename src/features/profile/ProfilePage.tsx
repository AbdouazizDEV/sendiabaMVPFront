import { useEffect, useState } from "react";
import { Link } from "wouter";

import { getServices } from "@/app/di/services";
import { useAuth } from "@/app/state";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import { ProfileFavoriteArtisanCard } from "./components/ProfileFavoriteArtisanCard";
import { ProfileFavoriteProductsSection } from "./components/ProfileFavoriteProductsSection";
import { ProfileHero } from "./components/ProfileHero";
import { ProfileOrdersSection } from "./components/ProfileOrdersSection";
import { ProfilePersonalInfoForm } from "./components/ProfilePersonalInfoForm";

export default function ProfilePage() {
  const { session, isAuthenticated } = useAuth();
  const {
    authService,
    customerCatalogService,
    customerOrdersService,
    userProfileService,
  } =
    getServices();

  if (!isAuthenticated || !session) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container mx-auto px-6 pt-36 text-center">
          <p className="text-muted-foreground">Veuillez vous connecter pour acceder a votre profil.</p>
          <Link href="/connexion" className="mt-6 inline-block text-primary underline-offset-4 hover:underline">
            Aller a la connexion
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const [profile, setProfile] = useState<Awaited<
    ReturnType<typeof userProfileService.getCurrentProfile>
  > | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orders, setOrders] = useState<
    Array<{ id: string; createdAt: string; total: number; status: string }>
  >([]);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; title?: string; message?: string; at?: string; status?: string; read?: boolean }>
  >([]);
  const [artisans, setArtisans] = useState<
    Array<{
      id: string;
      name: string;
      title: string;
      location: string;
      heritage: string;
      quote: string;
      bio: string;
      image: string;
      speciality: string;
      yearsExperience: number;
      productsCount: number;
    }>
  >([]);
  const [allProducts, setAllProducts] = useState<
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
    const loadProfile = async () => {
      const accessToken = authService.getAccessToken();
      if (!accessToken) {
        setErrorMessage("Session invalide. Veuillez vous reconnecter.");
        setIsLoadingProfile(false);
        return;
      }

      try {
        setIsLoadingProfile(true);
        setErrorMessage(null);
        const [next, artisansRes, productsRes, ordersRes, notificationsRes] = await Promise.all([
          userProfileService.getCurrentProfile(accessToken),
          customerCatalogService.listArtisans(accessToken),
          customerCatalogService.listProducts(accessToken),
          customerOrdersService.listOrders(accessToken),
          customerOrdersService.listNotifications(accessToken),
        ]);
        if (!cancelled) {
          setProfile(next);
          setArtisans(
            artisansRes.map((item) => ({
              id: item.id,
              name: item.name,
              title: item.title,
              location: item.location,
              heritage: item.heritage,
              quote: item.quote,
              bio: item.bio,
              image: item.imageUrl,
              speciality: item.speciality,
              yearsExperience: item.yearsExperience,
              productsCount: item.productsCount,
            })),
          );
          setAllProducts(
            productsRes.map((item) => ({
              id: item.id,
              name: item.name,
              artisanId: "",
              category: "maroquinerie",
              subcategory: "",
              price: item.price,
              description: "",
              details: [],
              image: item.imageUrl,
              inStock: true,
            })),
          );
          setOrders(
            ordersRes.map((item) => ({
              id: item.orderId,
              createdAt: item.at,
              total: 0,
              status: item.status,
            })),
          );
          setNotifications(
            notificationsRes.map((item) => ({
              id: item.id,
              title: item.title,
              message: item.message,
              at: item.at ?? item.createdAt,
              status: item.status,
              read: item.read,
            })),
          );
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Impossible de charger votre profil.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProfile(false);
        }
      }
    };

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [authService, customerCatalogService, customerOrdersService, userProfileService]);

  if (isLoadingProfile) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container mx-auto px-6 pb-20 pt-32 md:px-12">
          <p className="text-muted-foreground">Chargement de votre profil...</p>
        </section>
        <Footer />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container mx-auto px-6 pb-20 pt-32 md:px-12">
          <p className="text-destructive">{errorMessage ?? "Profil indisponible."}</p>
        </section>
        <Footer />
      </main>
    );
  }

  const favoriteArtisan = profile.favoriteArtisanId
    ? artisans.find((artisan) => artisan.id === profile.favoriteArtisanId)
    : undefined;

  const favoriteProducts = profile.favoriteProductIds
    .map((id) => allProducts.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-6 pb-20 pt-32 md:px-12 space-y-8">
        <ProfileHero displayName={session.displayName} email={session.email} />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1fr]">
          <ProfilePersonalInfoForm
            profile={profile}
            onSave={async (payload) => {
              const accessToken = authService.getAccessToken();
              if (!accessToken) throw new Error("Session invalide. Veuillez vous reconnecter.");
              const next = await userProfileService.updatePersonalInfo(accessToken, payload);
              setProfile(next);
            }}
          />

          <ProfileFavoriteArtisanCard
            artisans={artisans}
            favoriteArtisan={favoriteArtisan}
            favoriteArtisanId={profile.favoriteArtisanId}
            onSelectFavoriteArtisan={async (artisanId) => {
              const accessToken = authService.getAccessToken();
              if (!accessToken) throw new Error("Session invalide. Veuillez vous reconnecter.");
              const data = await userProfileService.setFavoriteArtisan(accessToken, artisanId);
              setProfile((current) =>
                current
                  ? {
                      ...current,
                      favoriteArtisanId: data.favoriteArtisanId ?? undefined,
                    }
                  : current,
              );
            }}
          />
        </div>

        <ProfileFavoriteProductsSection
          allProducts={allProducts}
          favoriteProducts={favoriteProducts}
          onAddFavoriteProduct={async (productId) => {
            const accessToken = authService.getAccessToken();
            if (!accessToken) throw new Error("Session invalide. Veuillez vous reconnecter.");
            const data = await userProfileService.addFavoriteProduct(accessToken, productId);
            setProfile((current) =>
              current
                ? {
                    ...current,
                    favoriteProductIds: data.favoriteProductIds,
                  }
                : current,
            );
          }}
          onRemoveFavoriteProduct={async (productId) => {
            const accessToken = authService.getAccessToken();
            if (!accessToken) throw new Error("Session invalide. Veuillez vous reconnecter.");
            const data = await userProfileService.removeFavoriteProduct(accessToken, productId);
            setProfile((current) =>
              current
                ? {
                    ...current,
                    favoriteProductIds: data.favoriteProductIds,
                  }
                : current,
            );
          }}
        />

        <ProfileOrdersSection orders={orders} />
        <section className="space-y-4 border border-border p-6">
          <h2 className="font-serif text-3xl">Notifications commandes</h2>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune notification pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <article key={notification.id} className="border border-border p-4">
                  <p className="font-medium">
                    {notification.title ?? "Mise a jour commande"}
                    {notification.read === false ? " • Non lue" : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">{notification.message ?? notification.status ?? "-"}</p>
                  {notification.at && (
                    <p className="mt-2 text-xs text-muted-foreground">{new Date(notification.at).toLocaleString("fr-FR")}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
      <Footer />
    </main>
  );
}
