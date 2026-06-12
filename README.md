# Find Your Partner

Веб-приложение для оценки совместимости пары через **Moral Foundations Theory** (Дж. Хайдт). Один пользователь:

1. Загружает свои тексты, переписки, скриншоты сообщений → ИИ строит «моральный профиль» по 6 основаниям (забота, справедливость, лояльность, авторитет, чистота, свобода).
2. Загружает аналогичные материалы потенциального партнёра.
3. Получает оценку совместимости + сильные/слабые места + темы для обсуждения.

## Стек

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** — mobile-first
- **Anthropic Claude** (`claude-sonnet-4-6`) — анализ текста и vision
- **IndexedDB** (через `idb`) — локальное хранение профиля в браузере

## Приватность

- Тексты и изображения уходят только в Anthropic API.
- На наших серверах ничего не сохраняется (никаких БД, никаких логов с пользовательским контентом).
- Профиль живёт только в браузере пользователя; кнопка «Очистить» удаляет всё.

## Запуск локально

```bash
npm install
cp .env.example .env.local
# впишите ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Откройте `http://localhost:3000`.

## Структура

```
src/
├── app/
│   ├── page.tsx              # лендинг
│   ├── profile/page.tsx      # построение своего профиля
│   ├── compare/page.tsx      # анализ партнёра + результат
│   └── api/
│       ├── analyze/route.ts  # POST: текст/картинки → MoralProfile
│       └── compare/route.ts  # POST: два профиля → отчёт
├── components/
│   ├── UploadArea.tsx
│   ├── ProfileCard.tsx
│   └── CompatibilityReport.tsx
└── lib/
    ├── types.ts
    ├── anthropic.ts
    ├── prompts.ts            # системные промпты + tool schemas
    └── profile-store.ts      # IndexedDB CRUD
```

## Деплой

Любая платформа с поддержкой Node.js: Vercel, Netlify, Railway, собственный сервер. Единственная переменная окружения — `ANTHROPIC_API_KEY`.
