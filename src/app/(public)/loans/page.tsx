import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "Education Loans | CareerHQ",
  description: "Find the best education loan options for your studies",
};

export default function LoansPage() {
  return (
    <ModuleListingPage
      moduleType="loans"
      title="Education Loans"
      description="Compare and find the best education loan options to fund your dreams" />
  );
}

