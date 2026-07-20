import mongoose, { Schema, model, models } from "mongoose";

export const PRODUCTS = [
  "Heat Pump",
  "Air Conditioner",
  "Solar System",
  "Battery",
] as const;

export const STATES = ["VIC", "NSW", "QLD", "SA"] as const;

export const SUBMISSION_STATUSES = ["new", "contacted", "closed"] as const;

export interface ISubmission {
  firstName?: string;
  email: string;
  phone: string;
  state?: string;
  postcode?: string;
  product?: string;
  message?: string;
  status: (typeof SUBMISSION_STATUSES)[number];
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    firstName: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    state: { type: String, enum: STATES },
    postcode: { type: String, trim: true },
    product: { type: String, enum: PRODUCTS },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: SUBMISSION_STATUSES,
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

export default (models.Submission as mongoose.Model<ISubmission>) ||
  model<ISubmission>("Submission", SubmissionSchema);
