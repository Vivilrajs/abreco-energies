import { connectDB } from "@/lib/mongodb";
import Solution, {
  IBenefit,
  IInstallSection,
  ISolution,
} from "@/lib/models/Solution";
import SiteSettings, { ISiteSettings } from "@/lib/models/SiteSettings";
import { PRODUCTS_CONTENT } from "@/lib/product-content";

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
  ctaLabel: string;
  benefits: IBenefit[];
  commercial: IInstallSection;
  residential: IInstallSection;
};

export type SettingsDTO = Omit<ISiteSettings, "updatedAt">;

const DEFAULT_SETTINGS: SettingsDTO = {
  key: "default",
  heroTitle: "Abreco Energies",
  heroSubtitle: "Your partner in renewable energy solutions",
  heroBody:
    "Abreco Energies is a leading supplier and installer of energy-efficient heat pumps, air conditioners, and solar solutions. Wherever you are in Australia, we help you save energy and reduce costs.",
  videoUrl: "/media/hero.mp4",
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
      audioUrl: doc.audioUrl,
      phone: doc.phone,
      email: doc.email,
      address: doc.address,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
