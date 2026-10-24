# BRW-Frontend

Витрина и админка интернет-магазина мебели BRW (Black Red White). Стек: TanStack Start (SSR) + Router + Query, React 19, Tailwind 4, shadcn/ui, i18next (ru, be, en).

Документация проекта: `../docs/README.md`. API: `../BRW-Backend`.

## Быстрый старт

Нужны Node.js 24 и запущенный `BRW-Backend` (по умолчанию `http://localhost:3000`).

```bash
npm ci
cp .env.example .env
npm run dev          # http://localhost:8080
```

Весь стек в Docker (postgres, api, web) поднимается из `../BRW-Backend`: `docker compose up --build`.

## Переменные окружения

Читаются на сервере при каждом запуске и передаются в браузер через SSR-оболочку, поэтому один образ работает в любой среде (пересборка не нужна).

| Переменная | Назначение |
| --- | --- |
| `PUBLIC_API_URL` | адрес API для браузера (без `/api`) |
| `API_INTERNAL_URL` | адрес API для SSR-сервера (в Docker `http://api:3000`) |
| `PUBLIC_SITE_URL` | публичный адрес витрины: canonical, `sitemap.xml`, `robots.txt` |
| `PUBLIC_METRIKA_ID` | счётчик Яндекс.Метрики; пусто = аналитика выключена |
| `PUBLIC_GA4_ID` | GA4 (`G-XXXXXXXXXX`); пусто = выключена |

В `CORS_ORIGIN` бэкенда должен быть `PUBLIC_SITE_URL` витрины.

## Скрипты

| Скрипт | Назначение |
| --- | --- |
| `npm run dev` | dev-сервер на порту 8080 |
| `npm run build` | сборка в `.output/` и проверка типов |
| `npm start` | запуск собранного SSR-сервера |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `lint:fix` | oxlint |
| `npm run format` / `format:check` | prettier |
| `npm run check:bundle` | в основном бандле нет экранов админки |
| `npm run pre-commit` | prettier по staged → typecheck → lint (запускает husky) |

Тестов в проекте нет по решению проекта; качество проверяют `typecheck`, `lint`, `format:check`, `build` и `check:bundle`.

## Структура

Feature-Sliced Design: `app`, `routes` (тонкие файлы маршрутов), `pages`, `widgets`, `features`, `entities`, `shared`. Правила: `CLAUDE.md`.

Служебные маршруты: `/sitemap.xml` (из `GET /api/seo/urls`), `/robots.txt`. Админка живёт под `/admin` (закрыта `noindex`, загружается отдельным чанком).

## Ветки

`feature/*` → PR в `develop` → релиз: merge `develop` → `main` и тег `v1.0.0`. Коммиты: Conventional Commits. Перед коммитом husky запускает `npm run pre-commit`; перед PR выполните также `npm run format:check && npm run build && npm run check:bundle`.

## Как добавить товар

Товары заводятся в админке:

1. Откройте `/admin/login` и войдите (`ADMIN_EMAIL` и пароль из `.env` бэкенда).
2. «Категории»: создайте и опубликуйте категорию (до 3 уровней). Если нужна подборка, создайте коллекцию.
3. «Товары» → «Добавить»: название, категория, артикул (уникальный), цена, наличие, описание, атрибуты, SEO-поля.
4. Загрузите фото (jpeg, png, webp до 10 МБ); первое становится обложкой, порядок меняется перетаскиванием.
5. Включите «Опубликован». Товар сразу виден в каталоге, поиске и `sitemap.xml`, если опубликована вся цепочка его категорий.

## Docker

`Dockerfile` собирает SSR-сервер (Node 24, порт 8080); переменные из таблицы выше задаются при запуске контейнера.
