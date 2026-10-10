import type { Metadata, Viewport } from "next";
import { Caveat, Cinzel, Cormorant_Garamond, Manrope } from "next/font/google";
import { birthdayConfig } from "@/config/birthday";
import "./globals.css";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  fallback: ["Trajan Pro", "Optima", "Times New Roman", "serif"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Garamond", "Baskerville", "Georgia", "serif"],
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  fallback: ["Segoe Print", "Bradley Hand", "Comic Sans MS", "cursive"],
});

export const metadata: Metadata = {
  title: birthdayConfig.meta.title,
  description: birthdayConfig.meta.description,
  // A private birthday surprise – keep it out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070405",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="da"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${hand.variable} antialiased`}
    >
      <body>
        {children}
        <noscript>
          <p className="noscript-message">
            Slå JavaScript til i din browser for at se din hemmelige besked.
          </p>
        </noscript>
      </body>
    </html>
  );
}
