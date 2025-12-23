import { Metadata } from "next";
import ModuleDetailPage from "@/components/public/module-detail-page";
import { notFound } from "next/navigation";
import { getModule } from "@/lib/get-module";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const moduleData = await getModule(id);

  if (moduleData) {
    return {
      title: `${moduleData.title} | Study India | Career HQ`,
      description: moduleData.shortDescription,
    };
  }

  return {
    title: "Study India | Career HQ",
    description:
      "Explore study India and find top educational opportunities",
  };
}

export default async function StudyIndiaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try to get module by slug first, then by ID
  const moduleData = await getModule(id, true); // true = try slug first

  if (!moduleData) {
    notFound();
  }

  return <ModuleDetailPage module={moduleData} moduleType="study-india" />;
}
