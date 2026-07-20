import mongoose, { Schema, model, models } from "mongoose";

export interface ISiteSettings {
  key: string; // always "default" — single settings document
  heroTitle: string;
  heroSubtitle: string;
  heroBody: string;
  videoUrl: string;
  audioUrl: string;
  phone: string;
  email: string;
  address: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    heroTitle: { type: String, default: "Abreco Energies" },
    heroSubtitle: {
      type: String,
      default: "Your partner in renewable energy solutions",
    },
    heroBody: {
      type: String,
      default:
        "Abreco Energies is a leading supplier and installer of energy-efficient heat pumps, air conditioners, and solar solutions.",
    },
    videoUrl: { type: String, default: "/media/hero.mp4" },
    audioUrl: { type: String, default: "/media/ambient.mp3" },
    phone: { type: String, default: "1300 000 000" },
    email: { type: String, default: "admin@abrecoenergies.com" },
    address: { type: String, default: "Australia" },
  },
  { timestamps: true }
);

export default (models.SiteSettings as mongoose.Model<ISiteSettings>) ||
  model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
