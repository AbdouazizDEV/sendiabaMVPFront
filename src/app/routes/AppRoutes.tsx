import { AnimatePresence, motion } from "framer-motion";
import { Route, Switch, useLocation } from "wouter";

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

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
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
      </motion.div>
    </AnimatePresence>
  );
}

export function AppRoutes() {
  return <AnimatedRoutes />;
}
