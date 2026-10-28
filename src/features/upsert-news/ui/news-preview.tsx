import { useTranslation } from 'react-i18next';
import { MarkdownContent } from '@/shared/ui/markdown-content';

interface NewsItemPreviewProps {
  content: string;
}

/** The news item text as the reader will see it: Markdown and safe HTML (scripts and styles are stripped). */
export default function NewsItemPreview({ content }: NewsItemPreviewProps) {
  const { t } = useTranslation();
  if (content.trim() === '') {
    return <p className="p-6 text-sm text-muted-foreground">{t('admin.news.preview.empty')}</p>;
  }
  return (
    <article className="min-h-72 p-5">
      <MarkdownContent content={content} />
    </article>
  );
}
