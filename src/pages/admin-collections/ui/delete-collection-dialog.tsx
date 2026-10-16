import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { collectionsQueryKey, deleteCollection, type Collection } from '@/entities/collection';
import { getApiErrorMessage } from '@/shared/api';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

interface DeleteCollectionDialogProps {
  /** The collection to delete; the dialog is open while it is set. */
  collection: Collection | null;
  onClose: () => void;
}

export function DeleteCollectionDialog({ collection, onClose }: DeleteCollectionDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (target: Collection) => deleteCollection(target.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: collectionsQueryKey });
      toast.success(t('admin.collections.deleted'));
      onClose();
    },
  });

  return (
    <ConfirmDialog
      open={collection !== null}
      onOpenChange={(open) => {
        if (!open) {
          remove.reset();
          onClose();
        }
      }}
      title={t('admin.collections.deleteTitle')}
      description={t('admin.collections.deleteDescription', { name: collection?.name ?? '' })}
      confirmLabel={t('admin.common.delete')}
      cancelLabel={t('admin.common.cancel')}
      isPending={remove.isPending}
      error={remove.isError ? getApiErrorMessage(remove.error, t) : null}
      onConfirm={() => {
        if (collection) {
          remove.mutate(collection);
        }
      }}
    />
  );
}
