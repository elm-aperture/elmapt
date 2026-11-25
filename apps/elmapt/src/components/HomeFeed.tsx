import { memo } from "react";
import { InstagramFeed } from "./InstagramFeed";
import { useAfterLoad } from "../hooks/useAfterLoad";
import { site } from "../site/site";

/** The studio's Instagram feed in the About sheet. The widget pulls in a
 * third-party script, so it only mounts once the visible page has loaded. */
export const HomeFeed = memo(function HomeFeed() {
  const warm = useAfterLoad(".feed");
  return warm ? (
    <InstagramFeed
      feedId={site.instagram.feed}
      eyebrow={`${site.name} on Instagram`}
    />
  ) : null;
});
