import { useCallback, useEffect, useMemo, useRef } from "react";
import { navigate } from "../router/history";
import { useLocation } from "../router/useRoute";

/* Which frame is open is read from the address, not from component state.
 *
 * That gets three things at once: every frame is a shareable link, the
 * browser's Back button closes the viewer, and arrowing through a delivery
 * replaces the entry instead of stacking three hundred of them. */

const FRAME_HASH = /^#img-(\d+)$/;

/* Whether the address is pointing at a frame. The shell uses this to stand
 * the booking control down while a photograph is open; the hook below is what
 * decides which frame, once a set is in hand to bound it against. */
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
    /* Undo our own entry where we made one, so Back and the close control
     * leave the history stack in the same state. A frame opened straight from
     * a shared link has no entry of ours to pop. */
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
