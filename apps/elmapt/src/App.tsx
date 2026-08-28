import { useEffect } from "react";
import { AmbientField } from "./components/AmbientField";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { WorkPage } from "./pages/WorkPage";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { BookingDock } from "./components/BookingDock";
import { isViewingFrame } from "./hooks/useLightbox";
import { useScrollLock } from "./hooks/useScrollLock";
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
    case "missing":
      return <NotFoundPage />;
    case "redirecting":
      return null;
  }
}

export default function App() {
  const screen = useRoute();
  const { hash } = useLocation();

  /* The homepage fills exactly one screen by sizing, not by policy — this is
     the explicit backstop: nothing overflow-triggering should ever be able
     to sneak a scrollbar in underneath it. */
  useScrollLock(screen.kind === "home");

  useEffect(() => {
    document.title = screenTitle(screen);
  }, [screen]);

  return (
    <>
      <AmbientField />

      <div className="elm-page">
        <TopNav />
        <main
          className={`page__main${screen.kind === "home" ? " page__main--home" : ""}`}
        >
          {view(screen)}
        </main>
      </div>

      <Footer floating={screen.kind === "home"} />
      <BookingDock hidden={isViewingFrame(hash)} />
    </>
  );
}
