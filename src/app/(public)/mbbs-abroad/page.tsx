import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "MBBS Abroad | CareerHQ",
  description: "Study MBBS at top international medical universities",
};

export default function MBBSAbroadPage() {
  return (
    <ModuleListingPage
      moduleType="mbbs-abroad"
      title="MBBS Abroad"
      description="Pursue your medical degree at renowned universities worldwide" />
  );
}

