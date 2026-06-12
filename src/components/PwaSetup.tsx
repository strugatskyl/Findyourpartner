"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

const DISMISS_KEY = "fyp_install_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaSetup() {
  const { t } = useLang();
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failure is non-fatal
      });
    }

    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos) setShowIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") {
      setInstallEvent(null);
    }
    dismiss();
  }

  if (dismissed || (!installEvent && !showIosHint)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl p-3">
      <div className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-surface p-4 shadow-lg">
        <div className="flex-1 text-sm text-[#f3ede4]">
          {installEvent ? t("installAppText") : t("installIosHint")}
        </div>
        {installEvent && (
          <button
            type="button"
            onClick={install}
            className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent/90"
          >
            {t("installApp")}
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="shrink-0 text-lg text-muted hover:text-accent"
        >
          ×
        </button>
      </div>
    </div>
  );
}
