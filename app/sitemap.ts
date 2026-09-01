import type { MetadataRoute } from "next";

const SITE_URL = "https://www.kreluna.it";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

type LocalizedPage = {
  it: string;
  en: string;
  lastModifiedIt?: string;
  lastModifiedEn?: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

const pages: readonly LocalizedPage[] = [
  {
    it: "/",
    en: "/en/",
    lastModifiedIt: "2026-08-23",
    lastModifiedEn: "2026-08-23",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    it: "/intelligenza-artificiale-aziende.html",
    en: "/en/ai-for-business.html",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    it: "/ai-studi-professionali.html",
    en: "/en/ai-for-professional-services.html",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    it: "/automazione-processi-aziendali.html",
    en: "/en/business-process-automation.html",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    it: "/cybersecurity-pmi-studi-professionali.html",
    en: "/en/cybersecurity-smes-professional-firms.html",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    it: "/azienda.html",
    en: "/en/about.html",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    it: "/contatti.html",
    en: "/en/contact.html",
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    it: "/ai-per-commercialisti.html",
    en: "/en/ai-for-accounting-firms.html",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    it: "/ai-per-studi-legali.html",
    en: "/en/ai-for-law-firms.html",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    it: "/ai-consulenti-del-lavoro.html",
    en: "/en/ai-for-payroll-hr-consultancies.html",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    it: "/risorse.html",
    en: "/en/resources.html",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    it: "/ai-studi-professionali-dati-riservati.html",
    en: "/en/ai-professional-services-confidential-data.html",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    it: "/processi-aziendali-da-automatizzare.html",
    en: "/en/which-business-processes-to-automate-first.html",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    it: "/cybersecurity-pmi-phishing-ransomware-backup.html",
    en: "/en/sme-cybersecurity-essentials.html",
    changeFrequency: "monthly",
    priority: 0.7,
  },
];

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

const velvetLanguages = {
  it: `${SITE_URL}/velvet-table`,
  en: `${SITE_URL}/en/velvet-table`,
  fr: `${SITE_URL}/fr/velvet-table`,
  es: `${SITE_URL}/es/velvet-table`,
  de: `${SITE_URL}/de/velvet-table`,
  "x-default": `${SITE_URL}/velvet-table`,
};

const citybeamLanguages = {
  it: `${SITE_URL}/citybeam`,
  en: `${SITE_URL}/en/citybeam`,
  fr: `${SITE_URL}/fr/citybeam`,
  es: `${SITE_URL}/es/citybeam`,
  de: `${SITE_URL}/de/citybeam`,
  "x-default": `${SITE_URL}/citybeam`,
};

const webProfessionalGuideLanguages = {
  it: `${SITE_URL}/it/guide/come-scegliere-professionista-sito-web/`,
  en: `${SITE_URL}/en/guides/how-to-choose-a-website-professional/`,
  es: `${SITE_URL}/es/guias/como-elegir-profesional-pagina-web/`,
  fr: `${SITE_URL}/fr/guides/choisir-professionnel-creation-site-internet/`,
  de: `${SITE_URL}/de/ratgeber/zuverlaessigen-webentwickler-auswaehlen/`,
  "x-default": `${SITE_URL}/it/guide/come-scegliere-professionista-sito-web/`,
};

const businessSoftwareGuideLanguages = {
  it: `${SITE_URL}/it/guide/come-scegliere-software-gestionale-piccola-impresa/`,
  en: `${SITE_URL}/en/guides/how-to-choose-small-business-software/`,
  es: `${SITE_URL}/es/guias/como-elegir-software-gestion-pequena-empresa/`,
  fr: `${SITE_URL}/fr/guides/choisir-logiciel-gestion-petite-entreprise/`,
  de: `${SITE_URL}/de/ratgeber/software-kleine-unternehmen-auswaehlen/`,
  "x-default": `${SITE_URL}/it/guide/come-scegliere-software-gestionale-piccola-impresa/`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedPages = pages.flatMap((page) => {
    const languages = {
      it: absoluteUrl(page.it),
      en: absoluteUrl(page.en),
      "x-default": absoluteUrl(page.it),
    };

    return [
      {
        url: languages.it,
        lastModified: page.lastModifiedIt ?? "2026-08-23",
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      },
      {
        url: languages.en,
        lastModified: page.lastModifiedEn ?? "2026-08-23",
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      },
    ];
  });

  return [
    ...localizedPages,
    ...Object.entries(webProfessionalGuideLanguages)
      .filter(([language]) => language !== "x-default")
      .map(([, url]) => ({
        url,
        lastModified: "2026-08-28",
        changeFrequency: "monthly" as const,
        priority: 0.75,
        images: [`${SITE_URL}/assets/guide-scegliere-professionista-web.png`],
        alternates: { languages: webProfessionalGuideLanguages },
      })),
    ...Object.entries(businessSoftwareGuideLanguages)
      .filter(([language]) => language !== "x-default")
      .map(([, url]) => ({
        url,
        lastModified: "2026-08-29",
        changeFrequency: "monthly" as const,
        priority: 0.75,
        images: [`${SITE_URL}/assets/guide-scegliere-software-gestionale.png`],
        alternates: { languages: businessSoftwareGuideLanguages },
      })),
    {
      url: `${SITE_URL}/risonix`,
      lastModified: "2026-08-27",
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: { it: `${SITE_URL}/risonix`, "x-default": `${SITE_URL}/risonix` } },
    },
    ...Object.entries(citybeamLanguages)
      .filter(([language]) => language !== "x-default")
      .map(([, url]) => ({
        url,
        lastModified: "2026-09-01",
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: [`${SITE_URL}/citybeam-hero.png`],
        alternates: { languages: citybeamLanguages },
      })),
    ...Object.entries(velvetLanguages)
      .filter(([language]) => language !== "x-default")
      .map(([, url]) => ({
      url,
      lastModified: "2026-08-23",
      changeFrequency: "monthly",
      priority: 0.8,
      images: [
        `${SITE_URL}/velvet-table/hero.jpg`,
        `${SITE_URL}/velvet-table/salon.jpg`,
        `${SITE_URL}/velvet-table/view-window.jpg`,
        `${SITE_URL}/velvet-table/garden-restaurant.jpg`,
      ],
      alternates: { languages: velvetLanguages },
    })),
    {
      url: `${SITE_URL}/en/velvet-table/restaurants`,
      lastModified: "2026-08-25",
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${SITE_URL}/velvet-table/og.jpg`],
    },
  ];
}
