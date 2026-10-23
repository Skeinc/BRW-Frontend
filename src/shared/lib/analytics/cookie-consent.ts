import { useSyncExternalStore } from 'react';

export type CookieConsent = 'granted' | 'denied';

const STORAGE_KEY = 'brw-cookie-consent';
const listeners = new Set<() => void>();

/** `undefined` until the browser is read (and on the server): the banner must not flash before that. */
let current: CookieConsent | null | undefined;

function read(): CookieConsent | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function getSnapshot(): CookieConsent | null | undefined {
  current ??= read();
  return current;
}

function getServerSnapshot(): undefined {
  return undefined;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The visitor's choice: `null` when not chosen yet, `undefined` while it is not known (server, first render). */
export function useCookieConsent(): CookieConsent | null | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getCookieConsent(): CookieConsent | null {
  return getSnapshot() ?? null;
}

export function setCookieConsent(value: CookieConsent | null): void {
  current = value;
  try {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage is unavailable: the choice holds until the page is closed.
  }
  emit();
}
