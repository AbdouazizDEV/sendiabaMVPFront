import { useEffect } from "react";

import { useAuth } from "@/app/state";
import { Navbar } from "@/components/Navbar";
import type { AuthSession } from "@/domain/types";

import { AuthFormPanel } from "./components/AuthFormPanel";
import { AuthShowcasePanel } from "./components/AuthShowcasePanel";

function resolvePostLoginPath(session: AuthSession): string {
  return session.role === "admin" ? "/backoffice" : "/";
}

export default function SignInPage() {
  const { isAuthenticated, session } = useAuth();

  useEffect(() => {
    if (isAuthenticated && session) {
      window.location.assign(resolvePostLoginPath(session));
    }
  }, [isAuthenticated, session]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-16 pt-32 md:px-12 lg:grid-cols-[1.1fr_1fr]">
        <AuthShowcasePanel />
        <div className="flex min-h-[620px] items-center">
          <div className="w-full">
            <AuthFormPanel
              onSuccess={(nextSession) =>
                window.location.assign(resolvePostLoginPath(nextSession))
              }
            />
          </div>
        </div>
      </section>
    </main>
  );
}
