"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1347647340858998";

export const COOKIE_PREFERENCE_KEY = "kreluna-cookie-choice";
export const CONSENT_CHANGE_EVENT = "kreluna-consent-change";

type MetaPixelFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
    __krelunaMetaPixelInitialized?: boolean;
    __krelunaMetaLastPage?: string;
  }
}

function hasMarketingConsent() {
  try {
    return window.localStorage.getItem(COOKIE_PREFERENCE_KEY) === "accepted";
  } catch {
    return false;
  }
}

function initialisePixel() {
  if (!META_PIXEL_ID || window.__krelunaMetaPixelInitialized || !hasMarketingConsent()) return;

  const fbq: MetaPixelFunction = (...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.dataset.krelunaMetaPixel = META_PIXEL_ID;
  document.head.appendChild(script);

  fbq("init", META_PIXEL_ID);
  window.__krelunaMetaPixelInitialized = true;
}

function trackPageView(pathname: string) {
  initialisePixel();
  if (!window.fbq || window.__krelunaMetaLastPage === pathname) return;
  window.fbq("track", "PageView");
  window.__krelunaMetaLastPage = pathname;
}

export function trackVelvetLead(audience: "customer" | "restaurant") {
  if (!hasMarketingConsent()) return;
  initialisePixel();
  window.fbq?.("track", "Lead", {
    content_name: "Velvet Table waitlist",
    content_category: audience === "restaurant" ? "restaurant" : "customer",
  });
}

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    const page = pathname || window.location.pathname;
    trackPageView(page);

    const onConsentChange = (event: Event) => {
      const choice = (event as CustomEvent<{ choice?: string }>).detail?.choice;
      if (choice === "accepted") trackPageView(page);
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
  }, [pathname]);

  return null;
}
