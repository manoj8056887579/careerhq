import { Metadata } from "next";
import ModuleListingPage from "@/components/public/module-listing-page";

export const metadata: Metadata = {
  title: "LLM Programs | CareerHQ",
  description: "Explore Master of Laws (LLM) programs worldwide",
};

export default function LLMPage() {
  return (
    <ModuleListingPage
      moduleType="llm"
      title="LLM Programs"
      description="Advance your legal career with specialized LLM programs" />
  );
}

