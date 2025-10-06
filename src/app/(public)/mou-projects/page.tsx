import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "MOU Projects | CareerHQ",
  description: "Explore partnership and collaboration opportunities",
};

export default function MOUProjectsPage() {
  return (
    <ModuleListingPage
      moduleType="mou-project"
      title="MOU Projects"
      description="Discover strategic partnerships and collaborative initiatives" />
  );
}

