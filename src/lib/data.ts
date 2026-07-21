import { connectDB } from "@/lib/mongodb";
import Solution, {
  IBenefit,
  IInstallSection,
  ISolution,
} from "@/lib/models/Solution";
import SiteSettings, { ISiteSettings } from "@/lib/models/SiteSettings";
import Service, { IService } from "@/lib/models/Service";
import BlogPost, { IBlogPost } from "@/lib/models/BlogPost";
import Project, { IProject } from "@/lib/models/Project";
import Testimonial, { ITestimonial } from "@/lib/models/Testimonial";
import Faq, { IFaq } from "@/lib/models/Faq";
import { PRODUCTS_CONTENT } from "@/lib/product-content";
import { SERVICES_CONTENT } from "@/lib/service-content";
import { BLOG_CONTENT } from "@/lib/blog-content";
import { PROJECTS_CONTENT } from "@/lib/project-content";
import { TESTIMONIALS_CONTENT } from "@/lib/testimonial-content";
import { FAQ_CONTENT } from "@/lib/faq-content";

export type SolutionDTO = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
  tagline: string;
  headline: string;
  intro: string;
  heroImage: string;
  heroVideo: string;
  ctaLabel: string;
  benefits: IBenefit[];
  commercial: IInstallSection;
  residential: IInstallSection;
};

export type ServiceDTO = {
  _id: string;
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  image: string;
  order: number;
  published: boolean;
};

export type BlogPostDTO = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  author: string;
  date: string; // ISO string
  readTime: string;
  published: boolean;
};

export type SettingsDTO = Omit<ISiteSettings, "updatedAt">;

export const DEFAULT_SETTINGS: SettingsDTO = {
  key: "default",
  heroTitle: "Abreco Energies",
  heroSubtitle: "Your partner in renewable energy solutions",
  heroBody:
    "Abreco Energies is a leading supplier and installer of energy-efficient heat pumps, air conditioners, and solar solutions. Wherever you are in Australia, we help you save energy and reduce costs.",
  videoUrl: "/media/hero.mp4",
  imageUrl: "",
  audioUrl: "/media/ambient.mp3",
  phone: "1300 000 000",
  email: "admin@abrecoenergies.com",
  address: "Australia",
};

function toDTO(d: ISolution & { _id: unknown }): SolutionDTO {
  return {
    _id: String(d._id),
    slug: d.slug,
    title: d.title,
    description: d.description,
    icon: d.icon,
    order: d.order,
    published: d.published,
    tagline: d.tagline ?? "",
    headline: d.headline ?? "",
    intro: d.intro ?? "",
    heroImage: d.heroImage ?? "",
    heroVideo: d.heroVideo ?? "",
    ctaLabel: d.ctaLabel || "Get Now!",
    benefits: d.benefits ?? [],
    commercial: d.commercial ?? { title: "", body: "", scenarios: [], image: "" },
    residential:
      d.residential ?? { title: "", body: "", scenarios: [], image: "" },
  };
}

export async function getPublishedSolutions(): Promise<SolutionDTO[]> {
  try {
    await connectDB();
    const docs = await Solution.find({ published: true })
      .sort({ order: 1 })
      .lean<(ISolution & { _id: unknown })[]>();
    if (docs.length === 0) return PRODUCTS_CONTENT;
    return docs.map(toDTO);
  } catch {
    return PRODUCTS_CONTENT;
  }
}

export async function getSolutionBySlug(
  slug: string
): Promise<SolutionDTO | null> {
  try {
    await connectDB();
    const doc = await Solution.findOne({ slug, published: true }).lean<
      (ISolution & { _id: unknown }) | null
    >();
    if (doc) return toDTO(doc);
  } catch {
    // fall through to default content
  }
  return PRODUCTS_CONTENT.find((p) => p.slug === slug) ?? null;
}

function serviceToDTO(d: IService & { _id: unknown }): ServiceDTO {
  return {
    _id: String(d._id),
    slug: d.slug,
    eyebrow: d.eyebrow ?? "",
    title: d.title,
    description: d.description,
    body: d.body ?? "",
    image: d.image ?? "",
    order: d.order,
    published: d.published,
  };
}

export async function getPublishedServices(): Promise<ServiceDTO[]> {
  try {
    await connectDB();
    const docs = await Service.find({ published: true })
      .sort({ order: 1 })
      .lean<(IService & { _id: unknown })[]>();
    if (docs.length === 0) return SERVICES_CONTENT;
    return docs.map(serviceToDTO);
  } catch {
    return SERVICES_CONTENT;
  }
}

