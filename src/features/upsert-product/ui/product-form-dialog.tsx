import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { productQueryOptions } from '@/entities/product';
import { getApiErrorMessage } from '@/shared/api';
import { PublicationBadge } from '@/shared/ui/publication-badge';
import { DiscardChangesDialog } from '@/shared/ui/discard-changes-dialog';
import { EditorDialog } from '@/shared/ui/editor-dialog';
import { Skeleton } from '@/shared/ui/skeleton';
import type { ProductSection } from '../model/product-sections';
import { ProductForm } from './product-form';

const NEW_PRODUCT = 'new';

interface ProductFormDialogProps {
  /** `'new'` to create, the id of a product to edit, `null` while the dialog is closed. */
  target: string | null;
  onClose: () => void;
  /** Called with the id of a product just created, so the screen can keep the dialog open on it. */
  onCreated: (productId: string) => void;
  /** The photos block of an existing product, built by the page. */
  renderGallery: (productId: string) => ReactNode;
}

export function ProductFormDialog({ target, onClose, onCreated, renderGallery }: ProductFormDialogProps) {
  const { t } = useTranslation();
  const [jump, setJump] = useState<{ id: string; key: number }>();
  const [isDirty, setIsDirty] = useState(false);
  const [isAskingDiscard, setIsAskingDiscard] = useState(false);
  const productId = target !== null && target !== NEW_PRODUCT ? target : undefined;
  const productQuery = useQuery({ ...productQueryOptions(productId ?? ''), enabled: productId !== undefined });
  const product = productQuery.data ?? null;

  useEffect(() => {
    if (target === null) {
      setJump(undefined);
      setIsDirty(false);
    }
  }, [target]);

  const jumpToSection = (section: ProductSection) => setJump({ id: section, key: Date.now() });
  const requestClose = () => (isDirty ? setIsAskingDiscard(true) : onClose());

  return (
    <>
      <EditorDialog
        open={target !== null}
        onOpenChange={(open) => !open && requestClose()}
        title={product?.name ?? t(productId ? 'admin.products.editTitle' : 'admin.products.createTitle')}
        subtitle={
          product?.sku ? t('admin.products.editSubtitle', { sku: product.sku }) : t('admin.products.formDescription')
        }
        badge={product ? <PublicationBadge isPublished={product.isPublished} /> : null}
      >
        {productId !== undefined && productQuery.isPending ? (
          <div className="flex flex-col gap-3 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : null}
        {productQuery.isError ? (
          <p role="alert" className="p-6 text-sm text-destructive">
            {getApiErrorMessage(productQuery.error, t)}
          </p>
        ) : null}
        {target !== null && (productId === undefined || product) ? (
          <ProductForm
            key={product?.id ?? NEW_PRODUCT}
            product={product}
            jumpTo={jump}
            onJump={jumpToSection}
            onDirtyChange={setIsDirty}
            onClose={requestClose}
            gallery={product ? renderGallery(product.id) : undefined}
            onSaved={(saved, wasCreated) => {
              setIsDirty(false);
              if (wasCreated) {
                jumpToSection('photos');
                onCreated(saved.id);
              } else {
                onClose();
              }
            }}
          />
        ) : null}
      </EditorDialog>
      <DiscardChangesDialog
        open={isAskingDiscard}
        onKeepEditing={() => setIsAskingDiscard(false)}
        onDiscard={() => {
          setIsAskingDiscard(false);
          setIsDirty(false);
          onClose();
        }}
      />
    </>
  );
}
