import { cn } from '@/shared/lib/utils';

interface BrandLogoProps {
  /** `onDark` for the footer, `onLight` for the header. */
  tone?: 'onDark' | 'onLight';
  className?: string;
}

const LOGO_SOURCES = {
  onDark: '/brand/brw-logo-on-dark.svg',
  onLight: '/brand/brw-logo.svg',
} as const;

/** Logo of the shop: the red "Black Red White" wordmark with the tagline, as on brw-shop.by. */
export function BrandLogo({ tone = 'onDark', className }: BrandLogoProps) {
  const imageClass = cn('h-8 w-auto sm:h-9', className);
  if (tone === 'onDark') {
    return <img src={LOGO_SOURCES.onDark} alt="Black Red White" width={245} height={37} className={imageClass} />;
  }
  return (
    <>
      <img
        src={LOGO_SOURCES.onLight}
        alt="Black Red White"
        width={245}
        height={37}
        className={cn(imageClass, 'dark:hidden')}
      />
      <img
        src={LOGO_SOURCES.onDark}
        alt="Black Red White"
        width={245}
        height={37}
        className={cn(imageClass, 'hidden dark:block')}
      />
    </>
  );
}
