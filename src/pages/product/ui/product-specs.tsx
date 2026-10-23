import { useTranslation } from 'react-i18next';
import { formatCm, type CatalogProductDetail } from '@/entities/product';

interface ProductSpecsProps {
  product: CatalogProductDetail;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const { t, i18n } = useTranslation();
  const cm = t('product.cm');
  const sized = (mm: number | null): string | null => {
    const value = formatCm(mm, i18n.language);
    return value === null ? null : `${value} ${cm}`;
  };
  const rows: [string, string | null][] = [
    [t('product.specs.width'), sized(product.widthMm)],
    [t('product.specs.length'), sized(product.lengthMm)],
    [t('product.specs.height'), sized(product.heightMm)],
    [t('product.specs.heightMax'), sized(product.heightMaxMm)],
    [t('product.specs.depth'), sized(product.depthMm)],
    [t('product.specs.material'), product.material],
    [t('product.specs.colorBody'), product.colorBody],
    [t('product.specs.colorFacade'), product.colorFacade],
    ...Object.entries(product.attributes),
  ];
  const filled = rows.filter((row): row is [string, string] => row[1] !== null && row[1] !== '');
  if (filled.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="product-specs">
      <h2 id="product-specs" className="text-2xl font-bold tracking-tight">
        {t('product.specsTitle')}
      </h2>
      <dl className="mt-4 divide-y border-y">
        {filled.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-3 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
