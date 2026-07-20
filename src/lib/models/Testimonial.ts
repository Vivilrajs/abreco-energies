import mongoose, { Schema, model, models } from "mongoose";

export interface ITestimonial {
  name: string;
  role: string; // e.g. "Homeowner, Melbourne"
  quote: string;
  avatar: string; // optional photo
  rating: number; // 1–5
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "", trim: true },
    quote: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.Testimonial as mongoose.Model<ITestimonial>) ||
  model<ITestimonial>("Testimonial", TestimonialSchema);
