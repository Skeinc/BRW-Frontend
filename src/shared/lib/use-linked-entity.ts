import { useEffect, useRef } from 'react';

interface UseLinkedEntityParams<T extends { id: string }> {
  /** The id from the `edit` URL param, or undefined when the screen was not opened by a link. */
  id: string | undefined;
  /** The loaded records to look the id up in; undefined until the query is done. */
  items: readonly T[] | undefined;
  isError: boolean;
  onFound: (item: T) => void;
  onMissing: () => void;
  /** Drops the id from the URL once it has been handled. */
  onHandled: () => void;
}

/** Opens the record a link from another screen points to, once, and reports when it can't be found. */
export function useLinkedEntity<T extends { id: string }>({
  id,
  items,
  isError,
  onFound,
  onMissing,
  onHandled,
}: UseLinkedEntityParams<T>): void {
  const callbacks = useRef({ onFound, onMissing, onHandled });
  useEffect(() => {
    callbacks.current = { onFound, onMissing, onHandled };
  });

  useEffect(() => {
    if (!id || (!items && !isError)) {
      return;
    }
    const item = items?.find((candidate) => candidate.id === id);
    if (item) {
      callbacks.current.onFound(item);
    } else {
      callbacks.current.onMissing();
    }
    callbacks.current.onHandled();
  }, [id, items, isError]);
}
