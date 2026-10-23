import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CatalogProductImage } from '@/entities/product';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';

interface ProductGalleryProps {
  name: string;
  images: readonly CatalogProductImage[];
  /** Badges laid over the main photo. */
  overlay?: React.ReactNode;
}

export function ProductGallery({ name, images, overlay }: ProductGalleryProps) {
  const { t } = useTranslation();
  const scroller = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted">
        <ImagePlaceholder kind="product" className="size-full" iconClassName="size-1/4" />
        {overlay}
      </div>
    );
  }

  const goTo = (target: number): void => {
    const node = scroller.current;
    if (!node) {
      return;
    }
    const next = (target + images.length) % images.length;
    node.scrollTo({ left: next * node.clientWidth, behavior: 'smooth' });
    setIndex(next);
  };
  const handleScroll = (): void => {
    const node = scroller.current;
    if (node && node.clientWidth > 0) {
      setIndex(Math.round(node.scrollLeft / node.clientWidth));
    }
  };
  const current = images[index] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <ul
          ref={scroller}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, position) => (
            <li key={image.id} className="aspect-4/3 w-full shrink-0 snap-center">
              <button
                type="button"
                aria-label={t('product.gallery.zoom')}
                onClick={() => setIsZoomed(true)}
                className="block size-full cursor-zoom-in"
              >
                <img
                  src={image.url}
                  srcSet={`${image.thumbUrl} 480w, ${image.url} 1600w`}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  alt={image.alt ?? name}
                  width={image.width}
                  height={image.height}
                  loading={position === 0 ? undefined : 'lazy'}
                  fetchPriority={position === 0 ? 'high' : undefined}
                  className="size-full object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
        {overlay}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              aria-label={t('product.gallery.previous')}
              className="absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 rounded-full bg-card sm:inline-flex"
              onClick={() => goTo(index - 1)}
            >
              <ChevronLeft aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={t('product.gallery.next')}
              className="absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 rounded-full bg-card sm:inline-flex"
              onClick={() => goTo(index + 1)}
            >
              <ChevronRight aria-hidden />
            </Button>
          </>
        )}
        <span className="tabular-price pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs">
          <ZoomIn aria-hidden className="size-3" />
          {`${index + 1}/${images.length}`}
        </span>
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2">
          {images.map((image, position) => (
            <li key={image.id}>
              <button
                type="button"
                aria-label={t('product.gallery.show', { index: position + 1 })}
                aria-current={position === index}
                onClick={() => goTo(position)}
                className={cn(
                  'block aspect-square w-full overflow-hidden rounded-xl border-2 bg-muted',
                  position === index ? 'border-primary' : 'border-transparent hover:border-border',
                )}
              >
                <img
                  src={image.thumbUrl}
                  alt=""
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  className="size-full object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-[min(96vw,64rem)] p-2 sm:max-w-5xl">
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <DialogDescription className="sr-only">{t('product.gallery.zoomDescription')}</DialogDescription>
          <img
            src={current?.url}
            alt={current?.alt ?? name}
            width={current?.width}
            height={current?.height}
            className="max-h-[85vh] w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
