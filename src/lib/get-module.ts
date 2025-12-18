import type { UniversalModule } from "@/types/universal-module";

export async function getModule(
  idOrSlug: string,
  preferSlug: boolean = false
): Promise<UniversalModule | null> {
  try {
    // Add query parameter to indicate we're looking for a slug
    const queryParam = preferSlug ? "?bySlug=true" : "";
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/modules/${idOrSlug}${queryParam}`,
      { cache: "no-store" }
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching module:", error);
  }

  return null;
}
