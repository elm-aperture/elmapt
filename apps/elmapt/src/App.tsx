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
import { BookingDock } from "./components/BookingDock";
import { isViewingFrame } from "./hooks/useLightbox";
import { useScrollLock } from "./hooks/useScrollLock";
import { useSheet } from "./hooks/useSheet";
import { useLocation, useRoute } from "./router/useRoute";
import type { Screen } from "./router/routes";
import { site } from "./site/site";

function screenTitle(screen: Screen): string {
  switch (screen.kind) {
    case "category":
      return `${screen.category.label} — ${site.name}`;
    case "work":
      return `${screen.work.title} — ${site.name}`;
    case "study":
      return `${screen.study.name} — ${site.name}`;
    case "people":
      return `Photographers — ${site.name}`;
    case "person":
      return `${screen.person.name} — ${site.name}`;
    case "missing":
      return `Not found — ${site.name}`;
    default:
      return site.name;
  }
}

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
  const sheet = useSheet({ enabled: home });

  useScrollLock(home || sheet.open);

  useEffect(() => {
    document.title = screenTitle(screen);
  }, [screen]);

  return (
    <>
      <AmbientField />

      <div className="elm-page">
        <TopNav />
        <main className={`page__main${home ? " page__main--home" : ""}`}>
          {view(screen)}
        </main>

        {home && <Sheet sheet={sheet} />}
      </div>

      <BookingDock hidden={isViewingFrame(hash)} />
    </>
  );
}
