// Utility functions for generating and handling URL slugs

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function generateCountrySlug(countryName: string): string {
  return generateSlug(countryName);
}

export function generateUniversitySlug(universityName: string): string {
  return generateSlug(universityName);
}

export function generateCourseSlug(programName: string): string {
  return generateSlug(programName);
}

// Helper function to find entity by slug or ID
export async function findEntityBySlugOrId<T extends Record<string, unknown>>(
  model: {
    findById: (id: string) => Promise<T | null>;
    findOne: (query: Record<string, unknown>) => Promise<T | null>;
    find: (query: Record<string, unknown>) => Promise<T[]>;
  },
  slugOrId: string,
  nameField: string = "name"
): Promise<T | null> {
  try {
    // First try to find by MongoDB ObjectId (Requirement 5.1)
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      return await model.findById(slugOrId);
    }

    // Try to find by slug field first (Requirement 5.2)
    const bySlug = await model.findOne({ slug: slugOrId });
    if (bySlug) {
      return bySlug;
    }

    // Fallback: try to find by matching slug generated from name
    // This is for backward compatibility with existing data that might not have slug field
    const byGeneratedSlug = await model.findOne({
      [nameField]: {
        $regex: new RegExp(`^${slugOrId.replace(/-/g, "\\s+")}$`, "i"),
      },
    });

    if (byGeneratedSlug) {
      return byGeneratedSlug;
    }

    return null;
  } catch (error) {
    console.error("Error finding entity by slug or ID:", error);
    return null;
  }
}

// Helper to construct URL with slugs
export function constructStudyAbroadUrl(
  countryName: string,
  universityName?: string,
  courseName?: string
): string {
  const countrySlug = generateCountrySlug(countryName);

  if (!universityName) {
    return `/study-abroad/${countrySlug}`;
  }

  const universitySlug = generateUniversitySlug(universityName);

  if (!courseName) {
    return `/study-abroad/${countrySlug}/${universitySlug}`;
  }

  const courseSlug = generateCourseSlug(courseName);
  return `/study-abroad/${countrySlug}/${universitySlug}/${courseSlug}`;
}
