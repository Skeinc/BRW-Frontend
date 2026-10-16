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

function isCartLine(value: unknown): value is CartLine {
  return (
    typeof value === 'object' &&
    value !== null &&
    'productId' in value &&
    'qty' in value &&
    typeof value.productId === 'string' &&
    typeof value.qty === 'number' &&
    Number.isInteger(value.qty) &&
    value.qty > 0
  );
}

function parseLines(raw: string | null): readonly CartLine[] {
  if (!raw) {
    return EMPTY_LINES;
  }
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.filter(isCartLine) : EMPTY_LINES;
}

function hydrateFromStorage(): void {
  isHydrated = true;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    lines = parseLines(raw);
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

function onStorage(event: StorageEvent): void {
  if (event.key !== CART_STORAGE_KEY && event.key !== null) {
    return;
  }
  hydrateFromStorage();
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    window.addEventListener('storage', onStorage);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('storage', onStorage);
    }
  };
}

/** Stub cart store: keeps only productId and qty. Replaced by the full cart in stage 5. */
export function useCartLines(): readonly CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
