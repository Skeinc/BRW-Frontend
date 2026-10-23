import { ChevronRight, Folder, FolderOpen, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Category } from '@/entities/category';
import { cn } from '@/shared/lib/utils';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface CategoryNameCellProps {
  category: Category;
  /** False under a search or filter: the list is flat, without guides or toggles. */
  isTree: boolean;
  isExpanded: boolean;
  onToggle: (category: Category) => void;
}

/** Name of a category in the tree: guide lines for the levels, a toggle for children, an icon and the child count. */
export function CategoryNameCell({ category, isTree, isExpanded, onToggle }: CategoryNameCellProps) {
  const { t } = useTranslation();
  const hasChildren = category.childCount > 0;
  const Icon = hasChildren ? (isExpanded ? FolderOpen : Folder) : Tag;

  return (
    <div className="flex h-12 items-center">
      {isTree
        ? Array.from({ length: category.depth - 1 }, (_, level) => (
            <span key={level} className="ml-3 h-full w-3 shrink-0 border-l border-border" aria-hidden />
          ))
        : null}
      {isTree ? (
        hasChildren ? (
          <button
            type="button"
            className="mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-expanded={isExpanded}
            aria-label={t(isExpanded ? 'admin.categories.collapse' : 'admin.categories.expand', {
              name: category.name,
            })}
            onClick={() => onToggle(category)}
          >
            <ChevronRight className={cn('size-4 transition-transform', isExpanded && 'rotate-90')} aria-hidden />
          </button>
        ) : (
          <span className="mr-1 size-7 shrink-0" aria-hidden />
        )
      ) : null}
      {category.cover ? (
        <img
          src={category.cover.thumbUrl}
          alt=""
          loading="lazy"
          className="mr-3 size-8 shrink-0 rounded object-cover"
        />
      ) : (
        <ImagePlaceholder
          kind="category"
          icon={Icon}
          className={cn('mr-3 size-8 rounded-md', hasChildren && 'bg-accent text-accent-foreground')}
        />
      )}
      <span className={cn('truncate', category.depth === 1 ? 'font-semibold' : 'font-medium')}>{category.name}</span>
      {hasChildren ? (
        <span className="ml-2 shrink-0 rounded-full bg-muted px-2 text-xs tabular-nums text-muted-foreground">
          {t('admin.categories.childCount', { count: category.childCount })}
        </span>
      ) : null}
    </div>
  );
}
