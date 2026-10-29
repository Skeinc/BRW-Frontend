import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { slidesPageQueryOptions, useMoveSlide, type Slide } from '@/entities/slide';
import { EntityGallery } from '@/features/entity-gallery';
import { SlideFormDialog } from '@/features/upsert-slide';
import { getApiErrorMessage } from '@/shared/api';
import { useLinkedEntity } from '@/shared/lib/use-linked-entity';
import { toSlideListParams, type SettingsSearch } from '../model/settings-search';
import { DeleteSlideDialog } from './delete-slide-dialog';
import { SlidesTable } from './slides-table';
import { SlidesToolbar } from './slides-toolbar';

/** `'new'` opens the create form; a slide opens its edit form. */
type EditorTarget = Slide | 'new' | null;

interface SliderTabProps {
  search: SettingsSearch;
  onSearchChange: (patch: Partial<SettingsSearch>) => void;
}

export function SliderTab({ search, onSearchChange }: SliderTabProps) {
  const { t } = useTranslation();
  const params = toSlideListParams(search);
  const pageQuery = slidesPageQueryOptions(params);
  const slidesQuery = useQuery({ ...pageQuery, placeholderData: keepPreviousData });
  const move = useMoveSlide(pageQuery.queryKey);
  const [editor, setEditor] = useState<EditorTarget>(null);
  const [slideToDelete, setSlideToDelete] = useState<Slide | null>(null);

  const rows = slidesQuery.data?.items ?? [];
  const total = slidesQuery.data?.total ?? 0;
  const editedSlide = editor === 'new' ? null : editor;

  /** After the last row of a page is deleted, step back to the last page that still has rows. */
  useEffect(() => {
    if (slidesQuery.isSuccess && !slidesQuery.isPlaceholderData && rows.length === 0 && total > 0) {
      onSearchChange({ page: Math.max(1, Math.ceil(total / params.pageSize)) });
    }
  }, [slidesQuery.isSuccess, slidesQuery.isPlaceholderData, rows.length, total, params.pageSize, onSearchChange]);

  useLinkedEntity({
    id: search.edit,
    items: slidesQuery.data?.items,
    isError: slidesQuery.isError,
    onFound: setEditor,
    onMissing: () => toast.error(t('admin.common.linkedNotFound')),
    onHandled: () => onSearchChange({ edit: undefined }),
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <SlidesToolbar onCreate={() => setEditor('new')} />
      <SlidesTable
        rows={rows}
        total={total}
        isPending={slidesQuery.isPending}
        isRefreshing={slidesQuery.isFetching && !slidesQuery.isPending}
        error={slidesQuery.error}
        page={params.page}
        pageSize={params.pageSize}
        onPageChange={(nextPage) => onSearchChange({ page: nextPage })}
        onPageSizeChange={(nextSize) => onSearchChange({ pageSize: nextSize, page: undefined })}
        onReorder={(id, overId) =>
          move.mutate({ id, overId }, { onError: (error) => toast.error(getApiErrorMessage(error, t)) })
        }
        onCreate={() => setEditor('new')}
        onEdit={setEditor}
        onDelete={setSlideToDelete}
      />
      {editor !== null ? (
        <SlideFormDialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditor(null);
            }
          }}
          slide={editedSlide}
          onSaved={(saved, wasCreated) => setEditor(wasCreated ? saved : null)}
          gallery={editedSlide ? <EntityGallery owner="slides" ownerId={editedSlide.id} single hideTitle /> : undefined}
        />
      ) : null}
      <DeleteSlideDialog slide={slideToDelete} onClose={() => setSlideToDelete(null)} />
    </div>
  );
}
