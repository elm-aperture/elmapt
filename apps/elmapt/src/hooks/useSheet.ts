import { useCallback, useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";

const HONEST = 0.25;

const RAMPED = 0.85;

const GAIN = 3.8;

type Zones = {
  a: number;
  b: number;
  l1: number;
  l2: number;
  l3: number;
  total: number;
};

function zones(height: number): Zones {
  const a = HONEST * height;
  const b = (RAMPED - HONEST) * height;
  const c = height - a - b;

  const l1 = a;
  const l2 = (2 * b) / (1 + GAIN);
  const l3 = (2 * c) / (1 + GAIN);

  return { a, b, l1, l2, l3, total: l1 + l2 + l3 };
}

function paneFor(hand: number, height: number): number {
  const { a, b, l1, l2, l3 } = zones(height);

  if (hand <= 0) return 0;
  if (hand <= l1) return hand;

  const climbing = hand - l1;
  if (climbing <= l2) {
    return a + climbing + ((GAIN - 1) * climbing * climbing) / (2 * l2);
  }

  const easing = climbing - l2;
  if (easing <= l3) {
    return a + b + GAIN * easing - ((GAIN - 1) * easing * easing) / (2 * l3);
  }

  return height;
}

const FLICK = 0.4;
const TAIL = 90;

const TAP = 6;

const REST = 140;

const WHEEL_FLICK = 1.1;

const SETTLE_PER_PX = 1.15;
const SETTLE_MIN = 260;
const SETTLE_MAX = 900;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export type HandleProps = {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
  onClickCapture: (event: ReactMouseEvent<HTMLElement>) => void;
};

export type SheetState = {
  open: boolean;

  progress: number;
  dragging: boolean;

  settling: boolean;

  wheeling: boolean;

  shift: string;

  settle: number;

  carriage: (node: HTMLDivElement | null) => void;

  pane: RefObject<HTMLElement | null>;

  toggle: () => void;
  handle: HandleProps;
};

export function useSheet({
  enabled = false,
}: { enabled?: boolean } = {}): SheetState {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [wheeling, setWheeling] = useState(false);

  const [settling, setSettling] = useState(false);
  const [hand, setHand] = useState(0);
  const [settle, setSettle] = useState(SETTLE_MAX);

  const pane = useRef<HTMLElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  const carriage = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const measure = () =>
      setHeight(Math.round(node.getBoundingClientRect().height));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      observer.disconnect();
      setHeight(null);
    };
  }, []);

  const from = useRef(0);
  const base = useRef(0);
  const moved = useRef(0);
  const trail = useRef<{ at: number; y: number }[]>([]);
  const rolling = useRef(false);
  const rolled = useRef(0);
  const rolls = useRef<{ at: number; by: number }[]>([]);
  const easing = useRef<number | undefined>(undefined);

  const [was, setWas] = useState(enabled);
  if (was !== enabled) {
    setWas(enabled);
    setOpen(false);
    setDragging(false);
    setWheeling(false);
    setSettling(false);
    setHand(0);
  }

  useEffect(() => {
    rolling.current = false;
    rolled.current = 0;
    moved.current = 0;
    window.clearTimeout(easing.current);
  }, [enabled]);

  const travel = height ?? 0;

  const settleTo = useCallback(
    (target: boolean, at: number) => {
      const left = Math.abs((target ? 1 : 0) - at) * (travel || 1);
      const ms = Math.min(
        SETTLE_MAX,
        Math.max(SETTLE_MIN, left * SETTLE_PER_PX),
      );

      setSettle(ms);
      setOpen(target);

      setSettling(true);
      window.clearTimeout(easing.current);
      easing.current = window.setTimeout(() => setSettling(false), ms);
    },
    [travel],
  );

  useEffect(() => () => window.clearTimeout(easing.current), []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);

      base.current = open && travel ? zones(travel).total : 0;
      from.current = event.clientY;
      moved.current = 0;
      trail.current = [{ at: event.timeStamp, y: event.clientY }];

      setHand(base.current);
      setDragging(true);
    },
    [open, travel],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!dragging) return;

      const delta = from.current - event.clientY;
      moved.current = Math.max(moved.current, Math.abs(delta));

      trail.current.push({ at: event.timeStamp, y: event.clientY });
      while (
        trail.current.length > 2 &&
        event.timeStamp - trail.current[0].at > TAIL
      ) {
        trail.current.shift();
      }

      setHand(base.current + delta);
    },
    [dragging],
  );

  const finish = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!dragging) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const at = travel
        ? clamp01(
            paneFor(base.current + (from.current - event.clientY), travel) /
              travel,
          )
        : 0;

      setDragging(false);

      if (moved.current < TAP) {
        settleTo(!open, open ? 1 : 0);
        return;
      }

      const first = trail.current[0];
      const span = event.timeStamp - first.at;
      const speed = span > 0 ? (first.y - event.clientY) / span : 0;

      settleTo(speed > FLICK || (speed >= -FLICK && at >= 0.5), at);
    },
    [dragging, open, travel, settleTo],
  );

  const onClickCapture = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    if (moved.current < TAP) return;
    event.preventDefault();
    event.stopPropagation();
    moved.current = 0;
  }, []);

  const toggle = useCallback(
    () => settleTo(!open, open ? 1 : 0),
    [open, settleTo],
  );

  useEffect(() => {
    if (!enabled || !travel) return;
    let resting = 0;
    const reach = zones(travel).total;

    const onWheel = (event: WheelEvent) => {
      const scroller = pane.current;
      const atTop = !scroller || scroller.scrollTop <= 0;

      if (open && !(atTop && event.deltaY < 0)) return;
      event.preventDefault();

      if (!rolling.current) {
        rolling.current = true;
        rolled.current = open ? reach : 0;
        rolls.current = [];
        setWheeling(true);
      }

      rolled.current = Math.max(
        0,
        Math.min(reach, rolled.current + event.deltaY),
      );
      rolls.current.push({ at: event.timeStamp, by: event.deltaY });
      while (
        rolls.current.length > 1 &&
        event.timeStamp - rolls.current[0].at > TAIL
      ) {
        rolls.current.shift();
      }
      setHand(rolled.current);

      window.clearTimeout(resting);
      resting = window.setTimeout(() => {
        rolling.current = false;
        setWheeling(false);

        const at = clamp01(paneFor(rolled.current, travel) / travel);
        const span =
          rolls.current.length > 1
            ? rolls.current[rolls.current.length - 1].at - rolls.current[0].at
            : 0;
        const by = rolls.current.reduce((sum, roll) => sum + roll.by, 0);
        const speed = span > 0 ? by / span : 0;

        settleTo(
          speed > WHEEL_FLICK || (speed >= -WHEEL_FLICK && at >= 0.5),
          at,
        );
      }, REST);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(resting);
    };
  }, [enabled, open, travel, settleTo]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (open) settleTo(false, 1);
        return;
      }

      if (!enabled) return;
      if (event.key === "ArrowUp" && !open) {
        event.preventDefault();
        settleTo(true, 0);
      } else if (event.key === "ArrowDown" && open) {
        event.preventDefault();
        settleTo(false, 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, enabled, settleTo]);

  const settled = open ? 1 : 0;
  const loose = dragging || wheeling;
  const progress =
    loose && travel ? clamp01(paneFor(hand, travel) / travel) : settled;

  return {
    open,
    progress,
    dragging,
    settling,
    wheeling,

    shift:
      height === null ? "100%" : `${Math.round((1 - progress) * height)}px`,
    settle,
    carriage,
    pane,
    toggle,
    handle: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
      onClickCapture,
    },
  };
}
