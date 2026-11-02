import { ShoppingCart } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { addToCart, useCartLines } from '@/entities/cart';
import { SITE_CURRENCY } from '@/shared/config';
import { track } from '@/shared/lib/analytics/track';
import { Button } from '@/shared/ui/button';

interface AddSetToCartButtonProps {
  products: readonly { id: string; name: string; price: string }[];
  className?: string;
}

/** Puts the elements of a ready-made solution that are not in the cart yet into it; turns into a link to the cart once they are all there. */
export function AddSetToCartButton({ products, className }: AddSetToCartButtonProps) {
  const { t } = useTranslation();
  const lines = useCartLines();
  const missing = products.filter((product) => !lines.some((line) => line.productId === product.id));
  const isInCart = products.length > 0 && missing.length === 0;

  const handleAdd = (): void => {
    if (missing.length === 0) {
      return;
    }
    missing.forEach((product) => addToCart(product.id));
    track('add_to_cart', {
      currency: SITE_CURRENCY,
      value: missing.reduce((sum, product) => sum + Number(product.price), 0),
      items: missing.map((product) => ({
        item_id: product.id,
        item_name: product.name,
        price: Number(product.price),
        quantity: 1,
      })),
    });
  };

  if (isInCart) {
    return (
      <Button asChild variant="outline" className={className}>
        <Link to="/cart">
          <ShoppingCart aria-hidden />
          {t('rooms.setInCart')}
        </Link>
      </Button>
    );
  }
  return (
    <Button type="button" className={className} onClick={handleAdd}>
      <ShoppingCart aria-hidden />
      {t('rooms.addSet')}
    </Button>
  );
}
