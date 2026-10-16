import type { Category } from '../model/types';

/** Rows from `start` that belong to the category at `start`: itself and the subcategories right after it. */
function getBlockEnd(rows: readonly Category[], start: number): number {
  let end = start + 1;
  while (end < rows.length && rows[end].depth > rows[start].depth) {
    end += 1;
  }
  return end;
}

/**
 * Shows a move before the API answers: the category (with its subcategories) takes the place of
 * `overId` in the loaded page, as the API will do with the whole list.
 */
export function moveInPage(rows: readonly Category[], activeId: string, overId: string): Category[] {
  const from = rows.findIndex((row) => row.id === activeId);
  const to = rows.findIndex((row) => row.id === overId);
  if (from < 0 || to < 0) {
    return [...rows];
  }
  const block = rows.slice(from, getBlockEnd(rows, from));
  const rest = [...rows.slice(0, from), ...rows.slice(getBlockEnd(rows, from))];
  const overIndex = rest.findIndex((row) => row.id === overId);
  const insertAt = from < to ? getBlockEnd(rest, overIndex) : overIndex;
  return [...rest.slice(0, insertAt), ...block, ...rest.slice(insertAt)];
}
