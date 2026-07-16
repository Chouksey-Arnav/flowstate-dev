import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCS } from "@/lib/docs";
import { DocContent } from "@/components/docs/doc-content";
import { SITE_URL } from "@/lib/site";

interface DocRouteParams {
  params: { slug: string };
}

export function generateStaticParams() {
  return DOCS.map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: DocRouteParams): Metadata {
  const doc = DOCS.find((d) => d.slug === params.slug);
  if (!doc) return {};
  const url = `${SITE_URL}/docs/${doc.slug}`;
  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: doc.title,
      description: doc.description,
      url,
    },
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
