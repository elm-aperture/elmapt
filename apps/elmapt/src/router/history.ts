type Listener = () => void;

type EntryState = {
  readonly key: number;
  readonly y: number;
};

const listeners = new Set<Listener>();

let snapshot = href();
let keySeed = 0;

function href(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function publish(): void {
  const next = href();
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

function entryState(): EntryState | null {
  return (window.history.state as EntryState | null) ?? null;
}

function rememberScroll(): void {
  const current = entryState();
  window.history.replaceState(
    { key: current?.key ?? (keySeed += 1), y: window.scrollY },
    "",
  );
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): string {
  return snapshot;
}

export type NavigateOptions = {
  readonly replace?: boolean;

  readonly scroll?: boolean;
};

export function navigate(to: string, options: NavigateOptions = {}): void {
  const url = new URL(to, window.location.href);

  if (url.origin !== window.location.origin) {
    window.location.assign(url.href);
    return;
  }

  if (url.href === window.location.href) return;

  const samePage =
    url.pathname === window.location.pathname &&
    url.search === window.location.search;

  if (!options.replace) rememberScroll();

  const state: EntryState = { key: (keySeed += 1), y: 0 };

  if (options.replace) window.history.replaceState(state, "", url.href);
  else window.history.pushState(state, "", url.href);

  publish();

  if (options.scroll ?? !samePage) window.scrollTo(0, 0);
}

export function startHistory(): () => void {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const onPop = () => {
    const y = entryState()?.y ?? 0;
    publish();

    if (!window.location.hash) {
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
  };

  window.addEventListener("popstate", onPop);
  return () => window.removeEventListener("popstate", onPop);
}

export function startLinkCapture(): () => void {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest("a");
    if (!anchor) return;

    const raw = anchor.getAttribute("href");
    if (raw === null) return;
    if (anchor.target && anchor.target !== "_self") return;
    if (anchor.hasAttribute("download")) return;
    if (anchor.getAttribute("rel")?.split(/\s+/).includes("external")) return;

    let url: URL;
    try {
      url = new URL(raw, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(url.href);
  };

  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
