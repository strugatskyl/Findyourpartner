"use client";

import { useState } from "react";
import { getMethodology } from "@/lib/methodologies";
import { useLang } from "@/lib/i18n";

interface QuestionnaireProps {
  methodologyId: string;
  onSubmit: (text: string, images: File[]) => Promise<void>;
  busy: boolean;
  cta: string;
  showCopyButton?: boolean;
}

export default function Questionnaire({
  methodologyId,
  onSubmit,
  busy,
  cta,
  showCopyButton = false,
}: QuestionnaireProps) {
  const { lang, t } = useLang();
  const methodology = getMethodology(methodologyId);
  const questions = methodology?.questions[lang] ?? [];
  const [answers, setAnswers] = useState<string[]>(() =>
    new Array(questions.length).fill(""),
  );
  const [copied, setCopied] = useState(false);

  const answeredCount = answers.filter((a) => a.trim()).length;

  function setAnswer(idx: number, value: string) {
    setAnswers((prev) => prev.map((a, i) => (i === idx ? value : a)));
  }

  async function handleCopy() {
    const header = t("questionnaireCopyHeader");
    const body = questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
    await navigator.clipboard.writeText(`${header}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit() {
    if (busy || answeredCount === 0) return;
    const qaPairs = questions
      .map((q, i) =>
        answers[i].trim() ? `${t("questionLabel")}: ${q}\n${t("answerLabel")}: ${answers[i].trim()}` : null,
      )
      .filter(Boolean)
      .join("\n\n");
    const text = `${t("questionnaireSubmitHeader")}\n\n${qaPairs}`;
    await onSubmit(text, []);
  }

  if (!methodology) return null;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-[#f3ede4]/70">{t("questionnaireHint")}</p>

      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-xl border border-muted/40 px-4 py-3 text-sm text-[#f3ede4] hover:border-accent"
        >
          {copied ? t("copied") : t("copyQuestions")}
        </button>
      )}

      {questions.map((q, i) => (
        <div key={i} className="flex flex-col gap-2">
          <label className="text-sm leading-relaxed text-[#f3ede4]">
            <span className="mr-1 text-accent">{i + 1}.</span> {q}
          </label>
          <textarea
            value={answers[i]}
            onChange={(e) => setAnswer(i, e.target.value)}
            rows={3}
            disabled={busy}
            className="w-full resize-y rounded-xl bg-surface p-3 text-sm leading-relaxed text-[#f3ede4] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          />
        </div>
      ))}

      <div className="text-xs text-muted">
        {t("answeredCount", { a: answeredCount, n: questions.length })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={busy || answeredCount === 0}
        className="rounded-xl bg-accent px-4 py-4 text-base font-medium text-background hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? t("analyzing") : cta}
      </button>
    </div>
  );
}
