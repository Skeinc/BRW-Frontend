import { Link, type LinkComponentProps } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/shared/lib/format-date';
import { cn } from '@/shared/lib/utils';
import { ImagePlaceholder, type ImagePlaceholderKind } from './image-placeholder';

interface TeaserCardImage {
  url: string;
  thumbUrl: string;
  alt: string | null;
  width: number;
  height: number;
}

interface TeaserCardProps {
  title: string;
  publishedAt: string | null;
  coverImage: TeaserCardImage | null;
  placeholderKind: ImagePlaceholderKind;
  /** Typed link props of the page the card opens. */
  linkProps: LinkComponentProps;
  /** The large card of a block: the full-size photo and a bigger title. */
  isFeatured?: boolean;
}

/** Card of the home blocks (news, articles): photo, title, "Read" link and date. */
export function TeaserCard({
  title,
  publishedAt,
  coverImage,
  placeholderKind,
  linkProps,
  isFeatured = false,
}: TeaserCardProps) {
  const { t, i18n } = useTranslation();
  return (
    <Link
      {...linkProps}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40"
    >
      <div className={cn('overflow-hidden bg-muted', isFeatured ? 'aspect-2/1' : 'aspect-16/9')}>
        {coverImage ? (
          <img
            src={isFeatured ? coverImage.url : coverImage.thumbUrl}
            alt={coverImage.alt ?? title}
            width={coverImage.width}
            height={coverImage.height}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder kind={placeholderKind} className="size-full" iconClassName="size-1/6" />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <h3 className={cn('line-clamp-2 group-hover:text-primary', isFeatured ? 'text-lg font-semibold' : 'text-sm')}>
          {title}
        </h3>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            {t('ui.read')}
            <ArrowRight aria-hidden className="size-4" />
          </span>
          {publishedAt && (
            <time dateTime={publishedAt} className="text-xs text-muted-foreground">
              {formatDate(publishedAt, i18n.language)}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
