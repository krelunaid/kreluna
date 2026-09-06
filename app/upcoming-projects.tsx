/* eslint-disable @next/next/no-img-element */
import { CosmoraFeature } from './cosmora-content';
export type ProjectLocale = 'it' | 'en' | 'fr' | 'es' | 'de';
const copy = {
  it: ['Progetti in arrivo.', 'Idee che stanno prendendo forma.', 'Pre-lancio', 'In sviluppo', 'Il tuo momento sui grandi schermi.', 'La serata giusta, a partire dall’atmosfera.', 'Scopri il progetto', 'Tutti i progetti'],
  en: ['Coming soon.', 'Ideas taking shape.', 'Pre-launch', 'In development', 'Your moment on the big screens.', 'The right evening starts with the atmosphere.', 'Explore the project', 'All projects'],
  fr: ['Projets à venir.', 'Des idées qui prennent forme.', 'Pré-lancement', 'En développement', 'Votre moment sur les grands écrans.', 'La bonne soirée commence par l’ambiance.', 'Découvrir le projet', 'Tous les projets'],
  es: ['Próximos proyectos.', 'Ideas que van tomando forma.', 'Prelanzamiento', 'En desarrollo', 'Tu momento en las grandes pantallas.', 'La velada ideal empieza por el ambiente.', 'Descubrir el proyecto', 'Todos los proyectos'],
  de: ['Kommende Projekte.', 'Ideen nehmen Gestalt an.', 'Vor dem Start', 'In Entwicklung', 'Dein Moment auf großen Bildschirmen.', 'Der passende Abend beginnt mit der Atmosphäre.', 'Projekt entdecken', 'Alle Projekte'],
};
export default function UpcomingProjects({ locale = 'it' }: { locale?: ProjectLocale }) {
  const t = copy[locale], prefix = locale === 'it' ? '' : `/${locale}`;
  return <section className="upcoming-projects section-shell" id="products" aria-labelledby="upcoming-title">
    <header><h2 id="upcoming-title">{t[0]}</h2><p>{t[1]}</p></header>
    <CosmoraFeature locale={locale} />
    <div className="upcoming-grid">
      {[{ name: 'CityBeam', slug: 'citybeam', image: '/citybeam-hero-640.webp', status: t[2], text: t[4] }, { name: 'Velvet Table', slug: 'velvet-table', image: '/velvet-table/hero-640.webp', status: t[3], text: t[5] }].map(project => <article className={`upcoming-card upcoming-card--${project.slug}`} key={project.slug}>
        <picture className="upcoming-image">{project.slug === 'citybeam' && <source type="image/avif" srcSet="/citybeam-hero-640.avif" />}<img src={project.image} alt="" width="640" height="360" loading="lazy" decoding="async" /></picture>
        <div className="upcoming-card-body"><div className="upcoming-card-heading"><h3>{project.name}</h3><span>{project.status}</span></div><p>{project.text}</p><a href={`${prefix}/${project.slug}`}>{t[6]} <span aria-hidden="true">↗</span><span className="sr-only"> — {project.name}</span></a></div>
      </article>)}
    </div><a className="upcoming-all" href={locale === 'it' ? '/progetti' : `${prefix}/projects`}>{t[7]} <span aria-hidden="true">→</span></a>
  </section>;
}
