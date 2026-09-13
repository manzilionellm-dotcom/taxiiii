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
