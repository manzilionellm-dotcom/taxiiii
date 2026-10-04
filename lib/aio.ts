import config from "../aio.config.json";

type Faq = { q: string; a: string };
type Plan = {
  id: string;
  price: number | null;
  durationDays: number | null;
  name: Record<string, string>;
};
type Tutorial = {
  id: string;
  name: string;
  description: string;
  steps: { name: string; text: string }[];
};

type Lang = keyof typeof config.i18n;

export const aio = config;
export const defaultLang = config.defaultLang as Lang;

export function faqFor(lang: Lang = defaultLang) {
  return config.i18n[lang].faq;
}

/**
 * Schema.org JSON-LD rendered on the server.
 * Product is omitted when plans is null. HowTo is omitted when tutorials is null.
 */
export function buildJsonLd(lang: Lang = defaultLang) {
  const url = config.siteUrl;
  const copy = config.i18n[lang];
  const org = {
    "@type": "Organization",
    "@id": `${url}/#org`,
    name: config.siteName,
    url,
  };
  const plans = (config.plans ?? []) as Plan[];
  const products = plans
    .filter((plan) => typeof plan.price === "number" && plan.name?.[lang])
    .map((plan) => ({
      "@type": "Product",
      "@id": `${url}/#product-${plan.id}`,
      name: `${config.siteName} – ${plan.name[lang]}`,
      description: (copy.productDescription ?? "").replace("{name}", plan.name[lang]),
      brand: { "@type": "Brand", name: config.siteName },
      offers: {
        "@type": "Offer",
        url: `${url}/#fragor`,
        price: (plan.price as number).toFixed(2),
        priceCurrency: config.currency,
        availability: "https://schema.org/InStock",
        seller: { "@id": `${url}/#org` },
      },
    }));
  const tutorials = (config.tutorials ?? []) as Tutorial[];
  const howtos = tutorials
    .filter((tutorial) => Array.isArray(tutorial.steps) && tutorial.steps.length > 0)
    .map((tutorial) => ({
      "@type": "HowTo",
      "@id": `${url}/#howto-${tutorial.id}`,
      name: tutorial.name,
      description: tutorial.description,
      inLanguage: lang,
      step: tutorial.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    }));
  const faq = {
    "@type": "FAQPage",
    "@id": `${url}/#faq`,
    inLanguage: lang,
    mainEntity: (copy.faq as Faq[]).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [org, faq, ...products, ...howtos],
  };
}

/** Safe serialization for <script type="application/ld+json">. */
export function jsonLdString(lang: Lang = defaultLang) {
  return JSON.stringify(buildJsonLd(lang)).replace(/</g, "\\u003c");
}
