import { Router as WouterRouter } from "wouter";

import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { CustomCursor } from "@/components/CustomCursor";

import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes/AppRoutes";
import { ScrollToTop } from "./routes/ScrollToTop";

export default function App() {
  return (
    <AppProviders>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <ScrollToTop />
        <CustomCursor />
        <AnnouncementBanner />
        <AppRoutes />
      </WouterRouter>
    </AppProviders>
  );
}
