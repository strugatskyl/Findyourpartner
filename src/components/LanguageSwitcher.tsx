"use client";

import { useLang, type Lang } from "@/lib/i18n";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "ru", label: "RU" },
  { value: "en", label: "EN" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex overflow-hidden rounded-full border border-muted/40 text-xs">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setLang(opt.value)}
          className={`px-3 py-1.5 font-medium tracking-wider transition ${
            lang === opt.value
              ? "bg-accent text-background"
              : "text-muted hover:text-accent"
          }`}
          aria-pressed={lang === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
