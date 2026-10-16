import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { collectionsPageQueryOptions, useMoveCollection, type Collection } from '@/entities/collection';
import { EntityGallery } from '@/features/entity-gallery';
import { CollectionFormDialog } from '@/features/upsert-collection';
import { getApiErrorMessage } from '@/shared/api';
import { hasCollectionFilters, toCollectionListParams, type CollectionsSearch } from '../model/collections-search';
import { CollectionsTable } from './collections-table';
import { CollectionsToolbar } from './collections-toolbar';
import { DeleteCollectionDialog } from './delete-collection-dialog';

/** `'new'` opens the create form; a collection opens its edit form. */
type EditorTarget = Collection | 'new' | null;

interface AdminCollectionsPageProps {
  search: CollectionsSearch;
  onSearchChange: (patch: Partial<CollectionsSearch>) => void;
}

export function AdminCollectionsPage({ search, onSearchChange }: AdminCollectionsPageProps) {
  const { t } = useTranslation();
  const params = toCollectionListParams(search);
  const pageQuery = collectionsPageQueryOptions(params);
  const collectionsQuery = useQuery({ ...pageQuery, placeholderData: keepPreviousData });
  const move = useMoveCollection(pageQuery.queryKey);
  const [editor, setEditor] = useState<EditorTarget>(null);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);

  const rows = collectionsQuery.data?.items ?? [];
  const total = collectionsQuery.data?.total ?? 0;
  const isFiltered = hasCollectionFilters(search);
  const editedCollection = editor === 'new' ? null : editor;

  /** After the last row of a page is deleted or filtered out, step back to the last page that still has rows. */
  useEffect(() => {
    if (collectionsQuery.isSuccess && !collectionsQuery.isPlaceholderData && rows.length === 0 && total > 0) {
      onSearchChange({ page: Math.max(1, Math.ceil(total / params.pageSize)) });
    }
  }, [
    collectionsQuery.isSuccess,
    collectionsQuery.isPlaceholderData,
    rows.length,
    total,
    params.pageSize,
    onSearchChange,
  ]);

  /** Any filter change goes back to the first page. */
  const changeFilter = (patch: Partial<CollectionsSearch>) => onSearchChange({ ...patch, page: undefined });

  const resetFilters = () => changeFilter({ q: undefined, published: undefined, contents: undefined });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <CollectionsToolbar
        search={search}
        hasFilters={isFiltered}
        onChange={changeFilter}
        onReset={resetFilters}
        onCreate={() => setEditor('new')}
      />
      <CollectionsTable
        rows={rows}
        total={total}
        isFiltered={isFiltered}
        isPending={collectionsQuery.isPending}
        isRefreshing={collectionsQuery.isFetching && !collectionsQuery.isPending}
        error={collectionsQuery.error}
        page={params.page}
        pageSize={params.pageSize}
        onPageChange={(nextPage) => onSearchChange({ page: nextPage })}
        onPageSizeChange={(nextSize) => onSearchChange({ pageSize: nextSize, page: undefined })}
        onReorder={(id, overId) =>
          move.mutate({ id, overId }, { onError: (error) => toast.error(getApiErrorMessage(error, t)) })
        }
        onCreate={() => setEditor('new')}
        onResetFilters={resetFilters}
        onEdit={setEditor}
        onDelete={setCollectionToDelete}
      />
      {editor !== null ? (
        <CollectionFormDialog
          open
          onOpenChange={(open) => {
            if (!open) {
              setEditor(null);
            }
          }}
          collection={editedCollection}
          onSaved={(saved, wasCreated) => setEditor(wasCreated ? saved : null)}
          gallery={
            editedCollection ? (
              <EntityGallery owner="collections" ownerId={editedCollection.id} single hideTitle />
            ) : undefined
          }
        />
      ) : null}
      <DeleteCollectionDialog collection={collectionToDelete} onClose={() => setCollectionToDelete(null)} />
    </div>
  );
}
