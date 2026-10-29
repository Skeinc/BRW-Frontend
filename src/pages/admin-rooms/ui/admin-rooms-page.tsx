import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { roomsPageQueryOptions, useMoveRoom, type Room } from '@/entities/room';
import { EntityGallery } from '@/features/entity-gallery';
import { RoomFormDialog } from '@/features/upsert-room';
import { getApiErrorMessage } from '@/shared/api';
import { useLinkedEntity } from '@/shared/lib/use-linked-entity';
import { toRoomListParams, type RoomsSearch } from '../model/rooms-search';
import { RoomsTable } from './rooms-table';
import { RoomsToolbar } from './rooms-toolbar';
import { DeleteRoomDialog } from './delete-room-dialog';

const MAX_PAGE_SIZE = 100;

/** `'new'` opens the create form; a room opens its edit form. */
type EditorTarget = Room | 'new' | null;

interface AdminRoomsPageProps {
  search: RoomsSearch;
  onSearchChange: (patch: Partial<RoomsSearch>) => void;
}

export function AdminRoomsPage({ search, onSearchChange }: AdminRoomsPageProps) {
  const { t } = useTranslation();
  const params = toRoomListParams(search);
  const pageQuery = roomsPageQueryOptions(params);
  const roomsQuery = useQuery({ ...pageQuery, placeholderData: keepPreviousData });
  const move = useMoveRoom(pageQuery.queryKey);
  const [editor, setEditor] = useState<EditorTarget>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const rows = roomsQuery.data?.items ?? [];
  const total = roomsQuery.data?.total ?? 0;
  const editedRoom = editor === 'new' ? null : editor;

  const linkedQuery = useQuery({
    ...roomsPageQueryOptions({ page: 1, pageSize: MAX_PAGE_SIZE }),
    enabled: Boolean(search.edit),
  });
  useLinkedEntity({
    id: search.edit,
    items: linkedQuery.data?.items,
    isError: linkedQuery.isError,
    onFound: setEditor,
    onMissing: () => toast.error(t('admin.common.linkedNotFound')),
    onHandled: () => onSearchChange({ edit: undefined }),
  });

  /** After the last row of a page is deleted or filtered out, step back to the last page that still has rows. */
  useEffect(() => {
    if (roomsQuery.isSuccess && !roomsQuery.isPlaceholderData && rows.length === 0 && total > 0) {
      onSearchChange({ page: Math.max(1, Math.ceil(total / params.pageSize)) });
    }
  }, [roomsQuery.isSuccess, roomsQuery.isPlaceholderData, rows.length, total, params.pageSize, onSearchChange]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <RoomsToolbar onCreate={() => setEditor('new')} />
      <RoomsTable
        rows={rows}
        total={total}
        isPending={roomsQuery.isPending}
        isRefreshing={roomsQuery.isFetching && !roomsQuery.isPending}
        error={roomsQuery.error}
        page={params.page}
        pageSize={params.pageSize}
        onPageChange={(nextPage) => onSearchChange({ page: nextPage })}
        onPageSizeChange={(nextSize) => onSearchChange({ pageSize: nextSize, page: undefined })}
        onReorder={(id, overId) =>
          move.mutate({ id, overId }, { onError: (error) => toast.error(getApiErrorMessage(error, t)) })
        }
        onCreate={() => setEditor('new')}
        onEdit={setEditor}
        onDelete={setRoomToDelete}
      />
      {editor !== null ? (
        <RoomFormDialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditor(null);
            }
          }}
          room={editedRoom}
          onSaved={(saved, wasCreated) => setEditor(wasCreated ? saved : null)}
          gallery={editedRoom ? <EntityGallery owner="rooms" ownerId={editedRoom.id} single hideTitle /> : undefined}
        />
      ) : null}
      <DeleteRoomDialog room={roomToDelete} onClose={() => setRoomToDelete(null)} />
    </div>
  );
}
