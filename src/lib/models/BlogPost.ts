import mongoose, { Schema, model, models } from "mongoose";

export interface IBlogPost {
  slug: string;
  title: string;
  excerpt: string; // card blurb
  body: string; // full article (one paragraph per line)
  image: string;
  author: string;
  date: Date; // publish date shown on card
  readTime: string; // e.g. "10 min read"
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: "", trim: true },
    body: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    author: { type: String, default: "Abreco Energies", trim: true },
    date: { type: Date, default: Date.now, index: true },
    readTime: { type: String, default: "5 min read", trim: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.BlogPost as mongoose.Model<IBlogPost>) ||
  model<IBlogPost>("BlogPost", BlogPostSchema);
