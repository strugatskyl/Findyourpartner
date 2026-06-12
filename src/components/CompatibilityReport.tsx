"use client";

import {
  getAxisLabel,
  getMethodology,
  getMethodologyName,
} from "@/lib/methodologies";
import type { ReportData } from "@/lib/methodologies/shared-schema";
import { useLang } from "@/lib/i18n";

interface ReportProps {
  methodologyId: string;
  report: ReportData;
}

export default function CompatibilityReportView({
  methodologyId,
  report,
}: ReportProps) {
  const { lang, t } = useLang();
  const methodology = getMethodology(methodologyId);
  const score = Math.round(report.overall_score);
  const scoreColor =
    score >= 70
      ? "text-green-400"
      : score >= 40
        ? "text-accent"
        : "text-red-400";

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-surface p-6 text-center">
        <div className="mb-1 text-sm uppercase tracking-wider text-muted">
          {t("compatibility")}
        </div>
        {methodology && (
          <div className="mb-2 text-xs text-muted">
            {t("via", { m: getMethodologyName(methodology, lang) })}
          </div>
        )}
        <div className={`text-6xl font-serif ${scoreColor}`}>{score}</div>
        <div className="mt-3 text-sm leading-relaxed text-[#f3ede4]/90">
          {report.verdict}
        </div>
      </div>

      <div className="rounded-2xl bg-surface p-5">
        <h3 className="mb-3 text-lg text-accent">{t("byAxes")}</h3>
        <div className="space-y-3">
          {report.axis_alignment.map((f) => {
            const delta = Math.round(f.delta);
            const intensity = Math.min(100, Math.abs(delta));
            return (
              <div key={f.axis}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{getAxisLabel(methodologyId, f.axis, lang)}</span>
                  <span className="text-muted">
                    {delta > 0 ? "+" : ""}
                    {delta}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-background">
                  <div
                    className={`h-full ${
                      intensity > 30 ? "bg-red-400/70" : "bg-accent"
                    }`}
                    style={{ width: `${intensity}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-[#f3ede4]/70">
                  {f.interpretation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Section title={t("strengths")} items={report.strengths} accent="green" />
      <Section title={t("risks")} items={report.risks} accent="red" />
      <Section
        title={t("talkAbout")}
        items={report.conversation_starters}
        accent="neutral"
      />
    </div>
  );
}

function Section({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: "green" | "red" | "neutral";
}) {
  const colors = {
    green: "border-green-400/40",
    red: "border-red-400/40",
    neutral: "border-accent/40",
  };
  return (
    <div className="rounded-2xl bg-surface p-5">
      <h3 className="mb-3 text-lg text-accent">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className={`border-l-2 pl-3 text-sm leading-relaxed text-[#f3ede4]/90 ${colors[accent]}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
