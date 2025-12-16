import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone: string;
  country?: string;
  university?: string;
  program?: string;
  qualification?: string;
  ieltsScore?: string;
  message?: string;
  preference?: string; // Preferred Country / University / Job Role
  consent: boolean; // User consent for contact
  careerTestAnswers?: Array<{ question: string; answer: string }>;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: String,
    university: String,
    program: String,
    qualification: String,
    ieltsScore: String,
    message: String,
    preference: String, // Preferred Country / University / Job Role
    consent: { type: Boolean, required: true, default: true }, // User consent
    careerTestAnswers: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export const Lead =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
