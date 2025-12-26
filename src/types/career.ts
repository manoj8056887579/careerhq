export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  salary?: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateJobData {
  title: string;
  slug?: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  salary?: string;
  published?: boolean;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  id: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeId: string;
  coverLetter?: string;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateJobApplicationData {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeId: string;
  coverLetter?: string;
}
