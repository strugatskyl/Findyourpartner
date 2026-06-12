"use client";

import {
  getAxes,
  getMethodology,
  getMethodologyName,
} from "@/lib/methodologies";
import type { ProfileData } from "@/lib/methodologies/shared-schema";
import { useLang } from "@/lib/i18n";

interface ProfileCardProps {
  methodologyId: string;
  profile: ProfileData;
  title?: string;
}

export default function ProfileCard({
  methodologyId,
  profile,
  title,
}: ProfileCardProps) {
  const { lang, t } = useLang();
  const methodology = getMethodology(methodologyId);
  const axes = getAxes(methodologyId);
  const axisLabel = (key: string) => {
    const axis = axes.find((a) => a.key === key);
    if (!axis) return key;
    return lang === "en" ? axis.en : axis.ru;
  };
  const axisHint = (key: string) =>
    axes.find((a) => a.key === key)?.hint ?? "";

  return (
    <div className="rounded-2xl bg-surface p-5 sm:p-6">
      {title && (
        <h2 className="mb-1 font-serif text-xl text-accent">{title}</h2>
      )}
      {methodology && (
        <div className="mb-4 text-xs uppercase tracking-wider text-muted">
          {getMethodologyName(methodology, lang)}
        </div>
      )}

      <div className="mb-5 space-y-2">
        {profile.axes.map((a) => (
          <div key={a.key}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-[#f3ede4]" title={axisHint(a.key)}>
                {axisLabel(a.key)}
              </span>
              <span className="text-muted">{Math.round(a.score)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${a.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-[#f3ede4]/90">
        {profile.summary}
      </p>

      {profile.quotes.length > 0 && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-muted hover:text-accent">
            {t("quotes", { n: profile.quotes.length })}
          </summary>
          <ul className="mt-2 space-y-2 text-[#f3ede4]/80">
            {profile.quotes.map((q, i) => (
              <li key={i} className="border-l-2 border-accent/40 pl-3">
                <div className="text-xs text-muted">{axisLabel(q.axis)}</div>
                <div className="italic">«{q.excerpt}»</div>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
