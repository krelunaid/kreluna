/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { products } from "../marketplace-data";

export const metadata: Metadata = {
  title: "Progetti Kreluna | Prodotti e concept in sviluppo",
  description: "Scopri i progetti pubblici di Kreluna, il loro stato e le pagine dedicate.",
  alternates: { canonical: "https://www.kreluna.it/progetti" },
};

const publicProjects = products.filter((product) =>
  ["citybeam", "velvet-table"].includes(product.slug),
);

const projectImage: Record<string, string> = {
  citybeam: "/citybeam-hero.png",
  "velvet-table": "/velvet-table/hero.jpg",
};

export default function ProjectsPage() {
  return (
    <div className="projects-page">
      <header className="projects-page-header">
        <Link className="projects-page-brand" href="/" aria-label="Kreluna home">
          <img src="/kreluna-logo.png" alt="" width="34" height="34" />
          <span>KRELUNA</span>
        </Link>
        <nav aria-label="Navigazione progetti">
          <Link href="/">Home</Link>
          <a href="/citybeam">CityBeam</a>
          <a className="button button-small button-primary" href="/contatti.html">Parliamone</a>
        </nav>
      </header>

      <main>
        <section className="projects-page-hero">
          <div className="eyebrow"><i /> Progetti Kreluna</div>
          <h1>Poche idee in vista.<br /><em>Ognuna con il suo spazio.</em></h1>
          <p>
            Qui raccogliamo soltanto i progetti che possiamo raccontare con chiarezza.
            Quelli non ancora pronti restano privati fino al momento giusto.
          </p>
        </section>

        <section className="projects-page-grid" aria-label="Progetti pubblici">
          {publicProjects.map((project, index) => (
            <article className={`projects-page-card project-${project.slug}`} key={project.slug}>
              <img src={projectImage[project.slug]} alt="" width="1200" height="760" />
              <div className="projects-page-card-overlay" />
              <div className="projects-page-card-copy">
                <div className="projects-page-card-top"><span>{String(index + 1).padStart(2, "0")}</span><span>{project.status}</span></div>
                <div><p>{project.eyebrow}</p><h2>{project.name}</h2><h3>{project.tagline}</h3><a href={project.href}>Scopri il progetto <span aria-hidden="true">↗</span></a></div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="projects-page-footer"><span>© 2026 Kreluna</span><span>P. IVA 02114130475 · REA PT-622714</span></footer>
    </div>
  );
}
