import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { SolutionsSection } from "@/components/site/solutions-section";
import { WhySection } from "@/components/site/why-section";
import { ProcessSection } from "@/components/site/process-section";
import { SiteFooter } from "@/components/site/site-footer";
import { getPublishedSolutions, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [solutions, settings] = await Promise.all([
    getPublishedSolutions(),
    getSettings(),
  ]);

  return (
    <main id="top" className="site-font bg-background">
      <SiteHeader />
      <Hero settings={settings} />
      <SolutionsSection solutions={solutions} />
      <WhySection settings={settings} />
      <ProcessSection />
      <SiteFooter settings={settings} />
    </main>
  );
}
