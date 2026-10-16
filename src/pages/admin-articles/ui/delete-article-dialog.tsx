import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { articlesQueryKey, deleteArticle, type ArticleListItem } from '@/entities/article';
import { getApiErrorMessage } from '@/shared/api';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

interface DeleteArticleDialogProps {
  /** The article to delete; the dialog is open while it is set. */
  article: ArticleListItem | null;
  onClose: () => void;
}

export function DeleteArticleDialog({ article, onClose }: DeleteArticleDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (target: ArticleListItem) => deleteArticle(target.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: articlesQueryKey });
      toast.success(t('admin.articles.deleted'));
      onClose();
    },
  });

  return (
    <ConfirmDialog
      open={article !== null}
      onOpenChange={(open) => {
        if (!open) {
          remove.reset();
          onClose();
        }
      }}
      title={t('admin.articles.deleteTitle')}
      description={t('admin.articles.deleteDescription', { name: article?.title ?? '' })}
      confirmLabel={t('admin.common.delete')}
      cancelLabel={t('admin.common.cancel')}
      isPending={remove.isPending}
      error={remove.isError ? getApiErrorMessage(remove.error, t) : null}
      onConfirm={() => {
        if (article) {
          remove.mutate(article);
        }
      }}
    />
  );
}
