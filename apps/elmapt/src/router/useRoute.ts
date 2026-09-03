import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  getSnapshot,
  navigate,
  startHistory,
  startLinkCapture,
  subscribe,
} from "./history";
import { redirectFor, resolve } from "./routes";
import type { Screen } from "./routes";

export type Location = {
  readonly pathname: string;
  readonly hash: string;
};

export function useLocation(): Location {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return useMemo(() => {
    const hashAt = raw.indexOf("#");
    const withoutHash = hashAt === -1 ? raw : raw.slice(0, hashAt);
    const queryAt = withoutHash.indexOf("?");
    return {
      pathname: queryAt === -1 ? withoutHash : withoutHash.slice(0, queryAt),
      hash: hashAt === -1 ? "" : raw.slice(hashAt),
    };
  }, [raw]);
}

export function useRoute(): Screen {
  const { pathname } = useLocation();

  useEffect(() => {
    const stopHistory = startHistory();
    const stopLinks = startLinkCapture();
    return () => {
      stopHistory();
      stopLinks();
    };
  }, []);

  const redirect = redirectFor(pathname);

  useEffect(() => {
    if (redirect) navigate(redirect, { replace: true });
  }, [redirect]);

  return useMemo(
    () => (redirect ? { kind: "redirecting" as const } : resolve(pathname)),
    [pathname, redirect],
  );
}
