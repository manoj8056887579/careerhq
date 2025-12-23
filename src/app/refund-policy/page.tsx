import { Metadata } from "next";
import { LegalContent } from "@/components/legal/legal-content";
import { refundPolicyData } from "@/data/refund-policy";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Learn about Career HQ's refund policy. Understand the circumstances under which refunds may or may not be applicable for our services.",
  keywords: [
    "refund policy",
    "refund terms",
    "service fees",
    "career hq refund",
  ],
  openGraph: {
    title: "Refund Policy | Career HQ",
    description:
      "Learn about Career HQ's refund policy. Understand the circumstances under which refunds may or may not be applicable.",
    type: "website",
  },
};

export default function RefundPolicyPage() {
  return (
    <LegalContent
      title={refundPolicyData.title}
      sections={refundPolicyData.sections}
      type="refund"
    />
  );
}
