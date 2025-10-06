import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "Internships in India | CareerHQ",
  description: "Find internship opportunities across India",
};

export default function InternshipIndiaPage() {
  return (
    <ModuleListingPage
      moduleType="internship-india"
      title="Internships in India"
      description="Gain valuable experience with internships at top Indian companies" />
  );
}

