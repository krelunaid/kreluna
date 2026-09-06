import type { MetadataRoute } from "next";
import { homeLanguages } from "./home-localized";
import { cosmoraLanguages } from './cosmora-content';
import { guideLanguages } from './cosmora-guide';
import internationalRoutes from "../content/international-routes.json";

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
    it: "/intelligenza-artificiale-aziende",
    en: "/en/ai-for-business",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    it: "/ai-studi-professionali",
    en: "/en/ai-for-professional-services",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    it: "/automazione-processi-aziendali",
    en: "/en/business-process-automation",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    it: "/azienda",
    en: "/en/about",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    it: "/contatti",
    en: "/en/contact",
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    it: "/ai-per-commercialisti",
    en: "/en/ai-for-accounting-firms",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    it: "/ai-per-studi-legali",
    en: "/en/ai-for-law-firms",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    it: "/ai-consulenti-del-lavoro",
    en: "/en/ai-for-payroll-hr-consultancies",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    it: "/risorse",
    en: "/en/resources",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    it: "/ai-studi-professionali-dati-riservati",
    en: "/en/ai-professional-services-confidential-data",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    it: "/processi-aziendali-da-automatizzare",
    en: "/en/which-business-processes-to-automate-first",
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

const projectHubLanguages = {
  it: `${SITE_URL}/progetti`,
  en: `${SITE_URL}/en/projects`,
  fr: `${SITE_URL}/fr/projects`,
  es: `${SITE_URL}/es/projects`,
  de: `${SITE_URL}/de/projects`,
  "x-default": `${SITE_URL}/progetti`,
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
    const cluster = internationalRoutes.find((entry) => entry.paths.it === page.it);
    const languages = {
      it: absoluteUrl(page.it),
      en: absoluteUrl(page.en),
      ...Object.fromEntries(Object.entries(cluster?.paths ?? {}).map(([lang, path]) => [lang, absoluteUrl(path)])),
      "x-default": absoluteUrl(page.it),
    };

    return Object.entries(languages).filter(([lang]) => lang !== "x-default").map(([, url]) => ({
        url,
        lastModified: "2026-09-05",
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
    }));
  });

  return [
    ...Object.entries(guideLanguages).filter(([lang])=>lang!=='x-default').map(([,url])=>({url,lastModified:'2026-09-06',changeFrequency:'weekly' as const,priority:0.7,alternates:{languages:guideLanguages}})),
    ...Object.entries(cosmoraLanguages).filter(([lang])=>lang!=='x-default').map(([,url])=>({url,lastModified:'2026-09-06',changeFrequency:'monthly' as const,priority:0.8,alternates:{languages:cosmoraLanguages}})),
    {
      url: SITE_URL,
      lastModified: "2026-09-06",
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: { languages: homeLanguages },
    },
...Object.entries(homeLanguages).filter(([lang]) => !["it", "x-default"].includes(lang)).map(([, url]) => ({ url, lastModified: "2026-09-06", changeFrequency: "weekly" as const, priority: 0.9, alternates: { languages: homeLanguages } })),
    ...localizedPages,
    ...Object.entries(webProfessionalGuideLanguages)
      .filter(([language]) => language !== "x-default")
      .map(([, url]) => ({
        url,
        lastModified: "2026-09-06",
        changeFrequency: "monthly" as const,
        priority: 0.75,
        images: [`${SITE_URL}/assets/guide-scegliere-professionista-web.png`],
        alternates: { languages: webProfessionalGuideLanguages },
      })),
    ...Object.entries(businessSoftwareGuideLanguages)
      .filter(([language]) => language !== "x-default")
      .map(([, url]) => ({
        url,
        lastModified: "2026-09-06",
        changeFrequency: "monthly" as const,
        priority: 0.75,
        images: [`${SITE_URL}/assets/guide-scegliere-software-gestionale.png`],
        alternates: { languages: businessSoftwareGuideLanguages },
      })),
    ...Object.entries(projectHubLanguages)
      .filter(([language]) => language !== "x-default")
      .map(([, url]) => ({
        url,
        lastModified: "2026-09-06",
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: [`${SITE_URL}/og-kreluna.jpg`],
        alternates: { languages: projectHubLanguages },
      })),
    ...Object.entries(citybeamLanguages)
      .filter(([language]) => language !== "x-default")
      .map(([, url]) => ({
        url,
        lastModified: "2026-09-06",
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: [`${SITE_URL}/citybeam-hero.png`],
        alternates: { languages: citybeamLanguages },
      })),
    ...Object.entries(velvetLanguages)
      .filter(([language]) => language !== "x-default")
      .map(([, url]) => ({
      url,
      lastModified: "2026-09-06",
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [
        `${SITE_URL}/velvet-table/hero.jpg`,
        `${SITE_URL}/velvet-table/salon.jpg`,
        `${SITE_URL}/velvet-table/view-window.jpg`,
        `${SITE_URL}/velvet-table/garden-restaurant.jpg`,
      ],
      alternates: { languages: velvetLanguages },
    })),
  ];
}
