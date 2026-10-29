import type { CatalogSlide } from '@/entities/slide';

interface HomeSliderImageProps {
  slide: CatalogSlide;
  isFirst: boolean;
  isHidden: boolean;
}

/** One banner; a link wraps it when the slide has an address. Hidden slides leave the tab order. */
export function HomeSliderImage({ slide, isFirst, isHidden }: HomeSliderImageProps) {
  const image = (
    <img
      src={slide.image.url}
      alt={slide.alt}
      width={slide.image.width}
      height={slide.image.height}
      loading={isFirst ? 'eager' : 'lazy'}
      fetchPriority={isFirst ? 'high' : 'auto'}
      className="aspect-[847/288] w-full object-cover"
    />
  );
  const { linkUrl } = slide;
  /* The API only allows site paths and https addresses; anything else is dropped here as well. */
  if (!linkUrl || !(linkUrl.startsWith('/') || linkUrl.startsWith('https://'))) {
    return image;
  }
  const className = 'block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring';
  const tabIndex = isHidden ? -1 : undefined;
  if (linkUrl.startsWith('https://')) {
    return (
      <a href={linkUrl} target="_blank" rel="noopener noreferrer" tabIndex={tabIndex} className={className}>
        {image}
      </a>
    );
  }
  return (
    <a href={linkUrl} tabIndex={tabIndex} className={className}>
      {image}
    </a>
  );
}
