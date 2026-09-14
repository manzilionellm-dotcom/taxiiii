import type { CapacitorConfig } from "@capacitor/cli";
import { BRAND } from "./lib/branding";

const serverUrl =
  process.env.CAPACITOR_SERVER_URL?.trim() || BRAND.native.serverUrl;

const config: CapacitorConfig = {
  appId: BRAND.native.appId,
  appName: BRAND.appName,
  webDir: "native-www",
  server: {
    url: serverUrl,
    androidScheme: "https",
    allowNavigation: ["taxiiii.vercel.app", "*.vercel.app"],
  },
  android: {
    allowMixedContent: false,
    /**
     * targetSdk 35 forces edge-to-edge on Android 15+, and an Android WebView
     * reports env(safe-area-inset-*) for display cutouts only — never for the
     * status bar or the navigation bar. With the Capacitor default ("disable")
     * the header and the bottom nav therefore sat under the system bars.
     * "auto" lets Capacitor inset the WebView by the real system-bar insets.
     */
    adjustMarginsForEdgeToEdge: "auto",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#1f3d2b",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#1f3d2b",
    },
  },
};

export default config;
