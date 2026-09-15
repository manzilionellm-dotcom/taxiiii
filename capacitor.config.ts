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
    /** Any gap between two paints is the brand colour, never white. */
    backgroundColor: "#1f3d2b",
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
      /**
       * The app loads a remote page, so "ready" is a network event the native
       * splash cannot see. Rather than hold the splash on a plugin call that
       * would strand the user on a brand screen when the request fails, the
       * splash fades into the bridge page, which paints the same forest green
       * and owns the offline case. Three surfaces, one colour, no white flash.
       */
      launchShowDuration: 1400,
      launchAutoHide: true,
      launchFadeOutDuration: 320,
      backgroundColor: "#1f3d2b",
      showSpinner: false,
      androidSplashResourceName: "splash",
      splashFullScreen: false,
      splashImmersive: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#1f3d2b",
    },
  },
};

export default config;
