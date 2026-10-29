import type { Room, RoomInput } from '@/entities/room';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import type { RoomFormValues } from './room-form-schema';

export function toDefaultValues(room: Room | null): RoomFormValues {
  return {
    name: room?.name ?? '',
    description: room?.description ?? '',
    seoTitle: room?.seoTitle ?? '',
    seoDescription: room?.seoDescription ?? '',
    isPublished: room?.isPublished ?? true,
  };
}

/** The sort order is not asked from the user: new rooms go to the end and the order is changed by dragging. */
export function toInput(values: RoomFormValues): RoomInput {
  return {
    name: values.name.trim(),
    description: emptyToNull(values.description),
    seoTitle: emptyToNull(values.seoTitle),
    seoDescription: emptyToNull(values.seoDescription),
    isPublished: values.isPublished,
  };
}
