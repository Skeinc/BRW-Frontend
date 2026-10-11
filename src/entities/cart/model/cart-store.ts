import { useSyncExternalStore } from 'react';

export interface CartLine {
  productId: string;
  qty: number;
}

const CART_STORAGE_KEY = 'brw-cart';
const EMPTY_LINES: readonly CartLine[] = [];

let lines: readonly CartLine[] = EMPTY_LINES;
let isHydrated = false;
const listeners = new Set<() => void>();

function hydrateFromStorage(): void {
  isHydrated = true;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    lines = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY_LINES;
  } catch {
    lines = EMPTY_LINES;
  }
}

function getSnapshot(): readonly CartLine[] {
  if (!isHydrated) {
    hydrateFromStorage();
  }
  return lines;
}

function getServerSnapshot(): readonly CartLine[] {
  return EMPTY_LINES;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Stub cart store: keeps only productId and qty. Replaced by the full cart in stage 5. */
export function useCartLines(): readonly CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
