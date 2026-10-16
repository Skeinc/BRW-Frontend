import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import { Switch } from './switch';

interface PublishCardProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** What "published" means for this record, for example "The product is visible in the catalog". */
  publishedText: string;
  draftText: string;
}

/** The publication switch as a clear card: the state and its meaning in words. */
export function PublishCard({ id, checked, onCheckedChange, publishedText, draftText }: PublishCardProps) {
  const { t } = useTranslation();
  const Icon = checked ? Eye : EyeOff;
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors',
        checked ? 'border-emerald-200 bg-emerald-50' : 'bg-muted/40',
      )}
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          checked ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground',
        )}
        aria-hidden
      >
        <Icon className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium">{t(checked ? 'ui.editor.published' : 'ui.editor.draft')}</span>
        <span className="text-sm text-muted-foreground">{checked ? publishedText : draftText}</span>
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
