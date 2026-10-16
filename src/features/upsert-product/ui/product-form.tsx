import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, ImagePlus, Images, ListChecks, Package, Ruler, Tag } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { createProduct, productQueryOptions, productsQueryKey, updateProduct, type Product } from '@/entities/product';
import { ApiError, getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { EditorSections, type EditorSection } from '@/shared/ui/editor-sections';
import { productFormSchema, type ProductFormValues } from '../model/product-form-schema';
import { toDefaultValues, toInput } from '../model/product-form-values';
import { PRODUCT_SECTION_FIELDS, PRODUCT_SECTIONS, type ProductSection } from '../model/product-sections';
import { ProductAttributesFields } from './product-attributes-fields';
import { ProductDetailsFields } from './product-details-fields';
import { ProductMainFields } from './product-main-fields';
import { ProductPriceFields } from './product-price-fields';
import { ProductPublicationFields } from './product-publication-fields';

interface ProductFormProps {
  /** The product being edited; null while creating. */
  product: Product | null;
  /** Scroll to a section, for example the photos right after a product is created. */
  jumpTo?: { id: string; key: number };
  onJump: (section: ProductSection) => void;
  onDirtyChange: (isDirty: boolean) => void;
  /** Called after a save: a new product keeps the dialog open for its photos, an edited one closes it. */
  onSaved: (saved: Product, wasCreated: boolean) => void;
  onClose: () => void;
  /** Photos block of an existing product. */
  gallery: ReactNode;
}

function findSectionWithError(errors: FieldErrors<ProductFormValues>): ProductSection | undefined {
  return PRODUCT_SECTIONS.find((section) => PRODUCT_SECTION_FIELDS[section].some((field) => field in errors));
}

export function ProductForm({ product, jumpTo, onJump, onDirtyChange, onSaved, onClose, gallery }: ProductFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toDefaultValues(product),
  });
  const { errors, isDirty } = form.formState;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!product) {
      form.setFocus('name');
    }
  }, [form, product]);

  const save = useMutation({
    mutationFn: (values: ProductFormValues) =>
      product ? updateProduct(product.id, toInput(values)) : createProduct(toInput(values)),
    onSuccess: async (saved) => {
      queryClient.setQueryData(productQueryOptions(saved.id).queryKey, saved);
      await queryClient.invalidateQueries({ queryKey: productsQueryKey });
      toast.success(t(product ? 'admin.products.updated' : 'admin.products.created'));
      onSaved(saved, product === null);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.code === 'SKU_TAKEN') {
        form.setError('sku', { message: 'admin.products.validation.skuTaken' });
        onJump('main');
      } else if (error instanceof ApiError && error.code === 'SLUG_TAKEN') {
        form.setError('name', { message: 'admin.validation.nameTaken' });
        onJump('main');
      }
    },
  });
  const isFieldError = save.error instanceof ApiError && ['SKU_TAKEN', 'SLUG_TAKEN'].includes(save.error.code);
  const serverError = save.isError && !isFieldError ? getApiErrorMessage(save.error, t) : null;
  const hasError = (section: ProductSection) => PRODUCT_SECTION_FIELDS[section].some((field) => field in errors);

  const sections: EditorSection[] = [
    {
      id: 'main',
      title: t('admin.products.sections.main'),
      description: t('admin.products.sections.mainHint'),
      icon: Package,
      hasError: hasError('main'),
      content: <ProductMainFields />,
    },
    {
      id: 'pricing',
      title: t('admin.products.sections.price'),
      description: t('admin.products.sections.priceHint'),
      icon: Tag,
      hasError: hasError('pricing'),
      content: <ProductPriceFields />,
    },
    {
      id: 'details',
      title: t('admin.products.sections.details'),
      description: t('admin.products.sections.detailsHint'),
      icon: Ruler,
      hasError: hasError('details'),
      content: <ProductDetailsFields />,
    },
    {
      id: 'attributes',
      title: t('admin.products.sections.attributes'),
      description: t('admin.products.sections.attributesHint'),
      icon: ListChecks,
      hasError: hasError('attributes'),
      content: <ProductAttributesFields />,
    },
    {
      id: 'photos',
      title: t('admin.products.sections.photos'),
      description: t('admin.products.sections.photosHint'),
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
      title: t('admin.products.sections.publication'),
      description: t('admin.products.sections.publicationHint'),
      icon: Globe,
      hasError: hasError('publication'),
      content: <ProductPublicationFields />,
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
        onSubmit={form.handleSubmit(
          (values) => save.mutate(values),
          (invalid) => {
            const firstSection = findSectionWithError(invalid);
            if (firstSection) {
              onJump(firstSection);
            }
          },
        )}
      >
        <EditorSections sections={sections} jumpTo={jumpTo} />
        <EditorFooter isDirty={isDirty} isPending={save.isPending} error={serverError} onCancel={onClose} />
      </form>
    </FormProvider>
  );
}
