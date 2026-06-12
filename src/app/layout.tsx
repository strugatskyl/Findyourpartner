import type { Metadata, Viewport } from "next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PwaSetup from "@/components/PwaSetup";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "Find Your Partner",
  description:
    "Оценка совместимости пары через разные методологии — научные, психологические, мистические. / Couple compatibility through scientific, psychological and mystical lenses.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FindPartner",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f0a1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen font-serif">
        <LangProvider>
          <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
            <div className="mb-4 flex justify-end">
              <LanguageSwitcher />
            </div>
            {children}
          </div>
          <PwaSetup />
        </LangProvider>
      </body>
    </html>
  );
}
