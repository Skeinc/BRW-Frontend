# BRW Storefront

Coding rules for Claude Code in this repo. Stack and plan: `../docs/BRW-dev-plan.md`. Reference project: `../../Vespa/VESPA-Frontend`.

# Tests

No tests on the frontend: do not write unit, component or e2e tests, spec files, or test tooling, and do not add test steps to tasks, plans or acceptance criteria (same as the backend). Verify changes with `npm run typecheck`, `npm run lint`, `npm run format:check` and `npm run build`.

# Commands

- `npm run dev` — dev server on :8080 (SSR)
- `npm run build` / `npm start` — production build and Node server (`.output/server/index.mjs`)
- Env: `PUBLIC_API_URL` (browser), `API_INTERNAL_URL` (SSR server), `PUBLIC_SITE_URL` (canonical). See `.env.example`.

# FSD

TanStack Start (SSR). Layers, top to bottom: `app` → `pages` → `widgets` → `features` → `entities` → `shared`.

A module imports only from layers below it. Slices on the same layer do not import each other.

## Public API

- Each slice exposes one `index.ts`. Outside code imports only from that file.
- Inside a slice, import files directly. No nested barrel files.

## Layout

```
src/
  app/        # router factory, providers, global styles, i18n init
  routes/     # TanStack Router files (thin), server routes
  pages/      # one page per route, composition only
  widgets/    # large composed blocks (app-header, app-footer)
  features/   # one user action (search, sort, sign-in)
  entities/   # business entity types and queries (product, category)
  shared/
    ui/       # shadcn components (CLI only, add when used)
    api/      # http client
    lib/      # pure helpers (dates, tokens, cn) — not React UI
    config/
    i18n/
```

## Routes

`src/routes/` holds TanStack Router files. A route file only imports its page from `pages/`, declares `validateSearch` / `loader` / `head()`, and renders the page. No markup or logic beyond that. Server routes (`sitemap.xml`, `robots.txt`) live there too.

## Pages are composition only

`pages/<slice>/ui/<name>-page.tsx` wires route state, queries, and layout. Do not dump table columns, dialogs, charts, or badges into the page file.

Extract siblings under the same `ui/` folder (example: a products page):

- `product-page.tsx` — route state, queries, compose children
- `product-specs.tsx` — specs table
- `product-faq.tsx` — FAQ accordion
- `stock-badge.tsx` — small presentational pieces

## Shared lib helpers

Pure date/format/token utilities live in `shared/lib` (e.g. `format-date.ts`), not inside page or repository files. UI only calls them.

## Files

- kebab-case file and folder names.
- One component per file. Props interface may sit in the same file.
- Named exports. A default export is allowed only where `React.lazy` requires it.
- Do not scaffold slices for future roadmap work.

# React

React 19, TypeScript strict, TanStack Start (SSR), TanStack Router, Tailwind, shadcn/ui, TanStack Query, React Hook Form, Zod, i18next.

Functional components only. No class components, no HOCs, no render props.
Props interface is named `LoginFormProps`, not `Props`. No `any`. Use `unknown` only at a boundary, then narrow.
Destructure props. Components stay under 200 lines; extract when larger.
Do not add comments that restate the code.

## shadcn and styles

- shadcn primitives live in `src/shared/ui` as source, not as a runtime package.
- After `shadcn add`, the CLI writes `import { cn } from 'cn'` and installs the unrelated `cn` package: change the import to `@/shared/lib/utils` and `npm rm cn`.
- Keep only components that are used. Add or update UI primitives only via CLI: `npx shadcn@latest add <name>`. Never hand-copy components from docs or invent parallel shadcn wrappers.
- Project-only UI (e.g. `ThemeToggle`) may live in `shared/ui` alongside CLI output; do not replace registry components with hand-written copies.
- Style with Tailwind. Conditional classes go through `cn()`.
- Variants use `cva` from the shadcn component, not a parallel class map.
- Dialogs, inputs, and buttons come from `shared/ui`. Do not reimplement them.
- Mobile-first breakpoints. Interactive targets stay at least 44px.
- Light and dark themes via shadcn CSS variables and the `dark` class on `<html>`. Prefer semantic tokens (`bg-background`, `text-foreground`), not hardcoded `bg-white` / `bg-black`.
- Pages render on the server: no `window` / `localStorage` access during render. Read them in effects or behind `useSyncExternalStore` with a server snapshot.
- Theme preference may live in `localStorage` (UI only). Never store auth tokens there.

