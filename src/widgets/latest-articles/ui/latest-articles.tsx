import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { catalogArticlesQueryOptions, type CatalogArticleCard } from '@/entities/article';
import { TeaserCard } from '@/shared/ui/teaser-card';
import { TeaserSection } from '@/shared/ui/teaser-section';

/** The newest article gets the large card, the next four fill a 2x2 grid beside it. */
export const LATEST_ARTICLES_PARAMS = { pageSize: 5 } as const;

function renderCard(article: CatalogArticleCard, isFeatured = false) {
  return (
    <TeaserCard
      title={article.title}
      publishedAt={article.publishedAt}
      coverImage={article.coverImage}
      placeholderKind="article"
      linkProps={{ to: '/articles/$articleId', params: { articleId: article.id } }}
      isFeatured={isFeatured}
    />
  );
}

export function LatestArticles() {
  const { t } = useTranslation();
  const { data } = useQuery(catalogArticlesQueryOptions(LATEST_ARTICLES_PARAMS));
  if (!data || data.items.length === 0) {
    return null;
  }
  const [featured, ...rest] = data.items;
  return (
    <TeaserSection
      id="home-articles"
      title={t('pages.home.articles.title')}
      allLabel={t('pages.home.articles.all')}
      allTo="/articles"
      featured={renderCard(featured, true)}
      items={rest.map((article) => ({ key: article.id, card: renderCard(article) }))}
    />
  );
}
