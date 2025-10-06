import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "School Projects | CareerHQ",
  description: "Find educational projects and programs for school students",
};

export default function SchoolProjectsPage() {
  return (
    <ModuleListingPage
      moduleType="school-project"
      title="School Projects"
      description="Enhance learning with engaging school projects and programs" />
  );
}

