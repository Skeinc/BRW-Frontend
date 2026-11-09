import { useTranslation } from 'react-i18next';
import { InlineField } from './inline-field';

interface CardFieldsProps {
  index: number;
}

/** One installment card, laid out like the card on the public page. */
export function CardFields({ index }: CardFieldsProps) {
  const { t } = useTranslation();
  const fields = 'admin.installmentPage.fields';
  return (
    <div className="flex flex-col gap-2">
      <InlineField
        name={`cards.${index}.note`}
        label={t(`${fields}.note`)}
        className="text-xs font-semibold uppercase tracking-widest"
      />
      <InlineField name={`cards.${index}.name`} label={t(`${fields}.name`)} className="h-auto text-xl font-semibold" />
      <div className="flex items-center gap-2">
        <InlineField
          name={`cards.${index}.months`}
          label={t(`${fields}.months`)}
          type="number"
          inputMode="numeric"
          className="tabular-price h-auto w-32 text-4xl font-bold text-primary"
        />
        <span className="text-sm text-muted-foreground">{t('admin.installmentPage.monthsUnit')}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{t('pages.installment.cards.rateLabel')}</p>
      <InlineField name={`cards.${index}.rate`} label={t(`${fields}.rate`)} className="font-semibold" />
      <p className="text-sm text-muted-foreground">{t('pages.installment.cards.payDayLabel')}</p>
      <InlineField name={`cards.${index}.payment`} label={t(`${fields}.payment`)} className="font-semibold" optional />
    </div>
  );
}
