import { motion } from "framer-motion";

type ProfileHeroProps = {
  displayName: string;
  email: string;
};

export function ProfileHero({ displayName, email }: ProfileHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-primary">Mon profil</p>
      <h1 className="mt-4 font-serif text-5xl">Bienvenue {displayName}</h1>
      <p className="mt-3 text-muted-foreground">{email}</p>
    </motion.div>
  );
}
