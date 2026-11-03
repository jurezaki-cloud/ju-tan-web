import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { getLabTool, labTools } from "@/lib/free-lab/catalog";
import { createPageMetadata } from "@/lib/seo";
import ToolIcon from "@/components/free-lab/ToolIcon";
import styles from "../free.module.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return labTools
    .filter(
      (tool) =>
        !["qr-studio", "image-magic", "kviz-slovenija"].includes(tool.slug),
    )
    .map(({ slug }) => ({ slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getLabTool((await params).slug);
  if (!tool) notFound();
  return {
    ...createPageMetadata({
      title: `${tool.name} – FREE LAB`,
      description: tool.description,
      path: `/free/${tool.slug}`,
    }),
    robots: { index: false, follow: true },
  };
}

export default async function ToolPage({ params }: Props) {
  const tool = getLabTool((await params).slug);
  if (!tool) notFound();
  const available = tool.release.status === "available";
  return (
    <div className={`${styles.container} ${styles.detail}`}>
      <Link href="/free#orodja" className={styles.textLink}>
        <ArrowLeft size={18} aria-hidden="true" /> Vsa orodja
      </Link>
      <div className={styles.detailPanel}>
        <span className={styles.icon} data-icon={tool.icon}>
          <ToolIcon icon={tool.icon} />
        </span>
        <p className={styles.eyebrow}>
          {available ? "NA VOLJO V MAGIC SURPRISE" : "V PRIPRAVI"} / FREE LAB
        </p>
        <h1>{tool.name}</h1>
        <p className={styles.lead}>{tool.description}</p>
        <p>
          {available
            ? "Voščilnice lahko že ustvarjaš v obstoječem JU-TAN Magic Surprise. Odpri ustvarjalnik in pripravi osebno presenečenje."
            : "To orodje še ni na voljo. Tukaj predstavljamo načrtovani obseg; datum izdaje še ni določen."}
        </p>
        <h2>{available ? "Kaj lahko preizkusiš" : "Kaj pripravljamo"}</h2>
        <ul className={styles.featureList}>
          {tool.features.map((feature) => (
            <li key={feature}>
              <Check size={18} aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        {tool.release.status === "available" ? (
          <Link
            href={tool.release.href}
            prefetch={false}
            className={styles.primary}
          >
            {tool.release.label}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        ) : (
          <Link href="/magic" prefetch={false} className={styles.primary}>
            Medtem ustvari voščilnico{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
