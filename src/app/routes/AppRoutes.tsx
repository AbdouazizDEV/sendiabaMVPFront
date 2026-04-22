import { Route, Switch } from "wouter";

import ArtisanDetailPage from "@/features/artisans/ArtisanDetailPage";
import ArtisansPage from "@/features/artisans/ArtisansPage";
import SignInPage from "@/features/auth/SignInPage";
import BackofficeArtisansPage from "@/features/backoffice/BackofficeArtisansPage";
import BackofficeContentPage from "@/features/backoffice/BackofficeContentPage";
import BackofficeHomePage from "@/features/backoffice/BackofficeHomePage";
import BackofficeUsersPage from "@/features/backoffice/BackofficeUsersPage";
import CartPage from "@/features/cart/CartPage";
import CheckoutPage from "@/features/checkout/CheckoutPage";
import CategoryPage from "@/features/category/CategoryPage";
import CollectionsPage from "@/features/collections/CollectionsPage";
import HomePage from "@/features/home/HomePage";
import NotFoundPage from "@/features/not-found/NotFoundPage";
import OrderTrackingPage from "@/features/orders/OrderTrackingPage";
import ProfilePage from "@/features/profile/ProfilePage";
import ProductDetailPage from "@/features/product/ProductDetailPage";

/**
 * Pas d'AnimatePresence ici : avec mode="wait", Framer Motion positionne souvent
 * la page sortante en absolute, ce qui peut faire tomber la hauteur du conteneur
 * à 0 → écran blanc (sauf éléments hors flux comme la bannière).
 */
function AppRoutesInner() {
  return (
    <div className="relative min-h-[100dvh] w-full">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/connexion" component={SignInPage} />
        <Route path="/backoffice" component={BackofficeHomePage} />
        <Route path="/backoffice/artisans" component={BackofficeArtisansPage} />
        <Route path="/backoffice/contenu" component={BackofficeContentPage} />
        <Route path="/backoffice/utilisateurs" component={BackofficeUsersPage} />
        <Route path="/profil" component={ProfilePage} />
        <Route path="/panier" component={CartPage} />
        <Route path="/paiement" component={CheckoutPage} />
        <Route path="/suivi-commande/:orderId" component={OrderTrackingPage} />
        <Route path="/collections" component={CollectionsPage} />
        <Route path="/collections/:categoryId" component={CategoryPage} />
        <Route path="/produit/:id" component={ProductDetailPage} />
        <Route path="/artisans" component={ArtisansPage} />
        <Route path="/artisans/:id" component={ArtisanDetailPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

export function AppRoutes() {
  return <AppRoutesInner />;
}
