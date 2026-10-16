import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { categoriesQueryKey, deleteCategory, type Category } from '@/entities/category';
import { getApiErrorMessage } from '@/shared/api';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

interface DeleteCategoryDialogProps {
  /** The category to delete; the dialog is open while it is set. */
  category: Category | null;
  onClose: () => void;
}

export function DeleteCategoryDialog({ category, onClose }: DeleteCategoryDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (target: Category) => deleteCategory(target.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
      toast.success(t('admin.categories.deleted'));
      onClose();
    },
  });

  return (
    <ConfirmDialog
      open={category !== null}
      onOpenChange={(open) => {
        if (!open) {
          remove.reset();
          onClose();
        }
      }}
      title={t('admin.categories.deleteTitle')}
      description={t('admin.categories.deleteDescription', { name: category?.name ?? '' })}
      confirmLabel={t('admin.common.delete')}
      cancelLabel={t('admin.common.cancel')}
      isPending={remove.isPending}
      error={remove.isError ? getApiErrorMessage(remove.error, t) : null}
      onConfirm={() => {
        if (category) {
          remove.mutate(category);
        }
      }}
    />
  );
}
