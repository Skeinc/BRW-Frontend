import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { roomsQueryKey, deleteRoom, type Room } from '@/entities/room';
import { getApiErrorMessage } from '@/shared/api';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

interface DeleteRoomDialogProps {
  /** The room to delete; the dialog is open while it is set. */
  room: Room | null;
  onClose: () => void;
}

export function DeleteRoomDialog({ room, onClose }: DeleteRoomDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (target: Room) => deleteRoom(target.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: roomsQueryKey });
      toast.success(t('admin.rooms.deleted'));
      onClose();
    },
  });

  return (
    <ConfirmDialog
      open={room !== null}
      onOpenChange={(open) => {
        if (!open) {
          remove.reset();
          onClose();
        }
      }}
      title={t('admin.rooms.deleteTitle')}
      description={t('admin.rooms.deleteDescription', { name: room?.name ?? '' })}
      confirmLabel={t('admin.common.delete')}
      cancelLabel={t('admin.common.cancel')}
      isPending={remove.isPending}
      error={remove.isError ? getApiErrorMessage(remove.error, t) : null}
      onConfirm={() => {
        if (room) {
          remove.mutate(room);
        }
      }}
    />
  );
}
