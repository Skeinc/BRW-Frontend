import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { newsQueryKey, deleteNewsItem, type NewsListItem } from '@/entities/news';
import { getApiErrorMessage } from '@/shared/api';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

interface DeleteNewsItemDialogProps {
  /** The news item to delete; the dialog is open while it is set. */
  newsItem: NewsListItem | null;
  onClose: () => void;
}

export function DeleteNewsItemDialog({ newsItem, onClose }: DeleteNewsItemDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (target: NewsListItem) => deleteNewsItem(target.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: newsQueryKey });
      toast.success(t('admin.news.deleted'));
      onClose();
    },
  });

  return (
    <ConfirmDialog
      open={newsItem !== null}
      onOpenChange={(open) => {
        if (!open) {
          remove.reset();
          onClose();
        }
      }}
      title={t('admin.news.deleteTitle')}
      description={t('admin.news.deleteDescription', { name: newsItem?.title ?? '' })}
      confirmLabel={t('admin.common.delete')}
      cancelLabel={t('admin.common.cancel')}
      isPending={remove.isPending}
      error={remove.isError ? getApiErrorMessage(remove.error, t) : null}
      onConfirm={() => {
        if (newsItem) {
          remove.mutate(newsItem);
        }
      }}
    />
  );
}
