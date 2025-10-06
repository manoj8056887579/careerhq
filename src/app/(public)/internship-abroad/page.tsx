import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "International Internships | CareerHQ",
  description: "Explore internship opportunities worldwide",
};

export default function InternshipAbroadPage() {
  return (
    <ModuleListingPage
      moduleType="internship-abroad"
      title="Internships Abroad"
      description="Build your career with international internship experiences" />
  );
}

