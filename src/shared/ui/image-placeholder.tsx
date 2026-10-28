import { FileText, Layers, LayoutGrid, Newspaper, Package, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export type ImagePlaceholderKind = 'product' | 'category' | 'collection' | 'article' | 'news';

const KIND_ICONS: Record<ImagePlaceholderKind, LucideIcon> = {
  product: Package,
  category: LayoutGrid,
  collection: Layers,
  article: FileText,
  news: Newspaper,
};

interface ImagePlaceholderProps {
  kind: ImagePlaceholderKind;
  /** Replaces the icon of the kind, for example an open or closed folder. */
  icon?: LucideIcon;
  /** Size, shape and colours of the box; it fills nothing by itself. */
  className?: string;
  iconClassName?: string;
}

/** Stand-in for the photo of a product, category, collection, article or news item that has none yet. */
export function ImagePlaceholder({ kind, icon, className, iconClassName }: ImagePlaceholderProps) {
  const Icon = icon ?? KIND_ICONS[kind];
  return (
    <span
      aria-hidden
      className={cn('flex shrink-0 items-center justify-center bg-muted text-muted-foreground', className)}
    >
      <Icon strokeWidth={1.5} className={cn('size-1/2', iconClassName)} />
    </span>
  );
}
