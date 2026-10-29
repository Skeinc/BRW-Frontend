import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { CatalogSlide } from '@/entities/slide';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { HomeSliderImage } from './home-slider-image';

const AUTOPLAY_MS = 6000;

interface HomeSliderProps {
  slides: CatalogSlide[];
}

/** Banner carousel of the home page: arrows, dots, autoplay that stops on hover, focus and reduced motion. */
export function HomeSlider({ slides }: HomeSliderProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = slides.length;
  const current = count > 0 ? index % count : 0;

  useEffect(() => {
    if (count < 2 || isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timer = window.setTimeout(() => setIndex(current + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [count, isPaused, current]);

  const go = (target: number) => setIndex((target + count) % count);
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      go(current - 1);
    } else if (event.key === 'ArrowRight') {
      go(current + 1);
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('pages.home.slider.label')}
      className="relative mx-auto w-full max-w-7xl overflow-hidden md:rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      onKeyDown={onKeyDown}
    >
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, position) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={t('pages.home.slider.slide', { current: position + 1, total: count })}
            aria-hidden={position !== current}
            className="w-full shrink-0"
          >
            <HomeSliderImage slide={slide} isFirst={position === 0} isHidden={position !== current} />
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-90"
            aria-label={t('pages.home.slider.previous')}
            onClick={() => go(current - 1)}
          >
            <ChevronLeft aria-hidden />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-90"
            aria-label={t('pages.home.slider.next')}
            onClick={() => go(current + 1)}
          >
            <ChevronRight aria-hidden />
          </Button>
          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            {slides.map((slide, position) => (
              <button
                key={slide.id}
                type="button"
                aria-label={t('pages.home.slider.goTo', { current: position + 1 })}
                aria-current={position === current}
                onClick={() => go(position)}
                className="flex size-6 items-center justify-center"
              >
                <span
                  className={cn(
                    'size-2.5 rounded-full border border-white/80 bg-black/30 transition-colors',
                    position === current && 'bg-primary',
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
