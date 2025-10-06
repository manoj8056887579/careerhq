import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "University Projects | CareerHQ",
  description: "Explore research and project opportunities at universities",
};

export default function UniversityProjectsPage() {
  return (
    <ModuleListingPage
      moduleType="uni-project"
      title="University Projects"
      description="Collaborate on cutting-edge research and academic projects" />
  );
}

