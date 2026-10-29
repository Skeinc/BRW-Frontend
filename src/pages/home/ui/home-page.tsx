import { useQuery } from '@tanstack/react-query';
import { catalogSlidesQueryOptions } from '@/entities/slide';
import { AboutTeaser } from '@/widgets/about-teaser';
import { AdvantagesStrip } from '@/widgets/advantages-strip';
import { CategoryTiles } from '@/widgets/category-tiles';
import { ContactCta } from '@/widgets/contact-cta';
import { HomeHero } from '@/widgets/home-hero';
import { HomeRooms } from '@/widgets/home-rooms';
import { HomeSlider } from '@/widgets/home-slider';
import { InstallmentBanner } from '@/widgets/installment-banner';
import { LatestArticles } from '@/widgets/latest-articles';
import { LatestNews } from '@/widgets/latest-news';
import { HitsSection, NewArrivalsSection } from '@/widgets/product-showcase';

export function HomePage() {
  const { data: slides = [] } = useQuery(catalogSlidesQueryOptions);
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {slides.length > 0 ? <HomeSlider slides={slides} /> : <HomeHero />}
      <AdvantagesStrip />
      <CategoryTiles />
      <HomeRooms />
      <NewArrivalsSection />
      <InstallmentBanner />
      <HitsSection />
      <LatestNews />
      <AboutTeaser />
      <LatestArticles />
      <ContactCta />
    </div>
  );
}
