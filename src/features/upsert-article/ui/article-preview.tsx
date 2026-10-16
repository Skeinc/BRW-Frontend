import Markdown, { type Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useTranslation } from 'react-i18next';

const COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="mt-8 mb-3 text-3xl font-bold first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-7 mb-3 text-2xl font-semibold first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 text-xl font-semibold first:mt-0">{children}</h3>,
  p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>,
  a: ({ children, href }) => (
    <a href={href} className="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  img: ({ src, alt }) => <img src={src} alt={alt ?? ''} loading="lazy" className="my-4 max-w-full rounded-lg" />,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 pl-4 text-muted-foreground italic">{children}</blockquote>
  ),
  code: ({ children }) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>,
  hr: () => <hr className="my-6" />,
};

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
      <Markdown components={COMPONENTS} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
        {content}
      </Markdown>
    </article>
  );
}
