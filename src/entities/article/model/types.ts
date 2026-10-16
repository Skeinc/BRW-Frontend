import type { MediaCover, MediaImage } from '@/entities/media';

/** One row of the article list: no body text. Dates are ISO strings. */
export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  cover: MediaCover | null;
}

export interface Article extends Omit<ArticleListItem, 'cover'> {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  images: MediaImage[];
}

export interface ArticleInput {
  title: string;
  excerpt: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  /** Left out when blank: the API stamps the time of the first publication itself. */
  publishedAt?: string;
}

export interface ArticleListParams {
  page: number;
  pageSize: number;
  q?: string;
  isPublished?: boolean;
}
