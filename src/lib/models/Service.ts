import mongoose, { Schema, model, models } from "mongoose";

export interface IService {
  slug: string;
  eyebrow: string; // small label above the title, e.g. "Solar"
  title: string;
  description: string; // card blurb
  body: string; // detail-page long copy
  image: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    eyebrow: { type: String, default: "", trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    body: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.Service as mongoose.Model<IService>) ||
  model<IService>("Service", ServiceSchema);
