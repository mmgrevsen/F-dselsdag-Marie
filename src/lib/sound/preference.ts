import { birthdayConfig } from "@/config/birthday";

/**
 * The sound on/off preference as a small external store, so React can read it
 * with `useSyncExternalStore` without hydration mismatches.
 * Storage may be unavailable (private mode, blocked cookies) – that is fine.
 */

const STORAGE_KEY = "marie-fodselsdag:lyd";
const listeners = new Set<() => void>();
let current: boolean | null = null;

function readStored(): boolean {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {
    // Storage unavailable – fall back to the default.
  }
  return birthdayConfig.soundEnabledByDefault;
}

export function getSoundPreference(): boolean {
  if (current === null) current = readStored();
  return current;
}

export function getServerSoundPreference(): boolean {
  return birthdayConfig.soundEnabledByDefault;
}

export function setSoundPreference(enabled: boolean) {
  current = enabled;
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Ignore – the preference simply won't be remembered.
  }
  listeners.forEach((listener) => listener());
}

export function subscribeToSoundPreference(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
