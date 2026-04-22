import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Remet la fenêtre en haut à chaque navigation client.
 * Sans cela, depuis une page longue (ex. accueil), on reste en bas de page
 * et les nouvelles routes (ex. /connexion) semblent « vides » jusqu’à un F5.
 */
export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}
