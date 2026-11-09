import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  adminInstallmentPageQueryKey,
  installmentPageQueryKey,
  saveInstallmentPage,
  type InstallmentPageContent,
} from '@/entities/installment-page';
import { getApiErrorMessage } from '@/shared/api';
import { EditorFooter } from '@/shared/ui/editor-footer';
import { FormSection } from '@/shared/ui/form-section';
import { installmentFormSchema, type InstallmentFormValues } from '../model/installment-form-schema';
import { toDefaultValues, toInput } from '../model/installment-form-values';
import { CardListFields } from './card-list-fields';
import { LoanListFields } from './loan-list-fields';

interface InstallmentPageFormProps {
  /** Saved texts, or the built-in ones until the first save. */
  content: InstallmentPageContent;
}

export function InstallmentPageForm({ content }: InstallmentPageFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const form = useForm<InstallmentFormValues>({
    resolver: zodResolver(installmentFormSchema),
    defaultValues: toDefaultValues(content),
  });
  const { isDirty } = form.formState;

  const save = useMutation({
    mutationFn: (values: InstallmentFormValues) => saveInstallmentPage(toInput(values)),
    onSuccess: async (response, values) => {
      form.reset(response.content ? toDefaultValues(response.content) : values);
      toast.success(t('admin.installmentPage.saved'));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminInstallmentPageQueryKey }),
        queryClient.invalidateQueries({ queryKey: installmentPageQueryKey }),
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
          <p className="text-sm text-muted-foreground">{t('admin.installmentPage.description')}</p>
          <FormSection
            title={t('admin.installmentPage.sections.cards')}
            description={t('admin.installmentPage.sections.cardsHint')}
          >
            <CardListFields />
          </FormSection>
          <FormSection
            title={t('admin.installmentPage.sections.loans')}
            description={t('admin.installmentPage.sections.loansHint')}
          >
            <LoanListFields />
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
