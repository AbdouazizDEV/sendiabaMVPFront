import { useState, type FormEvent } from "react";

import { useAuth } from "@/app/state";
import type { AuthSession } from "@/domain/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthMode = "login" | "register";

type AuthFormPanelProps = {
  onSuccess: (session: AuthSession) => void;
};

export function AuthFormPanel({ onSuccess }: AuthFormPanelProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmEmailModalOpen, setConfirmEmailModalOpen] = useState(false);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const session = await login({ email, password });
        onSuccess(session);
      } else {
        await register({ displayName, phone, email, password });
        setPendingConfirmationEmail(email);
        setConfirmEmailModalOpen(true);
        setMode("login");
        setPassword("");
      }
    } catch (error) {
      const fallback = "Une erreur est survenue.";
      setErrorMessage(error instanceof Error ? error.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-none border-border bg-background/95 shadow-xl">
      <CardHeader className="space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-primary">Espace client</p>
        <CardTitle className="font-serif text-3xl">
          {mode === "login" ? "Connexion" : "Creer un compte"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Accedez a vos favoris et a votre panier personnalise."
            : "Rejoignez la maison Sendiaba pour suivre vos selections."}
        </CardDescription>

        <div className="grid grid-cols-2 gap-2 rounded-none border border-border p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-none px-3 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
              mode === "login"
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-none px-3 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
              mode === "register"
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Inscription
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="displayName">Nom complet</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  required
                  className="h-11 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telephone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  className="h-11 rounded-none"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-11 rounded-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="h-11 rounded-none"
            />
          </div>

          {errorMessage && (
            <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-none uppercase tracking-[0.2em]"
          >
            {mode === "login" ? "Se connecter" : "Creer mon compte"}
          </Button>
        </form>
      </CardContent>

      <Dialog open={confirmEmailModalOpen} onOpenChange={setConfirmEmailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmez votre email</DialogTitle>
            <DialogDescription>
              Un email de confirmation a ete envoye a{" "}
              <span className="font-medium text-foreground">{pendingConfirmationEmail}</span>.
              Ouvrez cet email puis cliquez sur le lien pour finaliser votre inscription et etre connecte automatiquement.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="rounded-none uppercase tracking-[0.2em]"
              onClick={() => setConfirmEmailModalOpen(false)}
            >
              D'accord
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
