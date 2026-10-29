import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { catalogNewsQueryOptions, type CatalogNewsCard } from '@/entities/news';
import { TeaserCard } from '@/shared/ui/teaser-card';
import { TeaserSection } from '@/shared/ui/teaser-section';

/** The newest item gets the large card, the next four fill a 2x2 grid beside it. */
export const LATEST_NEWS_PARAMS = { pageSize: 5 } as const;

function renderCard(newsItem: CatalogNewsCard, isFeatured = false) {
  return (
    <TeaserCard
      title={newsItem.title}
      publishedAt={newsItem.publishedAt}
      coverImage={newsItem.coverImage}
      placeholderKind="news"
      linkProps={{ to: '/news/$newsId', params: { newsId: newsItem.id } }}
      isFeatured={isFeatured}
    />
  );
}

export function LatestNews() {
  const { t } = useTranslation();
  const { data } = useQuery(catalogNewsQueryOptions(LATEST_NEWS_PARAMS));
  if (!data || data.items.length === 0) {
    return null;
  }
  const [featured, ...rest] = data.items;
  return (
    <TeaserSection
      id="home-news"
      title={t('pages.home.news.title')}
      allLabel={t('pages.home.news.all')}
      allTo="/news"
      featured={renderCard(featured, true)}
      items={rest.map((newsItem) => ({ key: newsItem.id, card: renderCard(newsItem) }))}
    />
  );
}
