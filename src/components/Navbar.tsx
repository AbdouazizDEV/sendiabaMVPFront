import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth, useCart } from "@/app/state";

export function Navbar() {
  const [location] = useLocation();
  const isHome = location === "/";

  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const [isScrolled, setIsScrolled] = useState(!isHome);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const collections = [
    { name: "Maroquinerie & Cuir", path: "/collections/maroquinerie" },
    { name: "Maison & Textile d'Art", path: "/collections/maison" },
    { name: "Décoration & Objets d'Art", path: "/collections/decoration" },
    { name: "Coffrets & Cadeaux", path: "/collections/coffrets" },
  ];

  const handleMobileNav = () => {
    setMobileMenuOpen(false);
    setMobileCollectionsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${
        isScrolled || !isHome
          ? "bg-background/95 backdrop-blur-md border-border py-4 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="text-2xl font-serif tracking-wide font-bold text-foreground z-50">
          SENDIABA
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <div className="group relative">
            <Link
              href="/collections"
              className="text-sm uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors duration-300 py-4 flex items-center gap-1"
            >
              Collections
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </Link>

            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-background border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex p-6 gap-6">
              <div className="w-1/3">
                <h3 className="font-serif text-xl text-foreground mb-2">Toutes nos collections</h3>
                <p className="text-muted-foreground text-sm mb-4">L'excellence de l'artisanat ouest-africain.</p>
                <Link
                  href="/collections"
                  className="text-xs uppercase tracking-widest text-primary border-b border-primary/30 pb-1 hover:border-primary transition-colors"
                >
                  Voir tout
                </Link>
              </div>
              <div className="w-2/3 grid grid-cols-2 gap-4">
                {collections.map((col) => (
                  <Link key={col.name} href={col.path} className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                    {col.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/artisans" className="text-sm uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors duration-300">
            Maitres Artisans
          </Link>

          <Link href="/collections" className="text-sm uppercase tracking-widest text-foreground/80 hover:text-primary transition-colors duration-300">
            Pieces Uniques
          </Link>
        </div>

        <div className="flex items-center gap-4 z-50">
          {isAuthenticated ? (
            <>
              <Link href="/panier" className="relative text-foreground hover:text-primary transition-colors" aria-label="Panier">
                <ShoppingBag size={24} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link href="/profil" className="hidden md:inline text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
                Mon profil
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden md:inline text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                Deconnexion
              </button>
            </>
          ) : (
            <Link href="/connexion">
              <Button variant="outline" className="h-10 rounded-none uppercase tracking-[0.2em] text-xs">
                Connexion
              </Button>
            </Link>
          )}

          <button
            className="md:hidden text-foreground ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="md:hidden fixed inset-0 top-[72px] bg-background flex flex-col px-6 py-10 overflow-y-auto"
          >
            <div className="flex flex-col space-y-6">
              <div>
                <div
                  className="flex justify-between items-center text-2xl font-serif text-foreground pb-4 border-b border-border/50 cursor-pointer"
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                >
                  Collections
                  <ChevronDown className={`transition-transform duration-300 ${mobileCollectionsOpen ? "rotate-180" : ""}`} />
                </div>

                <AnimatePresence>
                  {mobileCollectionsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col pt-4 pb-2 space-y-4 pl-4"
                    >
                      <Link href="/collections" onClick={handleMobileNav} className="text-lg text-foreground/80 hover:text-primary font-serif">
                        Toutes les collections
                      </Link>
                      {collections.map((col) => (
                        <Link key={col.name} href={col.path} onClick={handleMobileNav} className="text-lg text-foreground/80 hover:text-primary font-serif">
                          {col.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/artisans" onClick={handleMobileNav} className="text-2xl font-serif text-foreground pb-4 border-b border-border/50">
                Maitres Artisans
              </Link>

              <Link href="/collections" onClick={handleMobileNav} className="text-2xl font-serif text-foreground pb-4 border-b border-border/50">
                Pieces Uniques
              </Link>

              {isAuthenticated ? (
                <>
                  <Link href="/panier" onClick={handleMobileNav} className="text-2xl font-serif text-foreground pb-4 border-b border-border/50">
                    Panier ({itemCount})
                  </Link>
                  <Link href="/profil" onClick={handleMobileNav} className="text-2xl font-serif text-foreground pb-4 border-b border-border/50">
                    Mon profil
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      handleMobileNav();
                    }}
                    className="text-left text-2xl font-serif text-foreground pb-4 border-b border-border/50"
                  >
                    Deconnexion
                  </button>
                </>
              ) : (
                <Link href="/connexion" onClick={handleMobileNav} className="text-2xl font-serif text-foreground pb-4 border-b border-border/50">
                  Connexion
                </Link>
              )}
            </div>

            <div className="mt-auto pt-10">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Sendiaba</p>
              <p className="text-foreground font-serif">Porte. Pose. Vivez. Fait main.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
