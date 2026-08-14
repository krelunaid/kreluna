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
    lastModifiedIt: "2026-08-14",
    lastModifiedEn: "2026-08-14",
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

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) => {
    const languages = {
      it: absoluteUrl(page.it),
      en: absoluteUrl(page.en),
      "x-default": absoluteUrl(page.it),
    };

    return [
      {
        url: languages.it,
        lastModified: page.lastModifiedIt ?? "2026-08-14",
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      },
      {
        url: languages.en,
        lastModified: page.lastModifiedEn ?? "2026-08-14",
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      },
    ];
  });
}
