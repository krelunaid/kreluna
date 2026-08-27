"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { marketplaceCategories, products } from "../marketplace-data";

const categoryLabel = Object.fromEntries(marketplaceCategories.map((item) => [item.id, item.name]));

export default function MarketplaceClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("it");
    return products.filter((product) => {
      const searchable = [product.name, product.eyebrow, product.tagline, product.description, ...product.features].join(" ").toLocaleLowerCase("it");
      return (category === "all" || product.category === category) && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, query]);

  return (
    <main className="marketplace-page">
      <header className="marketplace-header">
        <Link className="marketplace-brand" href="/" aria-label="Torna alla home Kreluna">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kreluna-logo.png" alt="" width="42" height="42" /><span>KRELUNA</span>
        </Link>
        <nav aria-label="Navigazione Marketplace"><Link href="/">Home</Link><Link href="/marketplace" aria-current="page">Marketplace</Link><a href="https://www.kreluna.it/contatti.html">Contatti</a></nav>
      </header>

      <section className="marketplace-hero">
        <div><span className="marketplace-kicker">Marketplace Kreluna · {products.length} prodotti</span><h1>Tutto ciò che<br /><em>stiamo costruendo.</em></h1></div>
        <p>App, software e nuove esperienze digitali raccolti in un catalogo progettato per crescere. Cerca un prodotto, scegli una categoria e scopri cosa è già disponibile o in sviluppo.</p>
      </section>

      <section className="marketplace-toolbar" aria-label="Filtri del Marketplace">
        <label className="marketplace-search"><span>Cerca</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, funzione o categoria…" type="search" /></label>
        <div className="marketplace-filter" role="group" aria-label="Filtra per categoria">
          <button className={category === "all" ? "active" : ""} onClick={() => setCategory("all")}>Tutto <span>{products.length}</span></button>
          {marketplaceCategories.map((item) => <button className={category === item.id ? "active" : ""} key={item.id} onClick={() => setCategory(item.id)}>{item.name} <span>{products.filter((product) => product.category === item.id).length}</span></button>)}
        </div>
      </section>

      <section className="marketplace-catalog" aria-live="polite">
        <div className="marketplace-results"><span>{String(visibleProducts.length).padStart(2, "0")}</span><p>{visibleProducts.length === 1 ? "prodotto trovato" : "prodotti trovati"}</p></div>
        {visibleProducts.length > 0 ? <div className="marketplace-card-grid">
          {visibleProducts.map((product, index) => <article className={`marketplace-catalog-card ${product.color}`} key={product.slug}>
            <div className="catalog-card-top"><span>{String(index + 1).padStart(2, "0")}</span><strong>{product.status}</strong></div>
            <div className="catalog-visual" aria-hidden="true"><div className="catalog-orbit" /><span>{product.name.slice(0, 1)}</span><small>{product.domain}</small></div>
            <div className="catalog-copy"><p>{categoryLabel[product.category]}</p><h2>{product.name}</h2><h3>{product.tagline}</h3><div className="catalog-features">{product.features.map((feature) => <span key={feature}>{feature}</span>)}</div></div>
            <a href={product.href} aria-label={`Scopri ${product.name}`}>Apri la scheda <span>↗</span></a>
          </article>)}
        </div> : <div className="marketplace-empty"><span>0 risultati</span><h2>Nessun prodotto corrisponde alla ricerca.</h2><button onClick={() => { setQuery(""); setCategory("all"); }}>Mostra tutto il Marketplace</button></div>}
      </section>

      <section className="marketplace-growth"><span>Catalogo in evoluzione</span><h2>Una casa pronta<br />per i prossimi prodotti.</h2><p>Ogni nuova app entra nella propria categoria, diventa ricercabile e ottiene una scheda dedicata. La home rimane essenziale; il Marketplace continua a crescere.</p><a href="https://www.kreluna.it/contatti.html">Proponi un progetto <span>↗</span></a></section>
    </main>
  );
}
