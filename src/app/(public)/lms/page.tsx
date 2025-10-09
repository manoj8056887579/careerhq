import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "LMS Programs | CareerHQ",
  description: "Explore Master of Laws (LMS) programs worldwide",
};

export default function LMSPage() {
  return (
    <ModuleListingPage
      moduleType="lms"
      title="LMS Programs"
      description="Advance your legal career with specialized LMS programs"
    />
  );
}
