import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, ImagePlus, Images, Info } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { roomsQueryKey, createRoom, updateRoom, type Room, type RoomDetail } from '@/entities/room';
import { getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { EditorSections, type EditorSection } from '@/shared/ui/editor-sections';
import { roomFormSchema, type RoomFormValues } from '../model/room-form-schema';
import { toDefaultValues, toInput } from '../model/room-form-values';
import { RoomMainFields } from './room-main-fields';
import { RoomPublicationFields } from './room-publication-fields';

interface RoomFormProps {
  /** The room being edited; null while creating. */
  room: Room | null;
  jumpTo?: { id: string; key: number };
  onDirtyChange: (isDirty: boolean) => void;
  /** Called after a save: a new room keeps the dialog open for its photo, an edited one closes it. */
  onSaved: (saved: RoomDetail, wasCreated: boolean) => void;
  onClose: () => void;
  /** Photo block of an existing room. */
  gallery: ReactNode;
}

export function RoomForm({ room, jumpTo, onDirtyChange, onSaved, onClose, gallery }: RoomFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: toDefaultValues(room),
  });
  const { isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!room) {
      form.setFocus('name');
    }
  }, [form, room]);

  const save = useMutation({
    mutationFn: (values: RoomFormValues) => (room ? updateRoom(room.id, toInput(values)) : createRoom(toInput(values))),
    onSuccess: async (saved) => {
      await queryClient.invalidateQueries({ queryKey: roomsQueryKey });
      toast.success(t(room ? 'admin.rooms.updated' : 'admin.rooms.created'));
      onSaved(saved, room === null);
    },
  });
  const serverError = save.isError ? getApiErrorMessage(save.error, t) : null;

  const sections: EditorSection[] = [
    {
      id: 'main',
      title: t('admin.rooms.sections.main'),
      description: t('admin.rooms.sections.mainHint'),
      icon: Info,
      content: <RoomMainFields />,
    },
    {
      id: 'photo',
      title: t('admin.rooms.sections.photo'),
      description: t('admin.rooms.sections.photoHint'),
      icon: Images,
      content: gallery ?? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center">
          <ImagePlus className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t('admin.gallery.saveFirstLong')}</p>
        </div>
      ),
    },
    {
      id: 'publication',
      title: t('admin.rooms.sections.publication'),
      description: t('admin.rooms.sections.publicationHint'),
      icon: Globe,
      content: <RoomPublicationFields />,
    },
  ];

  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex min-h-0 flex-1 flex-col"
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.requestSubmit();
          }
        }}
        onSubmit={form.handleSubmit((values) => save.mutate(values))}
      >
        <EditorSections sections={sections} showMenu={false} jumpTo={jumpTo} />
        <EditorFooter isDirty={isDirty} isPending={save.isPending} error={serverError} onCancel={onClose} />
      </form>
    </FormProvider>
  );
}
