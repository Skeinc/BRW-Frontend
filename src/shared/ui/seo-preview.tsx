import { useTranslation } from 'react-i18next';
import { getRuntimeConfig } from '@/shared/config';
import { cn } from '@/shared/lib/utils';

interface CharCounterProps {
  value: string;
  max: number;
}

/** `42 / 120`, turns red near and over the limit. */
export function CharCounter({ value, max }: CharCounterProps) {
  const length = value.length;
  return (
    <span
      className={cn(
        'text-xs tabular-nums text-muted-foreground',
        length > max * 0.9 && 'text-amber-600',
        length > max && 'text-destructive',
      )}
    >
      {length} / {max}
    </span>
  );
}

interface SeoPreviewProps {
  title: string;
  description: string;
}

/** How a page may look in a search result: a visual hint for the title and description fields. */
export function SeoPreview({ title, description }: SeoPreviewProps) {
  const { t } = useTranslation();
  const host = new URL(getRuntimeConfig().siteUrl).host;
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3">
      <p className="text-xs font-medium text-muted-foreground">{t('ui.editor.seoPreview')}</p>
      <p className="truncate text-xs text-emerald-700">{host}</p>
      <p className="truncate text-base leading-snug text-blue-700">{title || t('ui.editor.seoPreviewTitle')}</p>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {description || t('ui.editor.seoPreviewDescription')}
      </p>
    </div>
  );
}
