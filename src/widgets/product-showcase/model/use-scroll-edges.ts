import { useCallback, useEffect, useState, type RefObject } from 'react';

interface ScrollEdges {
  canScrollBack: boolean;
  canScrollForward: boolean;
}

const EDGE_TOLERANCE_PX = 2;

/**
 * Tracks whether a horizontally scrolling list has more content on either side. Reads the DOM only in effects.
 * `isListMounted` must turn true once the list is rendered, because the list can appear after the first render.
 */
export function useScrollEdges(ref: RefObject<HTMLElement | null>, isListMounted: boolean): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>({ canScrollBack: false, canScrollForward: false });
  const update = useCallback(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const maxScroll = element.scrollWidth - element.clientWidth;
    const next: ScrollEdges = {
      canScrollBack: element.scrollLeft > EDGE_TOLERANCE_PX,
      canScrollForward: element.scrollLeft < maxScroll - EDGE_TOLERANCE_PX,
    };
    setEdges((previous) =>
      previous.canScrollBack === next.canScrollBack && previous.canScrollForward === next.canScrollForward
        ? previous
        : next,
    );
  }, [ref]);
  useEffect(() => {
    const element = ref.current;
    if (!element || !isListMounted) {
      return;
    }
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [ref, update, isListMounted]);
  return edges;
}
