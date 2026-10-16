export type MarkdownAction = 'bold' | 'italic' | 'heading' | 'list' | 'link';

export interface TextSelection {
  value: string;
  start: number;
  end: number;
}

const LINK_PLACEHOLDER = 'https://';

function wrap(selection: TextSelection, mark: string, placeholder: string): TextSelection {
  const { value, start, end } = selection;
  const selected = value.slice(start, end) || placeholder;
  const next = `${value.slice(0, start)}${mark}${selected}${mark}${value.slice(end)}`;
  return { value: next, start: start + mark.length, end: start + mark.length + selected.length };
}

function prefixLines(selection: TextSelection, prefix: string): TextSelection {
  const { value, start, end } = selection;
  const lineStart = start === 0 ? 0 : value.lastIndexOf('\n', start - 1) + 1;
  const block = value.slice(lineStart, end);
  const prefixed = block
    .split('\n')
    .map((line) => (line.startsWith(prefix) ? line : prefix + line))
    .join('\n');
  const next = value.slice(0, lineStart) + prefixed + value.slice(end);
  return { value: next, start: lineStart, end: lineStart + prefixed.length };
}

/** Applies a Markdown format to the selected text and returns the new text with the selection to restore. */
export function applyMarkdown(action: MarkdownAction, selection: TextSelection): TextSelection {
  switch (action) {
    case 'bold':
      return wrap(selection, '**', 'текст');
    case 'italic':
      return wrap(selection, '*', 'текст');
    case 'heading':
      return prefixLines(selection, '## ');
    case 'list':
      return prefixLines(selection, '- ');
    case 'link': {
      const { value, start, end } = selection;
      const label = value.slice(start, end) || 'ссылка';
      const next = `${value.slice(0, start)}[${label}](${LINK_PLACEHOLDER})${value.slice(end)}`;
      const urlStart = start + label.length + 3;
      return { value: next, start: urlStart, end: urlStart + LINK_PLACEHOLDER.length };
    }
  }
}
