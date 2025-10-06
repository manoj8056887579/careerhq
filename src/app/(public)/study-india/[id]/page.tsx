import { Metadata } from "next";
import ModuleDetailPage from "@/components/public/module-detail-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/modules/${id}`,
      { cache: "no-store" }
    );

    if (response.ok) {
      const moduleData = await response.json();
      return {
        title: `${moduleData.title} | Study India | CareerHQ`,
        description: moduleData.shortDescription,
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  return {
    title: "Study India | CareerHQ",
    description:
      "Explore study in India and find top educational opportunities",
  };
}

export default async function StudyIndiaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ModuleDetailPage moduleId={id} moduleType="study-india" />;
}
