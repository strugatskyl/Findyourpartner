"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MethodologyPicker from "@/components/MethodologyPicker";
import ProfileCard from "@/components/ProfileCard";
import UploadArea from "@/components/UploadArea";
import { METHODOLOGIES, getMethodologyName } from "@/lib/methodologies";
import { useLang } from "@/lib/i18n";
import {
  clearAll,
  loadProfile,
  saveProfile,
  type StoredProfile,
} from "@/lib/profile-store";

export default function ProfilePage() {
  const { lang, t } = useLang();
  const [methodologyId, setMethodologyId] = useState<string | null>(null);
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"pick" | "upload" | "result">("pick");

  useEffect(() => {
    if (!methodologyId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    loadProfile("me", methodologyId).then((p) => {
      if (cancelled) return;
      setProfile(p);
      setStep(p ? "result" : "upload");
    });
    return () => {
      cancelled = true;
    };
  }, [methodologyId]);

  async function handleAnalyze(text: string, images: File[]) {
    if (!methodologyId) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("methodology_id", methodologyId);
      fd.append("text", text);
      fd.append("lang", lang);
      images.forEach((img) => fd.append("images", img));

      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("errorGeneric"));

      const stored = data.profile as StoredProfile;
      await saveProfile("me", methodologyId, stored);
      setProfile(stored);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("unknownError"));
    } finally {
      setBusy(false);
    }
  }

  async function handleClearAll() {
    if (!confirm(t("confirmClear"))) return;
    await clearAll();
    setProfile(null);
    setMethodologyId(null);
    setStep("pick");
  }

  const selectedMethodology = METHODOLOGIES.find((m) => m.id === methodologyId);

  return (
    <main className="flex flex-col gap-6">
      <header>
        <Link href="/" className="text-sm text-muted hover:text-accent">
          {t("backHome")}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-accent sm:text-3xl">
          {t("myProfile")}
        </h1>
        {step !== "pick" && selectedMethodology && (
          <button
            type="button"
            onClick={() => {
              setMethodologyId(null);
              setStep("pick");
            }}
            className="mt-1 text-sm text-muted hover:text-accent"
          >
            {t("changeMethodology", {
              m: getMethodologyName(selectedMethodology, lang),
            })}
          </button>
        )}
      </header>

      {error && (
        <div className="rounded-xl border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {step === "pick" && (
        <>
          <p className="text-sm text-[#f3ede4]/80">{t("pickLensText")}</p>
          <MethodologyPicker
            selected={methodologyId}
            onSelect={(id) => setMethodologyId(id)}
          />
        </>
      )}

      {step === "upload" && methodologyId && (
        <>
          <p className="text-sm text-[#f3ede4]/80">{t("uploadHint")}</p>
          <UploadArea
            onSubmit={handleAnalyze}
            busy={busy}
            cta={t("buildProfile")}
            placeholder={t("selfPlaceholder")}
          />
        </>
      )}

      {step === "result" && methodologyId && profile && (
        <>
          <ProfileCard
            methodologyId={methodologyId}
            profile={profile.data}
            title={t("yourProfile")}
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              href={`/compare?m=${methodologyId}`}
              className="rounded-xl bg-accent px-4 py-4 text-center text-base font-medium text-background hover:bg-accent/90"
            >
              {t("checkCompat")}
            </Link>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-xl border border-muted/40 px-4 py-4 text-base text-[#f3ede4] hover:border-red-400 hover:text-red-300"
            >
              {t("clearData")}
            </button>
          </div>
          <details className="rounded-xl border border-muted/30 p-4 text-sm">
            <summary className="cursor-pointer text-muted hover:text-accent">
              {t("recreateProfile")}
            </summary>
            <div className="mt-4">
              <UploadArea
                onSubmit={handleAnalyze}
                busy={busy}
                cta={t("reanalyze")}
              />
            </div>
          </details>
        </>
      )}
    </main>
  );
}
