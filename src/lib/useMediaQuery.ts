"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Læser en media query uden at sætte state i en effekt.
 * På serveren og ved første render returneres `false`, så markup
 * er ens på server og klient.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * Brugerens ønske om mindre bevægelse — læst hydrerings-sikkert, så
 * server og klient altid er enige om den første render.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
