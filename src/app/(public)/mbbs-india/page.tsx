import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "MBBS in India | CareerHQ",
  description: "Find the best MBBS colleges and programs in India",
};

export default function MBBSIndiaPage() {
  return (
    <ModuleListingPage
      moduleType="mbbs-india"
      title="MBBS in India"
      description="Explore top medical colleges and MBBS programs across India" />
  );
}

