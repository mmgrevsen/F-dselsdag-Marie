import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { experience } from "@/config/experience";
import "./globals.css";

/** Display-font til plakattitler. Lokalt bundtet, med serif-fallback. */
const cinzel = localFont({
  src: "./fonts/cinzel-latin-wght-normal.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-cinzel",
  fallback: ["Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

/** Brødtekst-font: høj læsbarhed på mobil. */
const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

/** Brevfont: varm, klassisk og stadig let at læse. */
const garamond = localFont({
  src: [
    {
      path: "./fonts/eb-garamond-latin-wght-normal.woff2",
      weight: "400 800",
      style: "normal",
    },
    {
      path: "./fonts/eb-garamond-latin-wght-italic.woff2",
      weight: "400 800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-garamond",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  title: experience.meta.title,
  description: experience.meta.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#06050a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="da"
      className={`${cinzel.variable} ${inter.variable} ${garamond.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-ivory">{children}</body>
    </html>
  );
}
