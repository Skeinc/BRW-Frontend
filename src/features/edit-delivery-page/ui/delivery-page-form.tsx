import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Banknote, CalendarClock, CreditCard, DoorOpen, Store, Wallet } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  adminDeliveryPageQueryKey,
  deliveryPageQueryKey,
  saveDeliveryPage,
  type DeliveryPageContent,
} from '@/entities/delivery-page';
import { getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { FormSection } from '@/shared/ui/form-section';
import { deliveryFormSchema, type DeliveryFormValues } from '../model/delivery-form-schema';
import { toDefaultValues, toInput } from '../model/delivery-form-values';
import { CardListFields } from './card-list-fields';
import { DocumentsFields } from './documents-fields';
import { FaqFields } from './faq-fields';
import { PaymentActiveSwitch } from './payment-active-switch';
import { PaymentIcon } from './payment-icon';

const PAYMENT_LABEL_KEYS = ['courier', 'pickup', 'card'] as const;
const DELIVERY_LABEL_KEYS = ['price', 'term', 'place'] as const;
const PAYMENT_ICONS = [Banknote, Store, CreditCard] as const;
const DELIVERY_ICONS = [Wallet, CalendarClock, DoorOpen] as const;

interface DeliveryPageFormProps {
  /** Saved texts, or the built-in Russian ones until the first save. */
  content: DeliveryPageContent;
}

export function DeliveryPageForm({ content }: DeliveryPageFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: toDefaultValues(content),
  });
  const { isDirty } = form.formState;

  const save = useMutation({
    mutationFn: (values: DeliveryFormValues) => saveDeliveryPage(toInput(values)),
    onSuccess: async (response, values) => {
      form.reset(response.content ? toDefaultValues(response.content) : values);
      toast.success(t('admin.deliveryPage.saved'));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminDeliveryPageQueryKey }),
        queryClient.invalidateQueries({ queryKey: deliveryPageQueryKey }),
      ]);
    },
  });
  const serverError = save.isError ? getApiErrorMessage(save.error, t) : null;

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
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 pb-6">
          <p className="text-sm text-muted-foreground">{t('admin.deliveryPage.description')}</p>
          <FormSection title={t('admin.deliveryPage.sections.payment')}>
            <CardListFields
              name="payment"
              isFixed
              gridClassName="grid gap-4"
              getCardLabel={(index) => t(`admin.deliveryPage.cards.payment.${PAYMENT_LABEL_KEYS[index]}`)}
              getCardClassName={() => 'has-data-[state=unchecked]:border-dashed has-data-[state=unchecked]:bg-card/50'}
              renderCorner={(index) => <PaymentActiveSwitch index={index} />}
              renderLead={(index) => <PaymentIcon icon={PAYMENT_ICONS[index] ?? Banknote} index={index} />}
            />
          </FormSection>
          <FormSection title={t('admin.deliveryPage.sections.delivery')}>
            <CardListFields
              name="delivery"
              isFixed
              gridClassName="grid gap-4"
              getCardLabel={(index) => t(`admin.deliveryPage.cards.delivery.${DELIVERY_LABEL_KEYS[index]}`)}
              renderLead={(index) => {
                const Icon = DELIVERY_ICONS[index] ?? Wallet;
                return <Icon aria-hidden className="size-8 text-primary" />;
              }}
            />
          </FormSection>
          <FormSection
            title={t('admin.deliveryPage.sections.receiving')}
            description={t('admin.deliveryPage.sections.receivingHint')}
          >
            <CardListFields
              name="receiving"
              isFixed={false}
              gridClassName="grid gap-4"
              renderLead={(index) => (
                <span className="flex size-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {index + 1}
                </span>
              )}
              getCardLabel={(index) => t('admin.deliveryPage.step', { number: index + 1 })}
            />
          </FormSection>
          <FormSection title={t('admin.deliveryPage.sections.documents')}>
            <DocumentsFields />
          </FormSection>
          <FormSection title={t('admin.deliveryPage.sections.faq')}>
            <FaqFields />
          </FormSection>
        </div>
        <div className="sticky -bottom-4 -mx-4 mt-auto md:-bottom-8 md:-mx-8">
          <EditorFooter
            isDirty={isDirty}
            isPending={save.isPending}
            error={serverError}
            onCancel={() => form.reset()}
          />
        </div>
      </form>
    </FormProvider>
  );
}
