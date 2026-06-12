"use client";

import {
  METHODOLOGIES,
  getMethodologyBlurb,
  getMethodologyName,
} from "@/lib/methodologies";
import type { Category } from "@/lib/methodologies/types";
import { useLang, type DictKey } from "@/lib/i18n";

const CATEGORY_META: Record<Category, { key: DictKey; color: string }> = {
  science: { key: "catScience", color: "text-green-300 border-green-400/40" },
  psychology: { key: "catPsychology", color: "text-blue-300 border-blue-400/40" },
  mysticism: { key: "catMysticism", color: "text-purple-300 border-purple-400/40" },
};

interface MethodologyPickerProps {
  selected: string | null;
  onSelect: (id: string) => void;
  availableForCompare?: string[];
}

export default function MethodologyPicker({
  selected,
  onSelect,
  availableForCompare,
}: MethodologyPickerProps) {
  const { lang, t } = useLang();

  return (
    <div className="grid grid-cols-1 gap-3">
      {METHODOLOGIES.map((m) => {
        const isSelected = selected === m.id;
        const isAvailable =
          !availableForCompare || availableForCompare.includes(m.id);
        const cat = CATEGORY_META[m.category];
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => isAvailable && onSelect(m.id)}
            disabled={!isAvailable}
            className={`group rounded-2xl border p-4 text-left transition ${
              isSelected
                ? "border-accent bg-accent/10"
                : isAvailable
                  ? "border-muted/30 bg-surface hover:border-accent/60"
                  : "border-muted/20 bg-surface/50 opacity-50"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="font-serif text-lg text-[#f3ede4]">
                {getMethodologyName(m, lang)}
              </h3>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${cat.color}`}
              >
                {t(cat.key)}
              </span>
            </div>
            <p className="text-sm text-[#f3ede4]/70">
              {getMethodologyBlurb(m, lang)}
            </p>
            {!isAvailable && (
              <p className="mt-2 text-xs text-muted">{t("needFirstProfile")}</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
