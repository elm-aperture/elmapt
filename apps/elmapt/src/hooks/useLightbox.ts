import { useCallback, useEffect, useMemo, useRef } from "react";
import { navigate } from "../router/history";
import { useLocation } from "../router/useRoute";

const FRAME_HASH = /^#img-(\d+)$/;

export function isViewingFrame(hash: string): boolean {
  return FRAME_HASH.test(hash);
}

export function useLightbox(count: number) {
  const { pathname, hash } = useLocation();
  const pushedRef = useRef(false);

  const frame = useMemo(() => {
    const match = FRAME_HASH.exec(hash);
    if (!match) return null;
    const parsed = Number(match[1]);
    return parsed >= 1 && parsed <= count ? parsed : null;
  }, [hash, count]);

  useEffect(() => {
    if (frame === null) pushedRef.current = false;
  }, [frame]);

  const open = useCallback((next: number) => {
    pushedRef.current = true;
    navigate(`#img-${next}`);
  }, []);

  const show = useCallback((next: number) => {
    navigate(`#img-${next}`, { replace: true });
  }, []);

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
