import { FileText, Layers, LayoutGrid, Package, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export type ImagePlaceholderKind = 'product' | 'category' | 'collection' | 'article';

const KIND_ICONS: Record<ImagePlaceholderKind, LucideIcon> = {
  product: Package,
  category: LayoutGrid,
  collection: Layers,
  article: FileText,
};

interface ImagePlaceholderProps {
  kind: ImagePlaceholderKind;
  /** Replaces the icon of the kind, for example an open or closed folder. */
  icon?: LucideIcon;
  /** Size, shape and colours of the box; it fills nothing by itself. */
  className?: string;
  iconClassName?: string;
}

/** Stand-in for the photo of a product, category, collection or article that has none yet. */
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
