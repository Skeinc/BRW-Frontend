<div align="center">

# BRW Frontend

**Витрина и админка интернет-магазина мебели BRW (Black Red White), Могилёв**

[![Сайт](https://img.shields.io/badge/сайт-brw--market.by-e11d48?style=for-the-badge)](https://brw-market.by)

![TanStack Start](https://img.shields.io/badge/TanStack-Start%20SSR-FF4154?logo=reactquery&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)

[Сайт](https://brw-market.by) · [API (BRW-Backend)](https://github.com/Skeinc/BRW-Backend) · [Документация проекта](../docs/README.md)

</div>

---

## О проекте

Фронтенд магазина [brw-market.by](https://brw-market.by): публичная витрина с серверным рендерингом (SSR) и закрытая админка для управления каталогом, заявками и контентом. Данные приходят из [BRW-Backend](https://github.com/Skeinc/BRW-Backend).

## Возможности

**Витрина**
- Каталог с категориями, коллекциями, фильтрами и поиском, карточки товаров с галереей.
- Комнаты и готовые решения; для комнат «только консультация» (например, кухни) карточки коллекций с фото и «цена от».
- Корзина и оформление заявки, страницы «Рассрочка», «Доставка и оплата», FAQ, «О нас».
- Статьи и новости.
- Три языка интерфейса: русский, белорусский, английский (i18next).
- SEO: SSR, canonical, `sitemap.xml` и `robots.txt` из данных API, подключаемые по переменным Яндекс.Метрика и GA4, баннер согласия на cookie.

**Админка (`/admin`)**
- Аналитика, заявки со сменой статусов, категории (до 3 уровней), коллекции, товары, комнаты, готовые решения, статьи, новости, слайды, страницы «Рассрочка» и «Доставка и оплата», настройки.
- Загрузка фото с перетаскиванием порядка, первое фото становится обложкой.
- Закрыта `noindex`, грузится отдельным чанком и не попадает в основной бандл витрины (проверяет `npm run check:bundle`).

## Стек

| Слой | Технологии |
| --- | --- |
| Фреймворк | TanStack Start (SSR), TanStack Router, TanStack Query |
| UI | React 19, Tailwind 4, shadcn/ui (Radix), lucide-react, sonner |
| Формы и данные | react-hook-form, zod, libphonenumber-js |
| Контент | react-markdown, rehype-raw, rehype-sanitize |
| Админка | @dnd-kit (сортировка), recharts (графики) |
| Локализация | i18next, react-i18next (`ru`, `be`, `en`) |
| Сборка и качество | Vite 8, TypeScript, oxlint, prettier, husky |
| Инфраструктура | Docker (Node 24, порт 8080), GitHub Actions → GHCR → SSH-деплой |

## Быстрый старт

Нужны Node.js 24 и запущенный [BRW-Backend](https://github.com/Skeinc/BRW-Backend) (по умолчанию `http://localhost:3000`).

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

## Структура проекта

Feature-Sliced Design:

```text
src/
  app/         провайдеры, инициализация
  routes/      тонкие файлы маршрутов TanStack Router
  pages/       страницы (home, catalog, category, collection, cart, checkout,
               articles, news, installment, delivery-and-payment, faq, admin-*)
  widgets/     крупные блоки (header, footer, hero, каталог, слайдер, ...)
  features/    пользовательские сценарии (add-to-cart, place-order,
               switch-language, upsert-product, ...)
  entities/    бизнес-сущности и их API
  shared/      UI-кит, i18n (ru, be, en), утилиты
```

Служебные маршруты: `/sitemap.xml` (из `GET /api/seo/urls`) и `/robots.txt`. Правила кода: [CLAUDE.md](CLAUDE.md).

## Как добавить товар

Товары заводятся в админке:

1. Откройте `/admin/login` и войдите (`ADMIN_LOGIN` и пароль из `.env` бэкенда).
2. «Категории»: создайте и опубликуйте категорию (до 3 уровней). Если нужна подборка, создайте коллекцию.
3. «Товары» → «Добавить»: название, категория, артикул (уникальный), цена, наличие, описание, атрибуты, SEO-поля.
4. Загрузите фото (jpeg, png, webp до 10 МБ); первое становится обложкой, порядок меняется перетаскиванием.
5. Включите «Опубликован». Товар сразу виден в каталоге, поиске и `sitemap.xml`, если опубликована вся цепочка его категорий.

## Деплой

`Dockerfile` собирает SSR-сервер (Node 24, порт 8080); переменные из таблицы выше задаются при запуске контейнера. Production работает на VPS в Беларуси за Caddy (HTTPS), одним хостом с API: `/api/*` идёт в API, `/media/*` отдаётся с диска, остальное в этот SSR-сервер.

Push в релизную ветку запускает GitHub Actions: сборка образа, публикация в GHCR (`ghcr.io/skeinc/brw-frontend`), SSH на сервер, обновление контейнера `web`. Production-стек (`docker-compose.prod.yml`, Caddy, бэкапы) лежит в [BRW-Backend](https://github.com/Skeinc/BRW-Backend). Пошагово: [docs/DEPLOY.md](../docs/DEPLOY.md).

## Разработка

- Ветки: `feature/*` → PR в `develop` → релизная ветка. Прямых коммитов в `develop` и `main` нет.
- Коммиты: Conventional Commits.
- Перед коммитом husky запускает `npm run pre-commit`; перед PR выполните также `npm run format:check && npm run build && npm run check:bundle`.
- CI на PR в `develop`: `typecheck`, `lint`, `format:check`.

## Документация

| Документ | О чём |
| --- | --- |
| [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) | компоненты, потоки данных, модель данных |
| [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md) | локальный запуск и процесс разработки |
| [docs/DEPLOY.md](../docs/DEPLOY.md) | сервер, CI/CD, откат, бэкапы |
| [docs/SEO-LAUNCH.md](../docs/SEO-LAUNCH.md) | чек-лист запуска и SEO |

---

<div align="center">

Сайт: **[brw-market.by](https://brw-market.by)** · Бэкенд: **[BRW-Backend](https://github.com/Skeinc/BRW-Backend)**

</div>
