import { Hero } from "../components/Hero";
import { InstagramFeed } from "../components/InstagramFeed";
import { site } from "../site/site";

export function HomePage() {
  return (
    <>
      <Hero />
      <InstagramFeed
        feedId={site.instagram.feedId}
        eyebrow={site.instagram.eyebrow}
      />
    </>
  );
}
