import { AboutFacts } from './about-facts';
import { AboutHero } from './about-hero';
import { AboutLegal } from './about-legal';
import { AboutStores } from './about-stores';

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutFacts />
      <AboutStores />
      <AboutLegal />
    </>
  );
}
