import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "О-комплекс — ИИ-Ассистент AmoCRM (Ответы + Допродажи)",
  description:
    "Production-ready сервис для AmoCRM: генерация вежливых ответов клиенту и умных подсказок по допродажам для менеджера",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
