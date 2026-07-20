import mongoose, { Schema, model, models } from "mongoose";

export interface IProject {
  title: string; // caption shown on hover
  category: string; // optional small label, e.g. "Residential"
  image: string; // required — the project photo
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, default: "", trim: true },
    category: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.Project as mongoose.Model<IProject>) ||
  model<IProject>("Project", ProjectSchema);
