import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";
import CompaniesSection from "@/components/public/companies-section";
import type { UniversalModule, ModuleCategory } from "@/types/universal-module";
import type { Company } from "@/models/Company";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Placement Opportunities in India | CareerHQ",
  description: "Discover job placement opportunities across India",
};

async function getModulesData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const [modulesRes, categoriesRes, companiesRes] = await Promise.all([
      fetch(
        `${baseUrl}/api/modules?moduleType=placement-india&published=true`,
        {
          cache: "no-store",
        }
      ),
      fetch(`${baseUrl}/api/modules/categories?moduleType=placement-india`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/companies?moduleType=placement-india`, {
        cache: "no-store",
      }),
    ]);

    const modules: UniversalModule[] = modulesRes.ok
      ? await modulesRes.json()
      : [];
    const categories: ModuleCategory[] = categoriesRes.ok
      ? await categoriesRes.json()
      : [];
    const companies: Company[] = companiesRes.ok
      ? await companiesRes.json()
      : [];

    return { modules, categories, companies };
  } catch (error) {
    console.error("Error fetching modules data:", error);
    return { modules: [], categories: [], companies: [] };
  }
}

export default async function PlacementIndiaPage() {
  const { modules, categories, companies } = await getModulesData();

  return (
    <>
      <ModuleListingPage
        moduleType="placement-india"
        title="Placement India"
        description="Find the best job placement opportunities with top companies in India"
        initialModules={modules}
        initialCategories={categories}
        companiesSection={<CompaniesSection companies={companies} />}
        showTrainingPlacement={true}
      />
    </>
  );
}
