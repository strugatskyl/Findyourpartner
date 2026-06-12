"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MethodologyPicker from "@/components/MethodologyPicker";
import ProfileCard from "@/components/ProfileCard";
import UploadArea from "@/components/UploadArea";
import { METHODOLOGIES } from "@/lib/methodologies";
import {
  clearAll,
  loadProfile,
  saveProfile,
  type StoredProfile,
} from "@/lib/profile-store";

export default function ProfilePage() {
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
      images.forEach((img) => fd.append("images", img));

      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");

      const stored = data.profile as StoredProfile;
      await saveProfile("me", methodologyId, stored);
      setProfile(stored);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
    } finally {
      setBusy(false);
    }
  }

  async function handleClearAll() {
    if (!confirm("Удалить ВСЕ ваши профили из браузера?")) return;
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
          ← На главную
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-accent sm:text-3xl">
          Мой профиль
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
            ← Сменить методологию ({selectedMethodology.ru})
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
          <p className="text-sm text-[#f3ede4]/80">
            Выберите «линзу», через которую ИИ будет смотреть на ваши тексты.
            Можно построить несколько профилей в разных методологиях.
          </p>
          <MethodologyPicker
            selected={methodologyId}
            onSelect={(id) => setMethodologyId(id)}
          />
        </>
      )}

      {step === "upload" && methodologyId && (
        <>
          <p className="text-sm text-[#f3ede4]/80">
            Загрузите ваши собственные тексты или сообщения. Чем больше
            материала — тем точнее анализ. Минимум ~300 слов или несколько
            скриншотов.
          </p>
          <UploadArea
            onSubmit={handleAnalyze}
            busy={busy}
            cta="Построить мой профиль"
            placeholder="Вставьте свои сообщения, эссе, посты, переписки…"
          />
        </>
      )}

      {step === "result" && methodologyId && profile && (
        <>
          <ProfileCard
            methodologyId={methodologyId}
            profile={profile.data}
            title="Ваш профиль"
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              href={`/compare?m=${methodologyId}`}
              className="rounded-xl bg-accent px-4 py-4 text-center text-base font-medium text-background hover:bg-accent/90"
            >
              Проверить совместимость →
            </Link>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-xl border border-muted/40 px-4 py-4 text-base text-[#f3ede4] hover:border-red-400 hover:text-red-300"
            >
              Очистить мои данные
            </button>
          </div>
          <details className="rounded-xl border border-muted/30 p-4 text-sm">
            <summary className="cursor-pointer text-muted hover:text-accent">
              Пересоздать профиль на новых текстах
            </summary>
            <div className="mt-4">
              <UploadArea
                onSubmit={handleAnalyze}
                busy={busy}
                cta="Проанализировать заново"
              />
            </div>
          </details>
        </>
      )}
    </main>
  );
}
