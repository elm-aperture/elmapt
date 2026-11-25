import { useEffect } from "react";
import { AmbientField } from "./components/AmbientField";
import { TopNav } from "./components/TopNav";
import { Sheet } from "./components/Sheet";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { WorkPage } from "./pages/WorkPage";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PhotographersPage } from "./pages/PhotographersPage";
import { PhotographerPage } from "./pages/PhotographerPage";
import { BookingPage } from "./pages/BookingPage";
import { LandingPage } from "./pages/LandingPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { BookingDock } from "./components/BookingDock";
import { SiteFooter } from "./components/SiteFooter";
import { isViewingFrame } from "./hooks/useLightbox";
import { useScrollLock } from "./hooks/useScrollLock";
import { useSheet } from "./hooks/useSheet";
import { useLocation, useRoute } from "./router/useRoute";
import type { Screen } from "./router/routes";
import { titleFor } from "./site/meta";

function view(screen: Screen) {
  switch (screen.kind) {
    case "home":
      return <HomePage />;
    case "category":
      return <CategoryPage category={screen.category} />;
    case "work":
      return <WorkPage category={screen.category} work={screen.work} />;
    case "study":
      return (
        <CaseStudyPage
          category={screen.category}
          work={screen.work}
          study={screen.study}
        />
      );
    case "booking":
      return <BookingPage />;
    case "privacy":
      return <PrivacyPage />;
    case "landing":
      return <LandingPage landing={screen.landing} sections={screen.sections} />;
    case "people":
      return <PhotographersPage />;
    case "person":
      return <PhotographerPage person={screen.person} />;
    case "missing":
      return <NotFoundPage />;
    case "redirecting":
      return null;
  }
}

export default function App() {
  const screen = useRoute();
  const { hash } = useLocation();

  const home = screen.kind === "home";
  const landing = screen.kind === "landing";
  const booking = screen.kind === "booking";
  const sheet = useSheet({ enabled: home });

  useScrollLock(home || sheet.open);

  useEffect(() => {
    document.title = titleFor(screen);
  }, [screen]);

  return (
    <>
      <AmbientField />

      <div className="elm-page">
        <TopNav />
        <main className={`page__main${home ? " page__main--home" : ""}`}>
          {view(screen)}
        </main>

        {home ? <Sheet sheet={sheet} /> : <SiteFooter />}
      </div>

      <BookingDock
        hidden={booking || landing || isViewingFrame(hash)}
      />
    </>
  );
}
