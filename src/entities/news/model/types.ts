import type { MediaCover, MediaImage } from '@/entities/media';

/** One row of the news item list: no body text. Dates are ISO strings. */
export interface NewsListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  isPublished: boolean;
  isPromo: boolean;
  publishedAt: string | null;
  cover: MediaCover | null;
}

export interface NewsItem extends Omit<NewsListItem, 'cover'> {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  images: MediaImage[];
}

export interface NewsItemInput {
  title: string;
  excerpt: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  isPromo: boolean;
  /** Left out when blank: the API stamps the time of the first publication itself. */
  publishedAt?: string;
}

export interface NewsListParams {
  page: number;
  pageSize: number;
  q?: string;
  isPublished?: boolean;
  isPromo?: boolean;
}
