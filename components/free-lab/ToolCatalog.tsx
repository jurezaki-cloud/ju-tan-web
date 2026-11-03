"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import {
  categories,
  filterLabTools,
  type Category,
} from "@/lib/free-lab/catalog";
import ToolIcon from "./ToolIcon";
import styles from "@/app/free/free.module.css";

export default function ToolCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Vse");
  const tools = filterLabTools(query, category);
  return (
    <section
      id="orodja"
      className={styles.catalog}
      aria-labelledby="tools-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>TVOJ DIGITALNI PREDAL</p>
          <h2 id="tools-title">Za ideje. In vsakdan.</h2>
        </div>
        <p>
          Šest idej. En laboratorij.
          <br />
          Orodja dodajamo postopoma.
        </p>
      </div>
      <label className={styles.search}>
        <Search size={21} aria-hidden="true" />
        <span className="sr-only">Poišči orodje</span>
        <input
          type="search"
          placeholder="Kaj želiš ustvariti ali urediti?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={120}
          aria-controls="tool-results"
        />
      </label>
      <div
        className={styles.filters}
        role="group"
        aria-label="Kategorije orodij"
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p
        className={styles.resultCount}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Prikazana orodja: {tools.length} od 6
      </p>
      <div id="tool-results" className={styles.grid}>
        {tools.map((tool, index) => (
          <article className={styles.card} key={tool.slug}>
            <div className={styles.cardTop}>
              <span className={styles.icon} data-icon={tool.icon}>
                <ToolIcon icon={tool.icon} />
              </span>
              <span
                className={
                  tool.release.status === "available"
                    ? styles.live
                    : styles.planned
                }
              >
                {tool.release.status === "available"
                  ? "Na voljo · Magic Surprise"
                  : "V pripravi"}
              </span>
            </div>
            <p className={styles.cardCategory}>{tool.category}</p>
            <h3>{tool.name}</h3>
            <p className={styles.cardDescription}>{tool.description}</p>
            <div className={styles.cardBottom}>
              <span aria-hidden="true">0{index + 1}</span>
              <Link
                prefetch={false}
                href={
                  tool.release.status === "available"
                    ? tool.release.href
                    : `/free/${tool.slug}`
                }
              >
                {tool.release.status === "available"
                  ? "Ustvari voščilnico"
                  : "Kaj pripravljamo"}
                <span className="sr-only"> — {tool.name}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      {tools.length === 0 && (
        <div className={styles.empty}>
          <h3>Za ta izbor še ni zadetkov.</h3>
          <p>Poskusi z »PDF«, »slike« ali izberi drugo kategorijo.</p>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              setQuery("");
              setCategory("Vse");
            }}
          >
            Ponastavi iskanje
          </button>
        </div>
      )}
    </section>
  );
}
