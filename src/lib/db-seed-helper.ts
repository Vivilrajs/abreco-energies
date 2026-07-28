import { connectDB } from "@/lib/mongodb";
import Solution from "@/lib/models/Solution";
import Service from "@/lib/models/Service";
import Testimonial from "@/lib/models/Testimonial";
import Faq from "@/lib/models/Faq";
import BlogPost from "@/lib/models/BlogPost";
import Project from "@/lib/models/Project";
import SiteSettings from "@/lib/models/SiteSettings";

import { PRODUCTS_CONTENT } from "@/lib/product-content";
import { SERVICES_CONTENT } from "@/lib/service-content";
import { TESTIMONIALS_CONTENT } from "@/lib/testimonial-content";
import { FAQ_CONTENT } from "@/lib/faq-content";
import { BLOG_CONTENT } from "@/lib/blog-content";
import { PROJECTS_CONTENT } from "@/lib/project-content";

export async function ensureAllSeeded() {
  await connectDB();

  // 1. Solutions
  const solutionCount = await Solution.countDocuments();
  if (solutionCount === 0) {
    await Solution.insertMany(PRODUCTS_CONTENT.map(({ _id, ...rest }) => rest));
  }

  // 2. Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany(SERVICES_CONTENT.map(({ _id, ...rest }) => rest));
  }

  // 3. Testimonials
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany(TESTIMONIALS_CONTENT.map(({ _id, ...rest }) => rest));
  }

  // 4. FAQs
  const faqCount = await Faq.countDocuments();
  if (faqCount === 0) {
    await Faq.insertMany(FAQ_CONTENT.map(({ _id, ...rest }) => rest));
  }

  // 5. Blog posts
  const blogCount = await BlogPost.countDocuments();
  if (blogCount === 0) {
    await BlogPost.insertMany(
      BLOG_CONTENT.map(({ _id, ...rest }) => ({
        ...rest,
        date: rest.date ? new Date(rest.date) : new Date(),
      }))
    );
  }

  // 6. Projects
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany(PROJECTS_CONTENT.map(({ _id, ...rest }) => rest));
  }

  // 7. Site Settings
  const settingsCount = await SiteSettings.countDocuments({ key: "default" });
  if (settingsCount === 0) {
    await SiteSettings.create({
      key: "default",
      heroTitle: "Abreco Energies",
      heroSubtitle: "Your partner in renewable energy solutions",
      heroBody:
        "Abreco Energies is a leading supplier and installer of energy-efficient heat pumps, air conditioners, and solar solutions. Wherever you are in Australia, we help you save energy and reduce costs.",
      videoUrl: "/media/hero.mp4",
      audioUrl: "/media/ambient.mp3",
      phone: "1300 000 000",
      email: "enquires@abrecoenergies.com",
      address: "Australia",
    });
  }
}
