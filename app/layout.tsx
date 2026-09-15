import type { Metadata, Viewport } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import { AppStateProvider } from "@/components/app-state";
import { AppShell } from "@/components/app-shell";
import { ChromeProvider } from "@/components/chrome";
import { BRAND, documentDescription, documentTitle } from "@/lib/branding";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f3d2b",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: documentTitle(),
  description: documentDescription(),
  applicationName: BRAND.appName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: BRAND.appName,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-h-dvh flex-col">
        <AppStateProvider>
          <ChromeProvider>
            <AppShell>{children}</AppShell>
          </ChromeProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
