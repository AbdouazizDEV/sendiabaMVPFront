import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/domain/types";

type ProfilePersonalInfoFormProps = {
  profile: UserProfile;
  onSave: (payload: Pick<UserProfile, "fullName" | "phone" | "country" | "city">) => void;
};

export function ProfilePersonalInfoForm({ profile, onSave }: ProfilePersonalInfoFormProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [country, setCountry] = useState(profile.country);
  const [city, setCity] = useState(profile.city);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ fullName, phone, country, city });
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

      <Button type="submit" className="h-11 rounded-none uppercase tracking-[0.2em]">
        Mettre a jour mon profil
      </Button>
    </motion.form>
  );
}
