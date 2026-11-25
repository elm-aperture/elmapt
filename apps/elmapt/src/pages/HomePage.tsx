import { memo } from "react";
import { Hero } from "../components/Hero";

export const HomePage = memo(function HomePage() {
  return <Hero />;
});
