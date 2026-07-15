import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCS } from "@/lib/docs";
import { DocContent } from "@/components/docs/doc-content";

interface DocRouteParams {
  params: { slug: string };
}

export function generateStaticParams() {
  return DOCS.map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: DocRouteParams): Metadata {
  const doc = DOCS.find((d) => d.slug === params.slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default function DocSlugPage({ params }: DocRouteParams) {
  const index = DOCS.findIndex((d) => d.slug === params.slug);
  if (index === -1) notFound();

  const doc = DOCS[index];
  const prev = DOCS[index - 1];
  const next = DOCS[index + 1];

  return <DocContent doc={doc} prev={prev} next={next} />;
}
