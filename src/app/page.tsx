"use client";

import Link from "next/link";
import { METHODOLOGIES } from "@/lib/methodologies";
import { useLang } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useLang();

  return (
    <main className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="font-serif text-4xl text-accent sm:text-5xl">
          Find Your Partner
        </h1>
        <p className="mt-3 text-base text-[#f3ede4]/80">
          {t("tagline", { n: METHODOLOGIES.length })}
        </p>
      </header>

      <section className="rounded-2xl bg-surface p-6 leading-relaxed">
        <h2 className="mb-3 text-xl text-accent">{t("howItWorks")}</h2>
        <ol className="ml-5 list-decimal space-y-2 text-[#f3ede4]/90">
          <li>{t("step1")}</li>
          <li>{t("step2")}</li>
          <li>{t("step3")}</li>
          <li>{t("step4")}</li>
        </ol>
      </section>

      <Link
        href="/profile"
        className="rounded-xl bg-accent px-4 py-4 text-center text-base font-medium text-background hover:bg-accent/90"
      >
        {t("start")}
      </Link>

      <section className="rounded-2xl border border-muted/30 p-5 text-sm leading-relaxed text-muted">
        <h3 className="mb-2 text-[#f3ede4]">{t("privacyTitle")}</h3>
        <p>{t("privacyText")}</p>
      </section>
    </main>
  );
}
