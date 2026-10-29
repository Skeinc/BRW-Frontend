import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { solutionsQueryKey, deleteSolution, type Solution } from '@/entities/solution';
import { getApiErrorMessage } from '@/shared/api';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

interface DeleteSolutionDialogProps {
  /** The solution to delete; the dialog is open while it is set. */
  solution: Solution | null;
  onClose: () => void;
}

export function DeleteSolutionDialog({ solution, onClose }: DeleteSolutionDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (target: Solution) => deleteSolution(target.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: solutionsQueryKey });
      toast.success(t('admin.solutions.deleted'));
      onClose();
    },
  });

  return (
    <ConfirmDialog
      open={solution !== null}
      onOpenChange={(open) => {
        if (!open) {
          remove.reset();
          onClose();
        }
      }}
      title={t('admin.solutions.deleteTitle')}
      description={t('admin.solutions.deleteDescription', { name: solution?.name ?? '' })}
      confirmLabel={t('admin.common.delete')}
      cancelLabel={t('admin.common.cancel')}
      isPending={remove.isPending}
      error={remove.isError ? getApiErrorMessage(remove.error, t) : null}
      onConfirm={() => {
        if (solution) {
          remove.mutate(solution);
        }
      }}
    />
  );
}
