import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { MediaImage } from '@/entities/media';
import { GalleryItem } from './gallery-item';

interface GalleryGridProps {
  images: MediaImage[];
  onReorder: (imageIds: string[]) => void;
  onAltChange: (imageId: string, alt: string) => void;
  onDelete: (image: MediaImage) => void;
}

export function GalleryGrid({ images, onReorder, onAltChange, onDelete }: GalleryGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }
    const from = images.findIndex((image) => image.id === active.id);
    const to = images.findIndex((image) => image.id === over.id);
    onReorder(arrayMove(images, from, to).map((image) => image.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((image) => image.id)} strategy={rectSortingStrategy}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <GalleryItem
              key={image.id}
              image={image}
              isCover={index === 0}
              onAltChange={onAltChange}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
