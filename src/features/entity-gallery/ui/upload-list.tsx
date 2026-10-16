import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import type { UploadItem } from '../model/use-upload-queue';

interface UploadListProps {
  items: UploadItem[];
  onDismiss: (id: string) => void;
}

export function UploadList({ items, onDismiss }: UploadListProps) {
  const { t } = useTranslation();
  if (items.length === 0) {
    return null;
  }
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 rounded-md border p-2 text-sm">
          <div className="min-w-0 flex-1">
            <p className="truncate">{item.name}</p>
            {item.error ? (
              <p role="alert" className="text-xs text-destructive">
                {item.error}
              </p>
            ) : (
              <div
                role="progressbar"
                aria-valuenow={item.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t('admin.gallery.uploading', { name: item.name })}
                className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div className="h-full bg-primary transition-[width]" style={{ width: `${item.progress}%` }} />
              </div>
            )}
          </div>
          {item.error ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11"
              aria-label={t('admin.gallery.dismiss')}
              onClick={() => onDismiss(item.id)}
            >
              <X aria-hidden />
            </Button>
          ) : (
            <span className="tabular-nums text-xs text-muted-foreground">{item.progress}%</span>
          )}
        </li>
      ))}
    </ul>
  );
}
