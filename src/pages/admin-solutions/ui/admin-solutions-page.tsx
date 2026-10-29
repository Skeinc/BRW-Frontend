import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { solutionsPageQueryOptions, type Solution } from '@/entities/solution';
import { EntityGallery } from '@/features/entity-gallery';
import { SolutionFormDialog } from '@/features/upsert-solution';
import { useLinkedEntity } from '@/shared/lib/use-linked-entity';
import { hasSolutionFilters, toSolutionListParams, type SolutionsSearch } from '../model/solutions-search';
import { DeleteSolutionDialog } from './delete-solution-dialog';
import { SolutionsTable } from './solutions-table';
import { SolutionsToolbar } from './solutions-toolbar';

const MAX_PAGE_SIZE = 100;

/** `'new'` opens the create form; a solution opens its edit form. */
type EditorTarget = Solution | 'new' | null;

interface AdminSolutionsPageProps {
  search: SolutionsSearch;
  onSearchChange: (patch: Partial<SolutionsSearch>) => void;
}

export function AdminSolutionsPage({ search, onSearchChange }: AdminSolutionsPageProps) {
  const { t } = useTranslation();
  const params = toSolutionListParams(search);
  const solutionsQuery = useQuery({ ...solutionsPageQueryOptions(params), placeholderData: keepPreviousData });
  const [editor, setEditor] = useState<EditorTarget>(null);
  const [solutionToDelete, setSolutionToDelete] = useState<Solution | null>(null);

  const rows = solutionsQuery.data?.items ?? [];
  const total = solutionsQuery.data?.total ?? 0;
  const isFiltered = hasSolutionFilters(search);
  const editedSolution = editor === 'new' ? null : editor;

  const linkedQuery = useQuery({
    ...solutionsPageQueryOptions({ page: 1, pageSize: MAX_PAGE_SIZE }),
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
    if (solutionsQuery.isSuccess && !solutionsQuery.isPlaceholderData && rows.length === 0 && total > 0) {
      onSearchChange({ page: Math.max(1, Math.ceil(total / params.pageSize)) });
    }
  }, [solutionsQuery.isSuccess, solutionsQuery.isPlaceholderData, rows.length, total, params.pageSize, onSearchChange]);

  /** Any filter change goes back to the first page. */
  const changeFilter = (patch: Partial<SolutionsSearch>) => onSearchChange({ ...patch, page: undefined });

  const resetFilters = () => changeFilter({ q: undefined, room: undefined, collection: undefined });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <SolutionsToolbar
        search={search}
        hasFilters={isFiltered}
        onChange={changeFilter}
        onReset={resetFilters}
        onCreate={() => setEditor('new')}
      />
      <SolutionsTable
        rows={rows}
        total={total}
        isFiltered={isFiltered}
        isPending={solutionsQuery.isPending}
        isRefreshing={solutionsQuery.isFetching && !solutionsQuery.isPending}
        error={solutionsQuery.error}
        page={params.page}
        pageSize={params.pageSize}
        onPageChange={(nextPage) => onSearchChange({ page: nextPage })}
        onPageSizeChange={(nextSize) => onSearchChange({ pageSize: nextSize, page: undefined })}
        onCreate={() => setEditor('new')}
        onResetFilters={resetFilters}
        onEdit={setEditor}
        onDelete={setSolutionToDelete}
      />
      {editor !== null ? (
        <SolutionFormDialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditor(null);
            }
          }}
          solution={editedSolution}
          presetRoomId={search.room}
          onSaved={(saved, wasCreated) => setEditor(wasCreated ? saved : null)}
          gallery={
            editedSolution ? (
              <EntityGallery owner="solutions" ownerId={editedSolution.id} single hideTitle />
            ) : undefined
          }
        />
      ) : null}
      <DeleteSolutionDialog solution={solutionToDelete} onClose={() => setSolutionToDelete(null)} />
    </div>
  );
}
