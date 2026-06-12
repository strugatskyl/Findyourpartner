import Link from "next/link";
import { METHODOLOGIES } from "@/lib/methodologies";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="font-serif text-4xl text-accent sm:text-5xl">
          Find Your Partner
        </h1>
        <p className="mt-3 text-base text-[#f3ede4]/80">
          Совместимость пары через {METHODOLOGIES.length} методологии — от
          научной психологии до Каббалы.
        </p>
      </header>

      <section className="rounded-2xl bg-surface p-6 leading-relaxed">
        <h2 className="mb-3 text-xl text-accent">Как это работает</h2>
        <ol className="ml-5 list-decimal space-y-2 text-[#f3ede4]/90">
          <li>
            Загружаете свои тексты, переписки, скриншоты сообщений — ИИ строит
            ваш профиль.
          </li>
          <li>
            Выбираете «линзу»: Moral Foundations, Big Five, стили привязанности,
            10 сфирот Зоар или астро-вайб.
          </li>
          <li>
            Загружаете тексты партнёра — получаете оценку совместимости с
            конкретными зонами риска и темами для обсуждения.
          </li>
          <li>
            Хотите сменить призму? Перестройте профиль через другую методологию
            на тех же текстах.
          </li>
        </ol>
      </section>

      <Link
        href="/profile"
        className="rounded-xl bg-accent px-4 py-4 text-center text-base font-medium text-background hover:bg-accent/90"
      >
        Начать →
      </Link>

      <section className="rounded-2xl border border-muted/30 p-5 text-sm leading-relaxed text-muted">
        <h3 className="mb-2 text-[#f3ede4]">Что с приватностью</h3>
        <p>
          Ваши тексты и переписки уходят только в Anthropic Claude API для
          анализа и не сохраняются на наших серверах. Профиль живёт только в
          вашем браузере (IndexedDB) — кнопка «Очистить» на странице профиля
          удаляет его.
        </p>
      </section>
    </main>
  );
}
