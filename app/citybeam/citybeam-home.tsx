/* eslint-disable @next/next/no-img-element */
import { cityBeamContent } from './citybeam-content';
import type { CityBeamLocale } from './citybeam-landing';

export default function CityBeamHome({ locale = 'it' }: { locale?: CityBeamLocale }) {
  const t = cityBeamContent[locale];
  const href = locale === 'it' ? '/citybeam' : `/${locale}/citybeam`;
  return <section className="citybeam-home section-shell" aria-labelledby="citybeam-home-title">
    <a className="citybeam-home-photo" href={href} aria-label={t.homeCta}>
      <picture><source type="image/avif" srcSet="/citybeam/ny-d020/ny-d020-the-economist-640.avif 640w, /citybeam/ny-d020/ny-d020-the-economist-1200.avif 1200w" sizes="(max-width: 700px) 90vw, 50vw" /><img src="/citybeam/ny-d020/ny-d020-the-economist-1200.webp" alt="NY-D020 · The Economist · Heritage Outdoor · Times Square" width="1200" height="800" loading="lazy" decoding="async" /></picture>
      <span>NY-D020 · 1530 Broadway</span>
    </a>
    <div className="citybeam-home-copy"><span className="citybeam-kicker">CityBeam by Kreluna · New York</span><h2 id="citybeam-home-title">{t.homeTitle}</h2><p>{t.homeText}</p><a className="button button-primary" href={href}>{t.homeCta} <span aria-hidden="true">↗</span></a><small>{t.disclosure}</small></div>
  </section>;
}
