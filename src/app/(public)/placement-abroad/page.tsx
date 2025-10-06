import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "International Placement Opportunities | CareerHQ",
  description: "Explore job placements with global companies",
};

export default function PlacementAbroadPage() {
  return (
    <ModuleListingPage
      moduleType="placement-abroad"
      title="Placement Abroad"
      description="Discover international career opportunities with leading global companies" />
  );
}

