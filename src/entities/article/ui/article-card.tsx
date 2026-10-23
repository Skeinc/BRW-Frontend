import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/shared/lib/format-date';
import { ImagePlaceholder } from '@/shared/ui/image-placeholder';
import type { CatalogArticleCard } from '../model/catalog-types';

interface ArticleCardProps {
  article: CatalogArticleCard;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { i18n } = useTranslation();
  const { id, title, excerpt, publishedAt, coverImage } = article;
  return (
    <Link
      to="/articles/$articleId"
      params={{ articleId: id }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40"
    >
      <div className="aspect-3/2 overflow-hidden bg-muted">
        {coverImage ? (
          <img
            src={coverImage.thumbUrl}
            alt={coverImage.alt ?? title}
            width={coverImage.width}
            height={coverImage.height}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder kind="article" className="size-full" iconClassName="size-1/4" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {publishedAt && (
          <time dateTime={publishedAt} className="text-xs text-muted-foreground">
            {formatDate(publishedAt, i18n.language)}
          </time>
        )}
        <h2 className="line-clamp-2 font-semibold group-hover:text-primary">{title}</h2>
        {excerpt && <p className="line-clamp-3 text-sm text-muted-foreground">{excerpt}</p>}
      </div>
    </Link>
  );
}
