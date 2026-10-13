import type { Metadata, Viewport } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import { AppStateProvider } from "@/components/app-state";
import { AppShell } from "@/components/app-shell";
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
    metadataBase: new URL("https://taxiiii.vercel.app"),
    openGraph: { type: "website", siteName: "KörkortGO", title: "KörkortGO", images: [{ url: "https://taxiiii.vercel.app/social-share-v1.png", width: 1200, height: 630, alt: "KörkortGO" }] },
    twitter: { card: "summary_large_image", title: "KörkortGO", images: ["https://taxiiii.vercel.app/social-share-v1.png"] },
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
          <AppShell>{children}</AppShell>
        </AppStateProvider>
      </body>
    </html>
  );
}
