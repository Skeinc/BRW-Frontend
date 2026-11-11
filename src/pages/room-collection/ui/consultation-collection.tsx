import { Clock, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CatalogRoomCollectionDetail } from '@/entities/room';
import { SITE_PHONE } from '@/shared/config';
import { formatPrice } from '@/shared/lib/format-price';
import { formatPhone, toTelHref } from '@/shared/lib/phone';
import { Button } from '@/shared/ui/button';
import { CollapsibleText } from '@/shared/ui/collapsible-text';
import { CollectionPhotos } from './collection-photos';

interface ConsultationCollectionProps {
  collection: CatalogRoomCollectionDetail['collection'];
}

/**
 * A collection of a consultation-only room (kitchens): photos on the left; the price "от …", the text and a call to
 * phone or visit the salon on the right. Nothing goes to the cart: kitchens are drawn to the customer's sizes.
 */
export function ConsultationCollection({ collection }: ConsultationCollectionProps) {
  const { t, i18n } = useTranslation();
  return (
    <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <CollectionPhotos name={collection.name} images={collection.images} />
      <div className="flex flex-col gap-5">
        {collection.priceFrom && (
          <p className="text-2xl font-bold">
            <span className="mr-2 text-base font-normal text-muted-foreground">
              {t('rooms.consultation.priceFrom')}
            </span>
            <span className="tabular-price">{formatPrice(collection.priceFrom, i18n.language)}</span>
          </p>
        )}
        {collection.description && <CollapsibleText text={collection.description} />}
        <div className="flex flex-col gap-4 rounded-xl bg-muted/60 p-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{t('rooms.consultation.heading')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('rooms.consultation.text')}</p>
          </div>
          <Button asChild className="h-12 w-full">
            <a href={toTelHref(SITE_PHONE)}>
              <Phone aria-hidden />
              {t('rooms.consultation.call')}
            </a>
          </Button>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone aria-hidden className="mt-0.5 size-4 shrink-0" />
              <a href={toTelHref(SITE_PHONE)} className="tabular-price hover:text-foreground">
                {formatPhone(SITE_PHONE)}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
              {t('stores.nepokorennykh.address')}
            </li>
            <li className="flex items-start gap-2">
              <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
              {t('footer.hours')}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
