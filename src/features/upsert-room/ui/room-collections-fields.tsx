import { useQuery } from '@tanstack/react-query';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { collectionOptionsQueryOptions } from '@/entities/collection';
import type { Room } from '@/entities/room';
import { Switch } from '@/shared/ui/switch';
import type { RoomFormValues } from '../model/room-form-schema';
import { RoomCollectionOrder } from './room-collection-order';

interface RoomCollectionsFieldsProps {
  /** The room being edited; null while creating. */
  room: Room | null;
}

/** The mode of the room and the order of the collections it shows; collections are put into rooms from their form. */
export function RoomCollectionsFields({ room }: RoomCollectionsFieldsProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<RoomFormValues>();
  const isConsultationOnly = useWatch({ control, name: 'isConsultationOnly' });
  const options = useQuery(collectionOptionsQueryOptions);
  const names = new Map((options.data ?? []).map((option) => [option.id, option.name]));
  const hasSolutions = (room?.solutionCount ?? 0) > 0;
  const base = 'admin.rooms.collections';

  return (
    <>
      <Controller
        control={control}
        name="isConsultationOnly"
        render={({ field }) => {
          const isLocked = hasSolutions && !field.value;
          return (
            <label
              htmlFor="room-consultation"
              className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors has-disabled:cursor-not-allowed"
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-medium">{t('admin.rooms.fields.consultation')}</span>
                <span className="text-sm text-muted-foreground">
                  {t(isLocked ? 'admin.rooms.fields.consultationLocked' : 'admin.rooms.fields.consultationText')}
                </span>
              </span>
              <Switch
                id="room-consultation"
                checked={field.value}
                disabled={isLocked}
                onCheckedChange={field.onChange}
              />
            </label>
          );
        }}
      />
      {room ? (
        <Controller
          control={control}
          name="collectionIds"
          render={({ field }) => (
            <RoomCollectionOrder
              ids={field.value}
              names={names}
              links={room.collections}
              isConsultationOnly={isConsultationOnly}
              onChange={field.onChange}
            />
          )}
        />
      ) : (
        <p className="text-sm text-muted-foreground">{t(`${base}.newRoom`)}</p>
      )}
    </>
  );
}
