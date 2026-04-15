import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CheckoutDetails, PaymentMethod } from "@/domain/types";

type CheckoutFormProps = {
  initialName: string;
  onSubmit: (payload: CheckoutDetails) => void;
  isSubmitting: boolean;
};

const paymentOptions: Array<{ value: PaymentMethod; label: string; hint: string }> = [
  { value: "card", label: "Carte bancaire", hint: "Visa, Mastercard" },
  { value: "mobile_money", label: "Mobile Money", hint: "Orange Money, Wave, MTN" },
  { value: "bank_transfer", label: "Virement bancaire", hint: "IBAN transmis apres validation" },
  { value: "cash_on_delivery", label: "Paiement a la livraison", hint: "Disponible dans certaines zones" },
];

export function CheckoutForm({ initialName, onSubmit, isSubmitting }: CheckoutFormProps) {
  const [fullName, setFullName] = useState(initialName);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Senegal");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      fullName,
      phone,
      country,
      city,
      district,
      addressLine,
      postalCode,
      notes,
      paymentMethod,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      onSubmit={submit}
      className="space-y-6 border border-border p-6"
    >
      <h2 className="font-serif text-3xl">Informations de livraison</h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="fullName">Nom complet</Label>
          <Input id="fullName" required value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-11 rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telephone</Label>
          <Input id="phone" required value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Input id="country" required value={country} onChange={(event) => setCountry(event.target.value)} className="h-11 rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" required value={city} onChange={(event) => setCity(event.target.value)} className="h-11 rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">Quartier</Label>
          <Input id="district" required value={district} onChange={(event) => setDistrict(event.target.value)} className="h-11 rounded-none" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="addressLine">Adresse detaillee</Label>
          <Input id="addressLine" required value={addressLine} onChange={(event) => setAddressLine(event.target.value)} className="h-11 rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Code postal (optionnel)</Label>
          <Input id="postalCode" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} className="h-11 rounded-none" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Moyen de paiement</Label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {paymentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPaymentMethod(option.value)}
              className={`border px-4 py-3 text-left transition-colors ${
                paymentMethod === option.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <p className="text-sm uppercase tracking-[0.15em]">{option.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{option.hint}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Informations complementaires</Label>
        <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-[100px] rounded-none" />
      </div>

      <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-none uppercase tracking-[0.2em]">
        {isSubmitting ? "Validation..." : "Passer la commande"}
      </Button>
    </motion.form>
  );
}
