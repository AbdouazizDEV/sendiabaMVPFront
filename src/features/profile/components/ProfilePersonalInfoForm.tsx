import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/domain/types";

type ProfilePersonalInfoFormProps = {
  profile: UserProfile;
  onSave: (
    payload: Pick<UserProfile, "fullName" | "phone" | "country" | "city">,
  ) => Promise<void>;
};

export function ProfilePersonalInfoForm({ profile, onSave }: ProfilePersonalInfoFormProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [country, setCountry] = useState(profile.country);
  const [city, setCity] = useState(profile.city);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profile.fullName);
    setPhone(profile.phone);
    setCountry(profile.country);
    setCity(profile.city);
  }, [profile]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await onSave({ fullName, phone, country, city });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Impossible de mettre a jour le profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      onSubmit={submit}
      className="space-y-5 border border-border p-6"
    >
      <h2 className="font-serif text-3xl">Informations personnelles</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="profileFullName">Nom complet</Label>
          <Input id="profileFullName" value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-11 rounded-none" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profilePhone">Telephone</Label>
          <Input id="profilePhone" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profileCountry">Pays</Label>
          <Input id="profileCountry" value={country} onChange={(event) => setCountry(event.target.value)} className="h-11 rounded-none" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="profileCity">Ville</Label>
          <Input id="profileCity" value={city} onChange={(event) => setCity(event.target.value)} className="h-11 rounded-none" />
        </div>
      </div>

      {errorMessage && (
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 rounded-none uppercase tracking-[0.2em]"
      >
        Mettre a jour mon profil
      </Button>
    </motion.form>
  );
}