export async function getServiceBySlug(
  slug: string
): Promise<ServiceDTO | null> {
  try {
    await connectDB();
    const doc = await Service.findOne({ slug, published: true }).lean<
      (IService & { _id: unknown }) | null
    >();
    if (doc) return serviceToDTO(doc);
  } catch {
    // fall through to default content
  }
  return SERVICES_CONTENT.find((s) => s.slug === slug) ?? null;
}

function blogToDTO(d: IBlogPost & { _id: unknown }): BlogPostDTO {
  return {
    _id: String(d._id),
    slug: d.slug,
    title: d.title,
    excerpt: d.excerpt ?? "",
    body: d.body ?? "",
    image: d.image ?? "",
    author: d.author ?? "Abreco Energies",
    date: (d.date instanceof Date ? d.date : new Date(d.date)).toISOString(),
    readTime: d.readTime ?? "",
    published: d.published,
  };
}

export async function getPublishedPosts(): Promise<BlogPostDTO[]> {
  try {
    await connectDB();
    const docs = await BlogPost.find({ published: true })
      .sort({ date: -1 })
      .lean<(IBlogPost & { _id: unknown })[]>();
    if (docs.length === 0) return BLOG_CONTENT;
    return docs.map(blogToDTO);
  } catch {
    return BLOG_CONTENT;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostDTO | null> {
  try {
    await connectDB();
    const doc = await BlogPost.findOne({ slug, published: true }).lean<
      (IBlogPost & { _id: unknown }) | null
    >();
    if (doc) return blogToDTO(doc);
  } catch {
    // fall through to default content
  }
  return BLOG_CONTENT.find((p) => p.slug === slug) ?? null;
}

export type ProjectDTO = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
  order: number;
  published: boolean;
};

function toProjectDTO(d: IProject & { _id: unknown }): ProjectDTO {
  const id = String(d._id);
  return {
    _id: id,
    title: d.title ?? "",
    category: d.category ?? "",
    description: d.description ?? "",
    image: d.image,
    // Fall back to the _id if no slug set yet
    slug: d.slug || id,
    order: d.order,
    published: d.published,
  };
}

export async function getPublishedProjects(): Promise<ProjectDTO[]> {
  try {
    await connectDB();
    const docs = await Project.find({ published: true })
      .sort({ order: 1 })
      .lean<(IProject & { _id: unknown })[]>();
    if (docs.length === 0) return PROJECTS_CONTENT;
    return docs.map(toProjectDTO);
  } catch {
    return PROJECTS_CONTENT;
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectDTO | null> {
  try {
    await connectDB();
    // Match on slug field first, then fall back to _id
    const doc = await Project.findOne({
      $or: [{ slug }, { _id: slug }],
      published: true,
    }).lean<(IProject & { _id: unknown }) | null>();
    if (!doc) return PROJECTS_CONTENT.find((p) => p.slug === slug) ?? null;
    return toProjectDTO(doc);
  } catch {
    return PROJECTS_CONTENT.find((p) => p.slug === slug) ?? null;
  }
}


export type TestimonialDTO = {
  _id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
  order: number;
  published: boolean;
};

export async function getPublishedTestimonials(): Promise<TestimonialDTO[]> {
  try {
    await connectDB();
    const docs = await Testimonial.find({ published: true })
      .sort({ order: 1 })
      .lean<(ITestimonial & { _id: unknown })[]>();
    if (docs.length === 0) return TESTIMONIALS_CONTENT;
    return docs.map((d) => ({
      _id: String(d._id),
      name: d.name,
      role: d.role ?? "",
      quote: d.quote,
      avatar: d.avatar ?? "",
      rating: d.rating ?? 5,
      order: d.order,
      published: d.published,
    }));
  } catch {
    return TESTIMONIALS_CONTENT;
  }
}

export type FaqDTO = {
  _id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

export async function getPublishedFaqs(): Promise<FaqDTO[]> {
  try {
    await connectDB();
    const docs = await Faq.find({ published: true })
      .sort({ order: 1 })
      .lean<(IFaq & { _id: unknown })[]>();
    if (docs.length === 0) return FAQ_CONTENT;
    return docs.map((d) => ({
      _id: String(d._id),
      question: d.question,
      answer: d.answer,
      order: d.order,
      published: d.published,
    }));
  } catch {
    return FAQ_CONTENT;
  }
}

export async function getSettings(): Promise<SettingsDTO> {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne({ key: "default" }).lean();
    if (!doc) return DEFAULT_SETTINGS;
    return {
      key: "default",
      heroTitle: doc.heroTitle,
      heroSubtitle: doc.heroSubtitle,
      heroBody: doc.heroBody,
      videoUrl: doc.videoUrl,
      imageUrl: doc.imageUrl ?? "",
      audioUrl: doc.audioUrl,
      phone: doc.phone,
      email: doc.email,
      address: doc.address,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
