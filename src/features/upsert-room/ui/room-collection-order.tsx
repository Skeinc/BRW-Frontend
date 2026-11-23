import { ArrowDown, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RoomLinkedCollection } from '@/entities/room';
import { Button } from '@/shared/ui/button';

interface RoomCollectionOrderProps {
  /** Collection ids in display order. */
  ids: string[];
  names: Map<string, string>;
  /** Solution counts of each collection in the room, as saved. */
  links: RoomLinkedCollection[];
  isConsultationOnly: boolean;
  onChange: (ids: string[]) => void;
}

/** Swaps the id at `index` with its neighbour `by` places away. */
function move(ids: readonly string[], index: number, by: number): string[] {
  const next = [...ids];
  [next[index], next[index + by]] = [next[index + by], next[index]];
  return next;
}

/** The collections of a room in display order, moved with arrows; a hidden one is marked. */
export function RoomCollectionOrder({ ids, names, links, isConsultationOnly, onChange }: RoomCollectionOrderProps) {
  const { t } = useTranslation();
  const publishedByCollection = new Map(links.map((link) => [link.collectionId, link.publishedSolutionCount]));
  const base = 'admin.rooms.collections';

  if (ids.length === 0) {
    return <p className="text-sm text-muted-foreground">{t(`${base}.none`)}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <ol className="flex flex-col divide-y rounded-lg border">
        {ids.map((id, index) => {
          const name = names.get(id) ?? '…';
          const isHidden = !isConsultationOnly && (publishedByCollection.get(id) ?? 0) === 0;
          return (
            <li key={id} className="flex items-center gap-2 px-3 py-2 text-sm">
              <span className="w-6 text-muted-foreground tabular-nums">{index + 1}</span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate">{name}</span>
                {isHidden && <span className="text-xs text-destructive">{t(`${base}.hidden`)}</span>}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === 0}
                aria-label={t(`${base}.moveUp`, { name })}
                onClick={() => onChange(move(ids, index, -1))}
              >
                <ArrowUp aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === ids.length - 1}
                aria-label={t(`${base}.moveDown`, { name })}
                onClick={() => onChange(move(ids, index, 1))}
              >
                <ArrowDown aria-hidden />
              </Button>
            </li>
          );
        })}
      </ol>
      <p className="text-sm text-muted-foreground">{t(`${base}.addHint`)}</p>
    </div>
  );
}
