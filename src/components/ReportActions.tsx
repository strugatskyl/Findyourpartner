"use client";

import { useEffect, useState } from "react";
import {
  getAxisLabel,
  getMethodology,
  getMethodologyName,
} from "@/lib/methodologies";
import type {
  ProfileData,
  ReportData,
} from "@/lib/methodologies/shared-schema";
import { useLang } from "@/lib/i18n";

interface ReportActionsProps {
  methodologyId: string;
  report: ReportData;
  self: ProfileData;
  partner: ProfileData;
}

export default function ReportActions({
  methodologyId,
  report,
  self,
  partner,
}: ReportActionsProps) {
  const { lang, t } = useLang();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const methodology = getMethodology(methodologyId);
  const methodologyName = methodology
    ? getMethodologyName(methodology, lang)
    : methodologyId;
  const axisLabel = (key: string) => getAxisLabel(methodologyId, key, lang);
  const dateStr = new Date().toLocaleDateString(
    lang === "ru" ? "ru-RU" : "en-US",
  );

  function buildText(): string {
    const lines: string[] = [
      t("reportTitle"),
      `${t("methodologyLabel")}: ${methodologyName}`,
      `${t("dateLabel")}: ${dateStr}`,
      "",
      `${t("compatibility").toUpperCase()}: ${Math.round(report.overall_score)}/100`,
      "",
      report.verdict,
      "",
      `${t("byAxes").toUpperCase()}:`,
      ...report.axis_alignment.map((a) => {
        const d = Math.round(a.delta);
        return `• ${axisLabel(a.axis)}: ${d > 0 ? "+" : ""}${d} — ${a.interpretation}`;
      }),
      "",
      `${t("strengths").toUpperCase()}:`,
      ...report.strengths.map((s) => `• ${s}`),
      "",
      `${t("risks").toUpperCase()}:`,
      ...report.risks.map((s) => `• ${s}`),
      "",
      `${t("talkAbout").toUpperCase()}:`,
      ...report.conversation_starters.map((s) => `• ${s}`),
      "",
      `${t("yourProfileLabel").toUpperCase()}:`,
      ...self.axes.map((a) => `${axisLabel(a.key)}: ${Math.round(a.score)}`),
      "",
      self.summary,
      "",
      `${t("partnerProfileLabel").toUpperCase()}:`,
      ...partner.axes.map((a) => `${axisLabel(a.key)}: ${Math.round(a.score)}`),
      "",
      partner.summary,
    ];
    return lines.join("\n");
  }

  function esc(s: string): string {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function axisBarsHtml(profile: ProfileData): string {
    return profile.axes
      .map(
        (a) => `
      <div class="axis">
        <div class="axis-head"><span>${esc(axisLabel(a.key))}</span><span>${Math.round(a.score)}</span></div>
        <div class="bar"><div class="fill" style="width:${a.score}%"></div></div>
      </div>`,
      )
      .join("");
  }

  function listHtml(items: string[]): string {
    return items.map((i) => `<li>${esc(i)}</li>`).join("");
  }

  function buildHtml(): string {
    const score = Math.round(report.overall_score);
    return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t("reportTitle"))}</title>
<style>
  body { background:#0f0a1a; color:#f3ede4; font-family:Georgia,serif; max-width:680px; margin:0 auto; padding:24px; line-height:1.6; }
  h1 { color:#d4a574; font-size:1.4rem; }
  h2 { color:#d4a574; font-size:1.1rem; margin-top:2rem; }
  .meta { color:#8a7a9a; font-size:.85rem; }
  .score { font-size:4rem; color:#d4a574; text-align:center; margin:.5rem 0; }
  .verdict { background:#1a1228; border-radius:14px; padding:16px; }
  .axis { margin:.6rem 0; }
  .axis-head { display:flex; justify-content:space-between; font-size:.9rem; }
  .bar { height:8px; background:#0f0a1a; border:1px solid #2a2138; border-radius:99px; overflow:hidden; }
  .fill { height:100%; background:#d4a574; }
  ul { padding-left:1.2rem; }
  li { margin:.4rem 0; }
  .summary { color:#cfc7bb; font-size:.95rem; }
  .delta { color:#8a7a9a; }
</style>
</head>
<body>
<h1>${esc(t("reportTitle"))}</h1>
<div class="meta">${esc(t("methodologyLabel"))}: ${esc(methodologyName)} · ${esc(t("dateLabel"))}: ${esc(dateStr)}</div>
<div class="score">${score}</div>
<div class="verdict">${esc(report.verdict)}</div>

<h2>${esc(t("byAxes"))}</h2>
<ul>
${report.axis_alignment
  .map((a) => {
    const d = Math.round(a.delta);
    return `<li><strong>${esc(axisLabel(a.axis))}</strong> <span class="delta">(${d > 0 ? "+" : ""}${d})</span><br>${esc(a.interpretation)}</li>`;
  })
  .join("")}
</ul>

<h2>${esc(t("strengths"))}</h2>
<ul>${listHtml(report.strengths)}</ul>

<h2>${esc(t("risks"))}</h2>
<ul>${listHtml(report.risks)}</ul>

<h2>${esc(t("talkAbout"))}</h2>
<ul>${listHtml(report.conversation_starters)}</ul>

<h2>${esc(t("yourProfileLabel"))}</h2>
${axisBarsHtml(self)}
<p class="summary">${esc(self.summary)}</p>

<h2>${esc(t("partnerProfileLabel"))}</h2>
${axisBarsHtml(partner)}
<p class="summary">${esc(partner.summary)}</p>
</body>
</html>`;
  }

  function handleDownload() {
    const blob = new Blob([buildHtml()], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `findyourpartner-${methodologyId}-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: t("reportTitle"),
        text: buildText(),
      });
    } catch {
      // user cancelled the share sheet — not an error
    }
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <button
        type="button"
        onClick={handleDownload}
        className="rounded-xl border border-accent/50 px-4 py-3 text-sm text-[#f3ede4] hover:border-accent hover:bg-accent/10"
      >
        {t("downloadReport")}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-xl border border-muted/40 px-4 py-3 text-sm text-[#f3ede4] hover:border-accent"
      >
        {copied ? t("reportCopied") : t("copyReport")}
      </button>
      {canShare && (
        <button
          type="button"
          onClick={handleShare}
          className="rounded-xl border border-muted/40 px-4 py-3 text-sm text-[#f3ede4] hover:border-accent"
        >
          {t("shareReport")}
        </button>
      )}
    </div>
  );
}
