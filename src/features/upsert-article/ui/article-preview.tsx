import { useTranslation } from 'react-i18next';
import { MarkdownContent } from '@/shared/ui/markdown-content';

interface ArticlePreviewProps {
  content: string;
}

/** The article text as the reader will see it: Markdown and safe HTML (scripts and styles are stripped). */
export default function ArticlePreview({ content }: ArticlePreviewProps) {
  const { t } = useTranslation();
  if (content.trim() === '') {
    return <p className="p-6 text-sm text-muted-foreground">{t('admin.articles.preview.empty')}</p>;
  }
  return (
    <article className="min-h-72 p-5">
      <MarkdownContent content={content} />
    </article>
  );
}
