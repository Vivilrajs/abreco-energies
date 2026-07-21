import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductDetail } from "@/components/site/product-detail";
import { getSolutionBySlug, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSolutionBySlug(slug);
  if (!product) return { title: "Not found - Abreco Energies" };
  return {
    title: `${product.title} - Abreco Energies`,
    description: product.tagline || product.description,
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getSolutionBySlug(slug),
    getSettings(),
  ]);

  if (!product) notFound();

  return (
    <main className="site-font bg-background">
      <SiteHeader />
      <ProductDetail product={product} />
      <SiteFooter settings={settings} />
    </main>
  );
}
