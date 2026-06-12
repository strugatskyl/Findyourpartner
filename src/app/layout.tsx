import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Find Your Partner",
  description:
    "Оценка совместимости пары через разные методологии — научные, психологические, мистические.",
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
        <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">{children}</div>
      </body>
    </html>
  );
}
