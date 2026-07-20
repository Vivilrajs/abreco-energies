import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { SolutionsSection } from "@/components/site/solutions-section";
import { WhySection } from "@/components/site/why-section";
import { SiteFooter } from "@/components/site/site-footer";
import { getPublishedSolutions, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [solutions, settings] = await Promise.all([
    getPublishedSolutions(),
    getSettings(),
  ]);

  return (
    <main id="top" className="bg-neutral-950">
      <SiteHeader />
      <Hero settings={settings} />
      <SolutionsSection solutions={solutions} />
      <WhySection />
      <SiteFooter settings={settings} />
    </main>
  );
}
