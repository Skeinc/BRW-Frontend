import { useTranslation } from 'react-i18next';

interface ProductDescriptionProps {
  text: string;
}

export function ProductDescription({ text }: ProductDescriptionProps) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="product-description">
      <h2 id="product-description" className="text-2xl font-bold tracking-tight">
        {t('product.descriptionTitle')}
      </h2>
      <p className="mt-4 whitespace-pre-line text-muted-foreground">{text}</p>
    </section>
  );
}
