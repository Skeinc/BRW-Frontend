import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { deleteProduct, productsQueryKey, type ProductListItem } from '@/entities/product';
import { getApiErrorMessage } from '@/shared/api';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

interface DeleteProductDialogProps {
  /** The product to delete; the dialog is open while it is set. */
  product: ProductListItem | null;
  onClose: () => void;
}

export function DeleteProductDialog({ product, onClose }: DeleteProductDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (target: ProductListItem) => deleteProduct(target.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productsQueryKey });
      toast.success(t('admin.products.deleted'));
      onClose();
    },
  });

  return (
    <ConfirmDialog
      open={product !== null}
      onOpenChange={(open) => {
        if (!open) {
          remove.reset();
          onClose();
        }
      }}
      title={t('admin.products.deleteTitle')}
      description={t('admin.products.deleteDescription', { name: product?.name ?? '' })}
      confirmLabel={t('admin.common.delete')}
      cancelLabel={t('admin.common.cancel')}
      isPending={remove.isPending}
      error={remove.isError ? getApiErrorMessage(remove.error, t) : null}
      onConfirm={() => {
        if (product) {
          remove.mutate(product);
        }
      }}
    />
  );
}
