import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  GALLERY_ACCEPTED_TYPES,
  GALLERY_MAX_FILE_BYTES,
  useUploadGalleryImage,
  type GalleryOwner,
} from '@/entities/media';
import { getApiErrorMessage } from '@/shared/api';

export interface UploadItem {
  id: string;
  name: string;
  progress: number;
  error: string | null;
}

function isAcceptedImage(file: File): boolean {
  return (GALLERY_ACCEPTED_TYPES as readonly string[]).includes(file.type) && file.size <= GALLERY_MAX_FILE_BYTES;
}

/** Uploads files one after another, so the gallery order matches the order the files were picked. */
export function useUploadQueue(owner: GalleryOwner, ownerId: string) {
  const { t } = useTranslation();
  const upload = useUploadGalleryImage(owner, ownerId);
  const [items, setItems] = useState<UploadItem[]>([]);
  const chain = useRef<Promise<void>>(Promise.resolve());

  const patchItem = (id: string, patch: Partial<UploadItem>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const runUpload = async (item: UploadItem, file: File): Promise<void> => {
    try {
      await upload.mutateAsync({ file, onProgress: (progress) => patchItem(item.id, { progress }) });
      setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    } catch (error) {
      patchItem(item.id, { error: getApiErrorMessage(error, t) });
    }
  };

  const addFiles = (files: File[]) => {
    const accepted = files.filter(isAcceptedImage);
    if (accepted.length < files.length) {
      toast.error(t('api.errors.IMAGE_INVALID'));
    }
    for (const file of accepted) {
      const item: UploadItem = { id: crypto.randomUUID(), name: file.name, progress: 0, error: null };
      setItems((current) => [...current, item]);
      chain.current = chain.current.then(() => runUpload(item, file));
    }
  };

  const dismiss = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  return { items, addFiles, dismiss };
}
