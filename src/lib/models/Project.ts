import mongoose, { Schema, model, models } from "mongoose";

export interface IProject {
  title: string; // caption shown on hover / detail page heading
  category: string; // optional small label, e.g. "Residential"
  description: string; // longer text shown on the detail page
  image: string; // required - the project photo
  slug: string; // URL-friendly identifier
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, default: "", trim: true },
    category: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    slug: { type: String, default: "", trim: true, index: true },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.Project as mongoose.Model<IProject>) ||
  model<IProject>("Project", ProjectSchema);
