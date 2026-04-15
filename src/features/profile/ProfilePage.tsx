import { useState } from "react";
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
  const { orderService, artisanService, productService, userProfileService } = getServices();

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

  const [profile, setProfile] = useState(() => userProfileService.getOrCreate(session));
  const orders = orderService.listForUser(session.id);
  const artisans = artisanService.list();
  const allProducts = productService.list();

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
            onSave={(payload) => {
              const next = userProfileService.updatePersonalInfo(session, payload);
              setProfile(next);
            }}
          />

          <ProfileFavoriteArtisanCard
            artisans={artisans}
            favoriteArtisan={favoriteArtisan}
            favoriteArtisanId={profile.favoriteArtisanId}
            onSelectFavoriteArtisan={(artisanId) => {
              const next = userProfileService.setFavoriteArtisan(session, artisanId);
              setProfile(next);
            }}
          />
        </div>

        <ProfileFavoriteProductsSection
          allProducts={allProducts}
          favoriteProducts={favoriteProducts}
          onAddFavoriteProduct={(productId) => {
            const next = userProfileService.addFavoriteProduct(session, productId);
            setProfile(next);
          }}
          onRemoveFavoriteProduct={(productId) => {
            const next = userProfileService.removeFavoriteProduct(session, productId);
            setProfile(next);
          }}
        />

        <ProfileOrdersSection orders={orders} />
      </section>
      <Footer />
    </main>
  );
}