## Routing

- File-based routes in `src/routes`. Typed `Link` / `navigate`, never string-built URLs.
- Catalog filters, sorting and pagination live in URL search params, validated by a Zod schema in the route (`validateSearch`).
- Route components never hold filter state in `useState`.

## Images

- Product images: `loading="lazy"`, explicit `width` / `height`, `srcset` when available. The LCP image uses `fetchpriority="high"` and no lazy loading.

## Data

- Server state only through TanStack Query. No fetch inside components, no SWR.
- Query keys are arrays: `['user', 'me']`.
- The http client lives in `shared/api`, sends `credentials: 'include'`, reads errors as `{ code, message, details? }`, and uses `API_INTERNAL_URL` on the server and `PUBLIC_API_URL` in the browser.
- Do not store access tokens, refresh tokens, or passwords in `localStorage`, `sessionStorage`, or a client store.
- Zustand is not the default. Add a store only for client UI state that is not server data and not in the URL. Never persist auth in it.

## Forms and copy

- Forms use React Hook Form, Zod, and shadcn `Form`.
- Show loading, error, and empty states. Error text is user-facing, not a stack trace.
- Every user-visible string goes through i18next. Languages: `ru` (default), `en`, `be`; all three have the same keys. The visitor language lives in the `brw-lang` cookie and is read on the server, so SSR output is already in that language. In route `head()` use `translate(readHeadLanguage(matches), key)`. No hardcoded Russian in JSX.
- Associate labels with inputs. Field errors use `role="alert"`.

## Performance

- Do not wrap components in `memo`, `useMemo`, or `useCallback` by default. Add them when a render cost is real.

# SEO

- Every public page sets `title`, `description`, `canonical` and JSON-LD through `head()` in its route, so they are rendered on the server. No client-only document-title hooks.
- Filters and sorting never change the canonical; filter/sort URLs are `noindex, follow`. Page 2+ keeps its own canonical with `?page=`.
- A missing entity returns HTTP 404 (`notFound()` in the loader); an old slug found by `/api/seo/resolve` redirects with 301.
- One visible `<h1>` per page. Breadcrumbs mirror `BreadcrumbList` JSON-LD.
- Canonical URLs are built from `PUBLIC_SITE_URL`.

# Forms

Handle forms effectively:

1. Use controlled components for form state
2. Implement field-level validation
3. Show validation errors inline
4. Debounce validation for performance
5. Use form libraries for complex forms
6. Implement proper accessibility attributes
7. Handle submission loading states
8. Prevent double submissions
9. Zod must not emit default English messages — put i18n keys in the schema (`error: 'auth.validation.email'`) and translate at render with `translateFieldError` / `t(error.message)`
10. Server/API errors only through `getApiErrorMessage` — map by domain `code`, never show raw API `message` or branch on HTTP status in features

# DataTable

Use `DataTable` from `@/shared/ui` for list/table screens. Do not rebuild table + pagination + row menu from primitives.

## Loading (no layout jump)

- Use `placeholderData: keepPreviousData` when `queryKey` includes page / pageSize / filter.
- `isLoading={query.isPending}` — first load only (skeletons).
- `isRefreshing={query.isFetching && !query.isPending}` — dim rows, no layout jump.
- Toolbar / tabs stay mounted during refetch.

## Fixed viewport

- Body viewport is always ~10 rows tall (`sticky` header + scroll inside).
- Page sizes `10 | 25 | 50`: more than 10 rows on a page scroll inside the table container.
- Empty / error states keep the same viewport height; empty content is centered.

## Pagination

- Prefer `pagination={{ mode: 'server', page, pageSize, total, pageSizes, onPageChange, onPageSizeChange }}`.
- Reset `page` to `1` when filter or pageSize changes.
- Copy: `table.pagination.*` in i18n.

## Columns and actions

- Columns: `{ id, header, cell, className? }`.
- Actions: `{ id, label, onSelect, icon?, getIcon?, loading?, disabled?, hidden?, separatorBefore?, variant? }`.
- While `loading` is true for a row: show `Spinner` instead of `icon`/`getIcon`, disable the item.
- Stable `getRowId` (e.g. `` `${row.kind}-${row.id}` ``).

## Empty / error

- Pass `empty={{ title, description?, icon? }}` with i18n strings.
- API errors only through `getApiErrorMessage` into the `error` prop.
