import { useSyncExternalStore } from 'react';

export interface CartLine {
  productId: string;
  qty: number;
}

const CART_STORAGE_KEY = 'brw-cart';
/** Matches the API limit for one order line. */
export const MAX_LINE_QTY = 99;
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

function setLines(next: readonly CartLine[]): void {
  getSnapshot();
  lines = next.length === 0 ? EMPTY_LINES : next;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage is unavailable (private mode, quota): the cart still works for this page view.
  }
  for (const listener of listeners) {
    listener();
  }
}

function clampQty(qty: number): number {
  return Math.min(Math.max(Math.trunc(qty), 0), MAX_LINE_QTY);
}

export function addToCart(productId: string, qty = 1): void {
  const current = getSnapshot();
  const existing = current.find((line) => line.productId === productId);
  if (!existing) {
    setLines([...current, { productId, qty: clampQty(qty) || 1 }]);
    return;
  }
  setLines(
    current.map((line) => (line.productId === productId ? { ...line, qty: clampQty(line.qty + qty) || 1 } : line)),
  );
}

/** A quantity below 1 removes the line. */
export function setCartQty(productId: string, qty: number): void {
  const next = clampQty(qty);
  const current = getSnapshot();
  setLines(
    next === 0
      ? current.filter((line) => line.productId !== productId)
      : current.map((line) => (line.productId === productId ? { ...line, qty: next } : line)),
  );
}

export function removeFromCart(productId: string): void {
  setLines(getSnapshot().filter((line) => line.productId !== productId));
}

export function clearCart(): void {
  setLines(EMPTY_LINES);
}

/** The cart keeps only productId and qty; names and prices come from the API. */
export function useCartLines(): readonly CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCount(): number {
  return useCartLines().reduce((sum, line) => sum + line.qty, 0);
}
