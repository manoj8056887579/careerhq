import { Metadata } from "next";
import { LegalContent } from "@/components/legal/legal-content";
import { privacyPolicyData } from "@/data/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Career HQ collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  keywords: [
    "privacy policy",
    "data protection",
    "personal information",
    "data security",
    "career hq privacy",
  ],
  openGraph: {
    title: "Privacy Policy | Career HQ",
    description:
      "Learn how Career HQ collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalContent
      title={privacyPolicyData.title}
      lastUpdated={privacyPolicyData.lastUpdated}
      sections={privacyPolicyData.sections}
      type="privacy"
    />
  );
}
