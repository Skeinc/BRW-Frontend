import Markdown, { type Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const HEADING_CLASSES = {
  h1: 'mt-8 mb-3 text-3xl font-bold first:mt-0',
  h2: 'mt-7 mb-3 text-2xl font-semibold first:mt-0',
  h3: 'mt-6 mb-2 text-xl font-semibold first:mt-0',
} as const;

const BASE_COMPONENTS: Components = {
  p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-6">{children}</ol>,
  a: ({ children, href }) => {
    const isInternal = href !== undefined && (href.startsWith('#') || href.startsWith('/'));
    return (
      <a
        href={href}
        className="text-primary underline underline-offset-2"
        target={isInternal ? undefined : '_blank'}
        rel={isInternal ? undefined : 'noopener noreferrer'}
      >
        {children}
      </a>
    );
  },
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => <img src={src} alt={alt ?? ''} loading="lazy" className="my-4 max-w-full rounded-lg" />,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 pl-4 text-muted-foreground italic">{children}</blockquote>
  ),
  code: ({ children }) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>,
  hr: () => <hr className="my-6" />,
};

const COMPONENTS: Components = {
  ...BASE_COMPONENTS,
  h1: ({ children }) => <h1 className={HEADING_CLASSES.h1}>{children}</h1>,
  h2: ({ children }) => <h2 className={HEADING_CLASSES.h2}>{children}</h2>,
  h3: ({ children }) => <h3 className={HEADING_CLASSES.h3}>{children}</h3>,
};

/** Headings one level down, for a page that already has its own `<h1>`; the look stays the same. */
const DEMOTED_COMPONENTS: Components = {
  ...BASE_COMPONENTS,
  h1: ({ children }) => <h2 className={HEADING_CLASSES.h1}>{children}</h2>,
  h2: ({ children }) => <h3 className={HEADING_CLASSES.h2}>{children}</h3>,
  h3: ({ children }) => <h4 className={HEADING_CLASSES.h3}>{children}</h4>,
};

interface MarkdownContentProps {
  content: string;
  /** Render `#` as `<h2>` and so on, because the page already has an `<h1>`. */
  demoteHeadings?: boolean;
}

/** Markdown and safe HTML as the reader sees it: scripts and styles are stripped. */
export function MarkdownContent({ content, demoteHeadings = false }: MarkdownContentProps) {
  return (
    <Markdown components={demoteHeadings ? DEMOTED_COMPONENTS : COMPONENTS} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
      {content}
    </Markdown>
  );
}
