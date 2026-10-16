import { MAX_CATEGORY_DEPTH, type Category } from '../model/types';

/** Ids of every category below `categoryId`, at any depth. */
export function getDescendantIds(categories: readonly Category[], categoryId: string): Set<string> {
  const descendants = new Set<string>();
  const queue = [categoryId];
  while (queue.length > 0) {
    const parentId = queue.pop();
    for (const category of categories) {
      if (category.parentId === parentId && !descendants.has(category.id)) {
        descendants.add(category.id);
        queue.push(category.id);
      }
    }
  }
  return descendants;
}

/** Number of levels in the subtree rooted at `categoryId`, counting the category itself. */
function getSubtreeHeight(categories: readonly Category[], categoryId: string): number {
  const children = categories.filter((category) => category.parentId === categoryId);
  return 1 + Math.max(0, ...children.map((child) => getSubtreeHeight(categories, child.id)));
}

/**
 * Categories that can be picked as the parent: the tree stays within three levels, and a category
 * can not become a child of itself or of its own descendants.
 */
export function getParentOptions(categories: readonly Category[], editing: Category | null): Category[] {
  const excluded = editing ? getDescendantIds(categories, editing.id) : new Set<string>();
  const subtreeHeight = editing ? getSubtreeHeight(categories, editing.id) : 1;
  return categories.filter(
    (category) =>
      category.id !== editing?.id && !excluded.has(category.id) && category.depth + subtreeHeight <= MAX_CATEGORY_DEPTH,
  );
}
