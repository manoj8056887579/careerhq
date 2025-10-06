import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "Placement Opportunities in India | CareerHQ",
  description: "Discover job placement opportunities across India",
};

export default function PlacementIndiaPage() {
  return (
    <ModuleListingPage
      moduleType="placement-india"
      title="Placement in India"
      description="Find the best job placement opportunities with top companies in India" />
  );
}

