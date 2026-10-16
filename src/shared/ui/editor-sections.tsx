import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';

export interface EditorSection {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  /** A field of this section has an error: the menu item gets a red dot. */
  hasError?: boolean;
  content: ReactNode;
}

interface EditorSectionsProps {
  sections: readonly EditorSection[];
  /** Show the section menu: a column on the left of a wide window, chips above the form on a phone. */
  showMenu?: boolean;
  /** Scroll to a section; a new `key` repeats the jump to the same section. */
  jumpTo?: { id: string; key: number };
}

const SCROLL_OFFSET_PX = 12;

function findSection(container: HTMLElement, id: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[data-section="${id}"]`);
}

/** Smoothly scrolls the container to the top of a section; false when the section is not there. */
function scrollSectionIntoView(container: HTMLElement | null, id: string): boolean {
  const target = container ? findSection(container, id) : null;
  if (!container || !target) {
    return false;
  }
  container.scrollTo({ top: target.offsetTop - SCROLL_OFFSET_PX, behavior: 'smooth' });
  return true;
}

/**
 * The sections of a long form in one scrolling column, with a menu that jumps to a section and
 * follows the scrolling. Every section stays mounted, so fields keep their values and focus works everywhere.
 */
export function EditorSections({ sections, showMenu = true, jumpTo }: EditorSectionsProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  const scrollToSection = (id: string) => {
    if (scrollSectionIntoView(scrollRef.current, id)) {
      setActiveId(id);
    }
  };

  const followScroll = () => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    const isAtBottom =
      container.scrollHeight > container.clientHeight + 4 &&
      container.scrollTop + container.clientHeight >= container.scrollHeight - 4;
    const passed = sections.filter(
      (section) => (findSection(container, section.id)?.offsetTop ?? 0) - SCROLL_OFFSET_PX * 3 <= container.scrollTop,
    );
    setActiveId(isAtBottom ? sections[sections.length - 1].id : (passed.at(-1) ?? sections[0]).id);
  };

  useEffect(() => {
    if (jumpTo && scrollSectionIntoView(scrollRef.current, jumpTo.id)) {
      setActiveId(jumpTo.id);
    }
  }, [jumpTo, scrollRef]);

  const menu = (
    <ul className="flex gap-1 md:flex-col">
      {sections.map((section) => (
        <li key={section.id} className="shrink-0">
          <button
            type="button"
            aria-current={activeId === section.id ? 'true' : undefined}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              activeId === section.id &&
                'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            onClick={() => scrollToSection(section.id)}
          >
            <section.icon className="size-4 shrink-0" aria-hidden />
            {section.title}
            {section.hasError ? (
              <span className="ml-auto size-2 shrink-0 rounded-full bg-destructive">
                <span className="sr-only">{t('ui.hasErrors')}</span>
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex min-h-0 flex-1">
      {showMenu ? (
        <nav
          aria-label={t('ui.editor.menu')}
          className="hidden w-60 shrink-0 overflow-y-auto border-r bg-muted/30 p-3 md:block"
        >
          {menu}
        </nav>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {showMenu ? (
          <nav aria-label={t('ui.editor.menu')} className="overflow-x-auto border-b px-3 py-2 md:hidden">
            {menu}
          </nav>
        ) : null}
        <div
          ref={scrollRef}
          onScroll={followScroll}
          className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {sections.map((section) => (
              <section
                key={section.id}
                data-section={section.id}
                aria-labelledby={`editor-section-${section.id}`}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-0.5">
                  <h3 id={`editor-section-${section.id}`} className="text-base font-semibold">
                    {section.title}
                  </h3>
                  {section.description ? <p className="text-sm text-muted-foreground">{section.description}</p> : null}
                </div>
                <div className="flex flex-col gap-5 rounded-xl border bg-card p-4 shadow-xs sm:p-5">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
