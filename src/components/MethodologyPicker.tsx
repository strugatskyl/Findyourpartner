"use client";

import { METHODOLOGIES } from "@/lib/methodologies";
import type { Category } from "@/lib/methodologies/types";

const CATEGORY_LABELS: Record<Category, { label: string; color: string }> = {
  science: { label: "Научно", color: "text-green-300 border-green-400/40" },
  psychology: { label: "Психология", color: "text-blue-300 border-blue-400/40" },
  mysticism: { label: "Мистика", color: "text-purple-300 border-purple-400/40" },
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
  return (
    <div className="grid grid-cols-1 gap-3">
      {METHODOLOGIES.map((m) => {
        const isSelected = selected === m.id;
        const isAvailable =
          !availableForCompare || availableForCompare.includes(m.id);
        const cat = CATEGORY_LABELS[m.category];
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
              <h3 className="font-serif text-lg text-[#f3ede4]">{m.ru}</h3>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${cat.color}`}
              >
                {cat.label}
              </span>
            </div>
            <p className="text-sm text-[#f3ede4]/70">{m.blurb}</p>
            {!isAvailable && (
              <p className="mt-2 text-xs text-muted">
                Сначала постройте свой профиль через эту методологию
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
