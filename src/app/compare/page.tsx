"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import CompatibilityReportView from "@/components/CompatibilityReport";
import InputModeToggle, { type InputMode } from "@/components/InputModeToggle";
import MethodologyPicker from "@/components/MethodologyPicker";
import ProfileCard from "@/components/ProfileCard";
import Questionnaire from "@/components/Questionnaire";
import UploadArea from "@/components/UploadArea";
import { METHODOLOGIES, getMethodologyName } from "@/lib/methodologies";
import { useLang } from "@/lib/i18n";
import {
  deleteProfile,
  deleteReport,
  listMyMethodologies,
  loadProfile,
  loadReport,
  saveProfile,
  saveReport,
  type StoredProfile,
  type StoredReport,
} from "@/lib/profile-store";

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <CompareInner />
    </Suspense>
  );
}

function CompareInner() {
  const { lang, t } = useLang();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("m");

  const [methodologyId, setMethodologyId] = useState<string | null>(initialId);
  const [available, setAvailable] = useState<string[]>([]);
  const [self, setSelf] = useState<StoredProfile | null>(null);
  const [partner, setPartner] = useState<StoredProfile | null>(null);
  const [report, setReport] = useState<StoredReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("freetext");

  useEffect(() => {
    listMyMethodologies().then((ids) => {
      setAvailable(ids);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!methodologyId) {
      setSelf(null);
      setPartner(null);
      setReport(null);
      return;
    }
    let cancelled = false;
    Promise.all([
      loadProfile("me", methodologyId),
      loadProfile("partner", methodologyId),
      loadReport(methodologyId),
    ]).then(([myProfile, partnerProfile, savedReport]) => {
      if (cancelled) return;
      setSelf(myProfile);
      setPartner(partnerProfile);
      setReport(savedReport);
    });
    return () => {
      cancelled = true;
    };
  }, [methodologyId]);

  async function analyzePartner(text: string, images: File[]) {
    if (!methodologyId || !self) return;
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

      const partnerProfile = data.profile as StoredProfile;
      setPartner(partnerProfile);
      await saveProfile("partner", methodologyId, partnerProfile);

      const cmpRes = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          methodology_id: methodologyId,
          self: self.data,
          partner: partnerProfile.data,
          lang,
        }),
      });
      const cmpData = await cmpRes.json();
      if (!cmpRes.ok) throw new Error(cmpData.error ?? t("compareError"));
      const newReport = cmpData.report as StoredReport;
      setReport(newReport);
      await saveReport(methodologyId, newReport);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("unknownError"));
    } finally {
      setBusy(false);
    }
  }

  function resetLocal() {
    setPartner(null);
    setReport(null);
    setError(null);
  }

  async function checkAnother() {
    setPartner(null);
    setReport(null);
    setError(null);
    if (methodologyId) {
      await Promise.all([
        deleteProfile("partner", methodologyId),
        deleteReport(methodologyId),
      ]);
    }
  }

  if (!loaded) return null;

  if (available.length === 0) {
    return (
      <main className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-muted hover:text-accent">
          {t("backHome")}
        </Link>
        <h1 className="font-serif text-2xl text-accent">
          {t("firstProfileTitle")}
        </h1>
        <p className="text-[#f3ede4]/80">{t("firstProfileText")}</p>
        <Link
          href="/profile"
          className="rounded-xl bg-accent px-4 py-4 text-center text-base font-medium text-background hover:bg-accent/90"
        >
          {t("createProfile")}
        </Link>
      </main>
    );
  }

  const selectedMethodology = METHODOLOGIES.find((m) => m.id === methodologyId);

  if (!methodologyId || !available.includes(methodologyId)) {
    return (
      <main className="flex flex-col gap-6">
        <header>
          <Link href="/profile" className="text-sm text-muted hover:text-accent">
            {t("toMyProfile")}
          </Link>
          <h1 className="mt-2 font-serif text-2xl text-accent sm:text-3xl">
            {t("whichLens")}
          </h1>
          <p className="mt-2 text-sm text-[#f3ede4]/80">{t("lensOnlyBuilt")}</p>
        </header>
        <MethodologyPicker
          selected={methodologyId}
          onSelect={(id) => setMethodologyId(id)}
          availableForCompare={available}
        />
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6">
      <header>
        <Link href="/profile" className="text-sm text-muted hover:text-accent">
          {t("toMyProfile")}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-accent sm:text-3xl">
          {t("compatTitle")}
        </h1>
        {selectedMethodology && (
          <button
            type="button"
            onClick={() => {
              setMethodologyId(null);
              resetLocal();
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

      {!report && (
        <>
          <p className="text-sm text-[#f3ede4]/80">
            {t("questionnaireHintPartner")}
          </p>
          <InputModeToggle mode={inputMode} onChange={setInputMode} />
          {inputMode === "questions" ? (
            <Questionnaire
              methodologyId={methodologyId}
              onSubmit={analyzePartner}
              busy={busy}
              cta={t("analyzeCompare")}
              showCopyButton
            />
          ) : (
            <UploadArea
              onSubmit={analyzePartner}
              busy={busy}
              cta={t("analyzeCompare")}
              placeholder={t("partnerPlaceholder")}
            />
          )}
        </>
      )}

      {report && partner && self && (
        <>
          <CompatibilityReportView
            methodologyId={methodologyId}
            report={report.data}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileCard
              methodologyId={methodologyId}
              profile={self.data}
              title={t("you")}
            />
            <ProfileCard
              methodologyId={methodologyId}
              profile={partner.data}
              title={t("partner")}
            />
          </div>
          <button
            type="button"
            onClick={checkAnother}
            className="rounded-xl border border-muted/40 px-4 py-3 text-sm text-[#f3ede4] hover:border-accent"
          >
            {t("checkAnother")}
          </button>
        </>
      )}
    </main>
  );
}
