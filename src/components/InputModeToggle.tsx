"use client";

import { useLang } from "@/lib/i18n";

export type InputMode = "questions" | "freetext";

interface InputModeToggleProps {
  mode: InputMode;
  onChange: (mode: InputMode) => void;
}

export default function InputModeToggle({
  mode,
  onChange,
}: InputModeToggleProps) {
  const { t } = useLang();

  return (
    <div className="grid grid-cols-2 gap-2">
      {(
        [
          ["questions", t("modeQuestions")],
          ["freetext", t("modeFreeText")],
        ] as const
      ).map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`rounded-xl border px-4 py-3 text-sm transition ${
            mode === value
              ? "border-accent bg-accent/10 text-[#f3ede4]"
              : "border-muted/30 text-muted hover:border-accent/60"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
