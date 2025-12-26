# Careers Feature Documentation

## Overview
Complete careers management system with job posting in admin panel and job applications on the public website.

## Features

### Admin Panel (`/admin/careers`)
- **Job Management**
  - Create, edit, and delete job postings
  - Toggle publish/unpublish status
  - Rich job details (title, department, location, type, experience, salary)
  - Responsibilities, requirements, and benefits lists
  - Auto-generated slugs from job titles
  - Search and filter jobs

- **Application Management**
  - View all job applications
  - Filter by status (pending, reviewing, shortlisted, rejected, hired)
  - Filter by job
  - Update application status
  - Download resumes
  - Delete applications

### Public Careers Page (`/careers`)
- **Job Listings**
  - Browse all published jobs
  - Search jobs by title, description, location
  - Filter by department and job type
  - Responsive card layout with job details
  - Real-time job count

- **Job Application**
  - Apply Now button for each job
  - Modal application form
  - Required fields: Name, Email, Phone, Resume
  - Optional cover letter
  - Resume upload (PDF/Word, max 5MB)
  - File validation and preview
  - Success/error notifications

## Database Models

### Job Model
```typescript
{
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
  createdAt: Date;
  updatedAt: Date;
}
```

### JobApplication Model
```typescript
{
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeId: string; // Cloudinary ID
  coverLetter?: string;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Jobs
- `GET /api/careers/jobs` - List all jobs (with filters)
- `POST /api/careers/jobs` - Create new job
- `GET /api/careers/jobs/[id]` - Get single job
- `PUT /api/careers/jobs/[id]` - Update job
- `DELETE /api/careers/jobs/[id]` - Delete job

### Applications
- `GET /api/careers/applications` - List all applications (with filters)
- `POST /api/careers/applications` - Submit application (multipart/form-data)
- `GET /api/careers/applications/[id]` - Get single application
- `GET /api/careers/applications/[id]/download` - Download resume file
- `PUT /api/careers/applications/[id]` - Update application status
- `DELETE /api/careers/applications/[id]` - Delete application

## File Structure
```
src/
├── app/
│   ├── admin/
│   │   └── careers/
│   │       └── page.tsx                    # Admin careers management
│   ├── api/
│   │   └── careers/
│   │       ├── jobs/
│   │       │   ├── route.ts                # Jobs CRUD
│   │       │   └── [id]/route.ts           # Single job operations
│   │       └── applications/
│   │           ├── route.ts                # Applications CRUD
│   │           └── [id]/
│   │               ├── route.ts            # Single application operations
│   │               └── download/
│   │                   └── route.ts        # Resume download endpoint
│   └── careers/
│       ├── page.tsx                        # Public careers page
│       └── careers-client.tsx              # Client component
├── components/
│   ├── admin/
│   │   └── careers/
│   │       ├── admin-job-form.tsx          # Job create/edit form
│   │       └── admin-job-applications.tsx  # Applications list
│   └── careers/
│       └── job-application-modal.tsx       # Application form modal
├── lib/
│   └── resume-upload-utils.ts             # Resume file handling utilities
├── models/
│   ├── Job.ts                              # Job mongoose model
│   └── JobApplication.ts                   # Application mongoose model
└── types/
    └── career.ts                           # TypeScript types
```

## Usage

### Admin: Creating a Job
1. Navigate to `/admin/careers`
2. Click "Create Job" button
3. Fill in job details
4. Add responsibilities, requirements, and benefits
5. Toggle "Publish job immediately" if ready
6. Click "Create Job"

### Admin: Managing Applications
1. Navigate to `/admin/careers`
2. Click "Applications" tab
3. Filter by status or job
4. Update application status via dropdown
5. Download resumes or delete applications

### User: Applying for a Job
1. Visit `/careers`
2. Browse or search for jobs
3. Click "Apply Now" on desired job
4. Fill in application form
5. Upload resume (PDF/Word)
6. Submit application

## Resume Storage
- Resumes are stored locally in `public/resumes/` folder
- Unique filenames generated with timestamp and random string
- Format: `{sanitized_name}_{timestamp}_{random}.{ext}`
- Supported formats: PDF, DOC, DOCX
- Maximum file size: 5MB
- Files are automatically deleted when application is deleted
- Download API provides proper file download with correct MIME types

## Download Functionality
- Admin can download resumes via "Resume" button
- Download API endpoint: `GET /api/careers/applications/[id]/download`
- Downloaded filename format: `{ApplicantName}_Resume.{ext}`
- Proper Content-Type and Content-Disposition headers
- Automatic cleanup of blob URLs after download

## Security
- CORS headers configured for allowed origins
- File type validation (PDF, DOC, DOCX only)
- File size limit (5MB)
- Admin authentication required for management
- Public can only view published jobs

## Navigation
- Added "Careers" link to main navbar
- Added "Careers" to admin sidebar with Briefcase icon
- Accessible at `/careers` (public) and `/admin/careers` (admin)
