// Universal Module Types for all 13 modules in CareerHQ

export type ModuleType =
  | "study-india"
  | "placement-india"
  | "placement-abroad"
  | "internship-india"
  | "internship-abroad"
  | "mbbs-india"
  | "mbbs-abroad"
  | "lms"
  | "uni-project"
  | "school-project"
  | "mou-project"
  | "loans";

export interface ModuleCategory {
  id: string;
  name: string;
  moduleType: ModuleType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomField {
  key: string;
  value: string;
}

export interface UniversalModule {
  id: string;
  moduleType: ModuleType;

  // Standard Fields
  title: string; // H1
  shortDescription: string;
  detailedDescription: string;
  category: string; // Category name

  // Custom Fields (Dynamic based on module type)
  customFields: CustomField[]; // e.g., [{key: "Interest Rate", value: "5%"}, {key: "Location", value: "Mumbai"}]

  // Highlights / Key Features
  highlights: string[]; // Bulleted points

  // Media
  coverImage: string; // Cloudinary image ID
  galleryImages: string[]; // Array of Cloudinary image IDs

  // Metadata
  published?: boolean;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUniversalModuleData {
  moduleType: ModuleType;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  customFields: CustomField[];
  highlights: string[];
  coverImage: string;
  galleryImages: string[];
  published?: boolean;
}

export interface UpdateUniversalModuleData
  extends Partial<CreateUniversalModuleData> {
  id: string;
}

// Module-specific custom field templates
export const MODULE_CUSTOM_FIELDS: Record<ModuleType, string[]> = {
  "study-india": ["State", "University", "Course Duration", "Fees"],
  "placement-india": ["Company", "Location", "Package", "Job Role"],
  "placement-abroad": ["Country", "Company", "Package", "Job Role"],
  "internship-india": ["Company", "Location", "Stipend", "Duration"],
  "internship-abroad": ["Country", "Company", "Stipend", "Duration"],
  "mbbs-india": ["College", "State", "Fees", "Seats Available"],
  "mbbs-abroad": ["Country", "University", "Fees", "Duration"],
  lms: ["University", "Specialization", "Duration", "Fees"],
  "uni-project": ["University", "Department", "Duration", "Funding"],
  "school-project": ["School", "Grade Level", "Subject", "Duration"],
  "mou-project": ["Partner Organization", "Duration", "Scope", "Benefits"],
  loans: ["Interest Rate", "Max Amount", "Tenure", "Provider"],
};

// Module display names
export const MODULE_DISPLAY_NAMES: Record<ModuleType, string> = {
  "study-india": "Study India",
  "placement-india": "Placement India",
  "placement-abroad": "Placement Abroad",
  "internship-india": "Internship India",
  "internship-abroad": "Internship Abroad",
  "mbbs-india": "MBBS India",
  "mbbs-abroad": "MBBS Abroad",
  lms: "LMS",
  "uni-project": "University Project",
  "school-project": "School Project",
  "mou-project": "MOU Project",
  loans: "Loans",
};
