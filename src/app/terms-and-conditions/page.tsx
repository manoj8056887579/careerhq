import { Metadata } from "next";
import { LegalContent } from "@/components/legal/legal-content";
import { termsAndConditionsData } from "@/data/terms-conditions";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read Career HQ's Terms and Conditions. Understand the rules and regulations governing the use of our educational consultancy and career guidance services.",
  keywords: [
    "terms and conditions",
    "terms of service",
    "user agreement",
    "legal terms",
    "career hq terms",
  ],
  openGraph: {
    title: "Terms & Conditions | Career HQ",
    description:
      "Read Career HQ's Terms and Conditions. Understand the rules and regulations governing the use of our services.",
    type: "website",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <LegalContent
      title={termsAndConditionsData.title}
      sections={termsAndConditionsData.sections}
      type="terms"
    />
  );
}
