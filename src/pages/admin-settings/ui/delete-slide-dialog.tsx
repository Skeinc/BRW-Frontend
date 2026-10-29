import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { deleteSlide, slidesQueryKey, type Slide } from '@/entities/slide';
import { getApiErrorMessage } from '@/shared/api';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

interface DeleteSlideDialogProps {
  /** The slide to delete; the dialog is open while it is set. */
  slide: Slide | null;
  onClose: () => void;
}

export function DeleteSlideDialog({ slide, onClose }: DeleteSlideDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (target: Slide) => deleteSlide(target.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: slidesQueryKey });
      toast.success(t('admin.slides.deleted'));
      onClose();
    },
  });

  return (
    <ConfirmDialog
      open={slide !== null}
      onOpenChange={(open) => {
        if (!open) {
          remove.reset();
          onClose();
        }
      }}
      title={t('admin.slides.deleteTitle')}
      description={t('admin.slides.deleteDescription', { name: slide?.alt ?? '' })}
      confirmLabel={t('admin.common.delete')}
      cancelLabel={t('admin.common.cancel')}
      isPending={remove.isPending}
      error={remove.isError ? getApiErrorMessage(remove.error, t) : null}
      onConfirm={() => {
        if (slide) {
          remove.mutate(slide);
        }
      }}
    />
  );
}
