import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { catalogProductsQueryOptions, type CatalogProductCard, type CatalogProductsParams } from '@/entities/product';

interface LoadMoreState {
  items: CatalogProductCard[];
  lastPage: number;
  isLoading: boolean;
  isError: boolean;
}

/** Products appended under the first page of the list. Mount it with a `key` of the params to start over. */
export function useLoadMore(params: CatalogProductsParams) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<LoadMoreState>({
    items: [],
    lastPage: params.page ?? 1,
    isLoading: false,
    isError: false,
  });

  const loadMore = async (): Promise<void> => {
    const nextPage = state.lastPage + 1;
    setState((current) => ({ ...current, isLoading: true, isError: false }));
    try {
      const result = await queryClient.fetchQuery(catalogProductsQueryOptions({ ...params, page: nextPage }));
      setState((current) => ({
        items: [...current.items, ...result.items],
        lastPage: nextPage,
        isLoading: false,
        isError: false,
      }));
    } catch {
      setState((current) => ({ ...current, isLoading: false, isError: true }));
    }
  };

  return { ...state, loadMore };
}
