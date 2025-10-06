import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "Study in India | CareerHQ",
  description: "Find the best universities and courses in India",
};

export default function StudyIndiaPage() {
  return (
    <ModuleListingPage
      moduleType="study-india"
      title="Study in India"
      description="Explore top universities and educational programs across India"
    />
  );
}
