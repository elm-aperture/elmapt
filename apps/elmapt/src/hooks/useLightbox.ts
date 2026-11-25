import { useCallback, useEffect, useMemo, useRef } from "react";
import { navigate } from "../router/history";
import { useLocation } from "../router/useRoute";

/* #img-7 on a page with one gallery; #img-hotel-7 when a page holds several
 * and each needs its own viewer. */
const ANY_FRAME = /^#img-(?:[a-z0-9-]+-)?\d+$/;

export function isViewingFrame(hash: string): boolean {
  return ANY_FRAME.test(hash);
}

export function useLightbox(count: number, key?: string) {
  const { pathname, hash } = useLocation();
  const pushedRef = useRef(false);
  const prefix = key ? `#img-${key}-` : "#img-";

  const frame = useMemo(() => {
    const match = new RegExp(`^${prefix}(\\d+)$`).exec(hash);
    if (!match) return null;
    const parsed = Number(match[1]);
    return parsed >= 1 && parsed <= count ? parsed : null;
  }, [hash, count, prefix]);

  useEffect(() => {
    if (frame === null) pushedRef.current = false;
  }, [frame]);

  const open = useCallback(
    (next: number) => {
      pushedRef.current = true;
      navigate(`${prefix}${next}`);
    },
    [prefix],
  );

  const show = useCallback(
    (next: number) => {
      navigate(`${prefix}${next}`, { replace: true });
    },
    [prefix],
  );

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
      return;
    }
    navigate(pathname, { replace: true, scroll: false });
  }, [pathname]);

  const step = useCallback(
    (delta: number) => {
      if (frame === null) return;
      const next = ((frame - 1 + delta + count) % count) + 1;
      show(next);
    },
    [frame, count, show],
  );

  return { frame, open, close, step };
}
