import mongoose, { Schema, model, models } from "mongoose";

export interface IFaq {
  question: string;
  answer: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default (models.Faq as mongoose.Model<IFaq>) ||
  model<IFaq>("Faq", FaqSchema);
