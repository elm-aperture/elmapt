import { useCallback, useState } from "react";

export function useLoaded(onSettle?: () => void) {
  const [loaded, setLoaded] = useState(false);

  const settle = useCallback(() => {
    setLoaded(true);
    onSettle?.();
  }, [onSettle]);

  const capture = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete) settle();
    },
    [settle],
  );

  return { loaded, capture, onLoad: settle, onError: settle };
}
