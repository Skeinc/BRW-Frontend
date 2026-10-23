import { AdvantagesStrip } from '@/widgets/advantages-strip';
import { CategoryTiles } from '@/widgets/category-tiles';
import { ContactCta } from '@/widgets/contact-cta';
import { HomeHero } from '@/widgets/home-hero';
import { InstallmentBanner } from '@/widgets/installment-banner';
import { LatestArticles } from '@/widgets/latest-articles';
import { HitsSection, NewArrivalsSection } from '@/widgets/product-showcase';

export function HomePage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <HomeHero />
      <CategoryTiles />
      <AdvantagesStrip />
      <NewArrivalsSection />
      <InstallmentBanner />
      <HitsSection />
      <LatestArticles />
      <ContactCta />
    </div>
  );
}
