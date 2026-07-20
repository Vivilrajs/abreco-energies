import mongoose, { Schema, model, models } from "mongoose";

export interface IBenefit {
  icon: string;
  text: string;
}

export interface IInstallSection {
  title: string;
  body: string;
  scenarios: string[];
  image: string;
}

export interface ISolution {
  slug: string;
  title: string;
  description: string; // short blurb for homepage card
  icon: string;
  order: number;
  published: boolean;

  // Rich product-page content (all optional)
  tagline: string; // hero quote e.g. "Heat pumps cut power use, boost savings!"
  headline: string; // e.g. "What is so good about Heat Pumps?"
  intro: string; // long intro paragraph(s)
  heroImage: string;
  ctaLabel: string; // default "Get Now!"
  benefits: IBenefit[];
  commercial: IInstallSection;
  residential: IInstallSection;

  createdAt: Date;
  updatedAt: Date;
}

const BenefitSchema = new Schema<IBenefit>(
  { icon: { type: String, default: "⚡" }, text: { type: String, default: "" } },
  { _id: false }
);

const InstallSchema = new Schema<IInstallSection>(
  {
    title: { type: String, default: "" },
    body: { type: String, default: "" },
    scenarios: { type: [String], default: [] },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const SolutionSchema = new Schema<ISolution>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, default: "⚡", trim: true },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },

    tagline: { type: String, default: "" },
    headline: { type: String, default: "" },
    intro: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    ctaLabel: { type: String, default: "Get Now!" },
    benefits: { type: [BenefitSchema], default: [] },
    commercial: { type: InstallSchema, default: () => ({}) },
    residential: { type: InstallSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default (models.Solution as mongoose.Model<ISolution>) ||
  model<ISolution>("Solution", SolutionSchema);
