import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

// Ensure resumes directory exists
async function ensureResumesDirectory() {
  const resumesDir = path.join(process.cwd(), "public", "resumes");
  try {
    await mkdir(resumesDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
  return resumesDir;
}

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");
  return `${sanitizedName}_${timestamp}_${randomString}${extension}`;
}

// Upload resume to public folder
export async function uploadResume(file: File): Promise<string> {
  try {
    const resumesDir = await ensureResumesDirectory();
    const filename = generateUniqueFilename(file.name);
    const filepath = path.join(resumesDir, filename);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to public/resumes
    await writeFile(filepath, buffer);

    // Return the public URL path
    return `/resumes/${filename}`;
  } catch (error) {
    console.error("Error uploading resume:", error);
    throw new Error("Failed to upload resume");
  }
}

// Delete resume from public folder
export async function deleteResume(resumePath: string): Promise<void> {
  try {
    // Extract filename from path (e.g., /resumes/filename.pdf -> filename.pdf)
    const filename = path.basename(resumePath);
    const filepath = path.join(process.cwd(), "public", "resumes", filename);

    // Check if file exists before deleting
    if (fs.existsSync(filepath)) {
      await unlink(filepath);
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    // Don't throw error if file doesn't exist
  }
}

// Get resume file info
export function getResumeInfo(resumePath: string) {
  const filename = path.basename(resumePath);
  const extension = path.extname(filename).toLowerCase();
  
  let mimeType = "application/octet-stream";
  if (extension === ".pdf") {
    mimeType = "application/pdf";
  } else if (extension === ".doc") {
    mimeType = "application/msword";
  } else if (extension === ".docx") {
    mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return {
    filename,
    extension,
    mimeType,
    publicUrl: resumePath,
  };
}
