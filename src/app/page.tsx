import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { SolutionsSection } from "@/components/site/solutions-section";
import { WhySection } from "@/components/site/why-section";
import { ProcessSection } from "@/components/site/process-section";
import {
  AboutSection,
  ServicesPreview,
  TestimonialsPreview,
  ProjectsPreview,
  FaqPreview,
  BlogPreview,
} from "@/components/site/home-sections";
import { SiteFooter } from "@/components/site/site-footer";
import {
  getPublishedSolutions,
  getPublishedServices,
  getPublishedTestimonials,
  getPublishedProjects,
  getPublishedFaqs,
  getPublishedPosts,
  getSettings,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    solutions,
    services,
    testimonials,
    projects,
    faqs,
    posts,
    settings,
  ] = await Promise.all([
    getPublishedSolutions(),
    getPublishedServices(),
    getPublishedTestimonials(),
    getPublishedProjects(),
    getPublishedFaqs(),
    getPublishedPosts(),
    getSettings(),
  ]);

  return (
    <main id="top" className="site-font bg-background">
      <SiteHeader />
      <Hero settings={settings} />
      <AboutSection settings={settings} />
      <SolutionsSection solutions={solutions} />
      <ServicesPreview services={services} />
      <WhySection settings={settings} />
      <ProjectsPreview projects={projects} />
      <TestimonialsPreview testimonials={testimonials} />
      <ProcessSection />
      <FaqPreview faqs={faqs} />
      <BlogPreview posts={posts} />
      <SiteFooter settings={settings} />
    </main>
  );
}
