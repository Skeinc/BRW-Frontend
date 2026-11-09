import { useTranslation } from 'react-i18next';
import { DETAILS_MAX, FACTS_MAX } from '../model/installment-form-schema';
import { InlineField } from './inline-field';
import { LabeledValuesFields } from './labeled-values-fields';
import { LoanBadgesFields } from './loan-badges-fields';
import { LoanStepsFields } from './loan-steps-fields';

interface LoanFieldsProps {
  index: number;
}

/** One bank loan card, laid out like the card on the public page. */
export function LoanFields({ index }: LoanFieldsProps) {
  const { t } = useTranslation();
  const fields = 'admin.installmentPage.fields';
  const sections = 'admin.installmentPage.sections';
  const heading = 'text-sm font-semibold';
  return (
    <div className="flex flex-col gap-3">
      <InlineField
        name={`loans.${index}.bank`}
        label={t(`${fields}.bank`)}
        className="text-xs font-semibold uppercase tracking-widest"
      />
      <InlineField name={`loans.${index}.name`} label={t(`${fields}.name`)} className="h-auto text-lg font-semibold" />
      <LoanBadgesFields loanIndex={index} />
      <p className="mt-2 border-t pt-4 text-sm text-muted-foreground">{t('pages.installment.loans.termLabel')}</p>
      <InlineField
        name={`loans.${index}.term`}
        label={t(`${fields}.term`)}
        className="tabular-price h-auto text-2xl font-bold text-primary"
      />
      <p className="text-sm text-muted-foreground">{t('pages.installment.loans.rateLabel')}</p>
      <InlineField name={`loans.${index}.rate`} label={t(`${fields}.rate`)} className="font-semibold" multiline />
      <p className={`${heading} mt-2 border-t pt-4`}>{t(`${sections}.facts`)}</p>
      <LabeledValuesFields
        loanIndex={index}
        name="facts"
        max={FACTS_MAX}
        addLabel={t('admin.installmentPage.add.fact')}
        labelPlaceholder={t(`${fields}.factLabel`)}
        valuePlaceholder={t(`${fields}.factValue`)}
      />
      <p className={`${heading} mt-2 border-t pt-4`}>{t('pages.installment.loans.detailsTitle')}</p>
      <LabeledValuesFields
        loanIndex={index}
        name="details"
        max={DETAILS_MAX}
        addLabel={t('admin.installmentPage.add.detail')}
        labelPlaceholder={t(`${fields}.detailLabel`)}
        valuePlaceholder={t(`${fields}.detailValue`)}
      />
      <p className={`${heading} mt-2 border-t pt-4`}>{t('pages.installment.loans.stepsTitle')}</p>
      <LoanStepsFields loanIndex={index} />
    </div>
  );
}
