import type { Room, RoomInput, RoomUpdateInput } from '@/entities/room';
import { emptyToNull } from '@/shared/lib/form/empty-to-null';
import type { RoomFormValues } from './room-form-schema';

export function toDefaultValues(room: Room | null): RoomFormValues {
  return {
    name: room?.name ?? '',
    description: room?.description ?? '',
    seoTitle: room?.seoTitle ?? '',
    seoDescription: room?.seoDescription ?? '',
    isPublished: room?.isPublished ?? true,
    isConsultationOnly: room?.isConsultationOnly ?? false,
    collectionIds: room?.collections.map((link) => link.collectionId) ?? [],
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
    isConsultationOnly: values.isConsultationOnly,
  };
}

/** An edit also sends the order of the collections; adding or removing them happens in the collection form. */
export function toUpdateInput(values: RoomFormValues): RoomUpdateInput {
  return { ...toInput(values), collectionIds: values.collectionIds };
}
