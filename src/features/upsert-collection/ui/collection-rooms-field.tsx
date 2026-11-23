import { useQuery } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { CollectionLinkedRoom } from '@/entities/collection';
import { roomOptionsQueryOptions, type RoomOption } from '@/entities/room';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';
import { DisabledWithTooltip } from '@/shared/ui/disabled-with-tooltip';
import type { CollectionFormValues } from '../model/collection-form-schema';

interface CollectionRoomsFieldProps {
  /** Rooms the saved collection is shown in, with its solution counts there; empty for a new collection. */
  links: CollectionLinkedRoom[];
}

const base = 'admin.collections.rooms';

/** Ticks the rooms that show the collection. A room that has its solutions cannot be unticked. */
export function CollectionRoomsField({ links }: CollectionRoomsFieldProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<CollectionFormValues>();
  const rooms = useQuery(roomOptionsQueryOptions);
  const linkByRoom = new Map(links.map((link) => [link.roomId, link]));

  if (rooms.isPending) {
    return <p className="text-sm text-muted-foreground">{t(`${base}.loading`)}</p>;
  }
  if (!rooms.data?.length) {
    return <p className="text-sm text-muted-foreground">{t(`${base}.empty`)}</p>;
  }

  return (
    <Controller
      control={control}
      name="roomIds"
      render={({ field }) => {
        const chosen: string[] = field.value;
        const toggle = (roomId: string, isChecked: boolean) =>
          field.onChange(isChecked ? [...chosen, roomId] : chosen.filter((id) => id !== roomId));
        return (
          <ul className="flex flex-col divide-y rounded-lg border">
            {rooms.data.map((room) => (
              <CollectionRoomRow
                key={room.id}
                room={room}
                link={linkByRoom.get(room.id)}
                isChecked={chosen.includes(room.id)}
                onCheckedChange={(isChecked) => toggle(room.id, isChecked)}
              />
            ))}
          </ul>
        );
      }}
    />
  );
}

interface CollectionRoomRowProps {
  room: RoomOption;
  link: CollectionLinkedRoom | undefined;
  isChecked: boolean;
  onCheckedChange: (isChecked: boolean) => void;
}

function CollectionRoomRow({ room, link, isChecked, onCheckedChange }: CollectionRoomRowProps) {
  const { t } = useTranslation();
  const solutionCount = link?.solutionCount ?? 0;
  const isLocked = isChecked && solutionCount > 0;
  const checkboxId = `collection-room-${room.id}`;
  const status = describeStatus({ room, link, isChecked, t });

  return (
    <li className="flex items-start gap-3 px-3 py-3">
      <DisabledWithTooltip reason={isLocked ? t(`${base}.locked`, { count: solutionCount }) : undefined}>
        <Checkbox
          id={checkboxId}
          className="mt-0.5"
          checked={isChecked}
          disabled={isLocked}
          onCheckedChange={(next) => onCheckedChange(next === true)}
        />
      </DisabledWithTooltip>
      <label htmlFor={checkboxId} className={cn('flex min-w-0 flex-1 flex-col gap-1', !isLocked && 'cursor-pointer')}>
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{room.name}</span>
          <Badge variant="secondary">{t(room.isConsultationOnly ? `${base}.consultation` : `${base}.solutions`)}</Badge>
        </span>
        {status && (
          <span className={cn('text-sm', status.isWarning ? 'text-destructive' : 'text-muted-foreground')}>
            {status.text}
          </span>
        )}
      </label>
    </li>
  );
}

/** What the visitor will see of the collection in the room once the form is saved. */
function describeStatus({
  room,
  link,
  isChecked,
  t,
}: {
  room: RoomOption;
  link: CollectionLinkedRoom | undefined;
  isChecked: boolean;
  t: TFunction;
}): { text: string; isWarning: boolean } | null {
  if (!isChecked) {
    return null;
  }
  if (room.isConsultationOnly) {
    return { text: t(`${base}.consultationShown`), isWarning: false };
  }
  const published = link?.publishedSolutionCount ?? 0;
  if (published > 0) {
    return { text: t(`${base}.solutionsShown`, { count: published }), isWarning: false };
  }
  return { text: t(`${base}.noSolutions`), isWarning: true };
}
