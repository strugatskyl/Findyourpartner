"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import CompatibilityReportView from "@/components/CompatibilityReport";
import MethodologyPicker from "@/components/MethodologyPicker";
import ProfileCard from "@/components/ProfileCard";
import UploadArea from "@/components/UploadArea";
import { METHODOLOGIES } from "@/lib/methodologies";
import {
  listMyMethodologies,
  loadProfile,
  type StoredProfile,
} from "@/lib/profile-store";
import type { ReportData } from "@/lib/methodologies/shared-schema";

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <CompareInner />
    </Suspense>
  );
}

interface StoredReport {
  methodology_id: string;
  data: ReportData;
  created_at: string;
}

function CompareInner() {
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

  useEffect(() => {
    listMyMethodologies().then((ids) => {
      setAvailable(ids);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!methodologyId) {
      setSelf(null);
      return;
    }
    loadProfile("me", methodologyId).then((p) => setSelf(p));
  }, [methodologyId]);

  async function analyzePartner(text: string, images: File[]) {
    if (!methodologyId || !self) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("methodology_id", methodologyId);
      fd.append("text", text);
      images.forEach((img) => fd.append("images", img));

      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");

      const partnerProfile = data.profile as StoredProfile;
      setPartner(partnerProfile);

      const cmpRes = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          methodology_id: methodologyId,
          self: self.data,
          partner: partnerProfile.data,
        }),
      });
      const cmpData = await cmpRes.json();
      if (!cmpRes.ok) throw new Error(cmpData.error ?? "Ошибка сравнения");
      setReport(cmpData.report as StoredReport);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPartner(null);
    setReport(null);
    setError(null);
  }

  if (!loaded) return null;

  if (available.length === 0) {
    return (
      <main className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-muted hover:text-accent">
          ← На главную
        </Link>
        <h1 className="font-serif text-2xl text-accent">Сначала ваш профиль</h1>
        <p className="text-[#f3ede4]/80">
          Чтобы сравнить кого-то с вами, сначала постройте хотя бы один
          собственный профиль.
        </p>
        <Link
          href="/profile"
          className="rounded-xl bg-accent px-4 py-4 text-center text-base font-medium text-background hover:bg-accent/90"
        >
          Создать мой профиль →
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
            ← К моему профилю
          </Link>
          <h1 className="mt-2 font-serif text-2xl text-accent sm:text-3xl">
            Через какую призму смотрим?
          </h1>
          <p className="mt-2 text-sm text-[#f3ede4]/80">
            Сравнение работает только в методологиях, через которые вы уже
            построили свой профиль.
          </p>
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
          ← К моему профилю
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-accent sm:text-3xl">
          Совместимость
        </h1>
        {selectedMethodology && (
          <button
            type="button"
            onClick={() => {
              setMethodologyId(null);
              reset();
            }}
            className="mt-1 text-sm text-muted hover:text-accent"
          >
            ← Сменить методологию ({selectedMethodology.ru})
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
            Загрузите тексты или скриншоты переписок партнёра. ИИ построит его
            профиль через ту же призму и сравнит с вашим.
          </p>
          <UploadArea
            onSubmit={analyzePartner}
            busy={busy}
            cta="Проанализировать и сравнить"
            placeholder="Вставьте сюда тексты партнёра…"
          />
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
              title="Вы"
            />
            <ProfileCard
              methodologyId={methodologyId}
              profile={partner.data}
              title="Партнёр"
            />
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-muted/40 px-4 py-3 text-sm text-[#f3ede4] hover:border-accent"
          >
            Проверить другого человека
          </button>
        </>
      )}
    </main>
  );
}
