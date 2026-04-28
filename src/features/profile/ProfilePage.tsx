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
  const { authService, orderService, artisanService, productService, userProfileService } =
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
  const orders = orderService.listForUser(session.id);
  const artisans = artisanService.list();
  const allProducts = productService.list();

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
        const next = await userProfileService.getCurrentProfile(accessToken);
        if (!cancelled) {
          setProfile(next);
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
  }, [authService, userProfileService]);

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
    ? artisanService.getById(profile.favoriteArtisanId)
    : undefined;

  const favoriteProducts = profile.favoriteProductIds
    .map((id) => productService.getById(id))
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
      </section>
      <Footer />
    </main>
  );
}
