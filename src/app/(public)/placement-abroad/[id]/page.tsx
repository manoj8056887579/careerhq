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
      title: `${moduleData.title} | Placement Abroad | Career HQ`,
      description: moduleData.shortDescription,
    };
  }

  return {
    title: "Placement Abroad | Career HQ",
    description: "Explore international placement opportunities",
  };
}

export default async function PlacementAbroadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Try to get module by slug first, then by ID
  const moduleData = await getModule(id, true);

  if (!moduleData) {
    notFound();
  }

  return <ModuleDetailPage module={moduleData} moduleType="placement-abroad" />;
}
