"use client";

import Link from "next/link";
import { Button } from "@heroui/button";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function PartnerFAQPage() {
  const faqs = [
    {
      question: "Who can become a Career HQ referral partner?",
      answer:
        "Any business or professional working with students, job seekers, or corporates can apply, subject to review. This includes education consultancies, recruitment agencies, training institutes, career advisors, and corporate HR partners.",
    },
    {
      question: "Is there any cost to become a partner?",
      answer:
        "No. There is no registration or onboarding fee. Partnership with Career HQ is completely free to join.",
    },
    {
      question: "Do you guarantee approvals, jobs, or visas?",
      answer:
        "No. Career HQ follows a strict no-guarantee, no-false-promises policy. We provide professional services and support, but we do not guarantee approvals, job placements, or visa outcomes as these depend on multiple factors beyond our control.",
    },
    {
      question: "How is commission calculated?",
      answer:
        "Commission is based on successful cases and agreed milestones. The specific commission structure and rates are shared with approved partners after the partnership agreement is signed. Commission varies by service type and case complexity.",
    },
    {
      question: "When is commission paid?",
      answer:
        "Commission is paid after service completion and receipt of payment from the client. Payment timelines are typically 15-30 days after the client payment is received, as specified in the partner agreement.",
    },
    {
      question: "Can I use Career HQ branding?",
      answer:
        "Only with prior written approval. Partners must request permission before using Career HQ logos, branding materials, or representing themselves as official Career HQ representatives. Unauthorized use of branding is prohibited.",
    },
    {
      question: "Is an agreement mandatory?",
      answer:
        "Yes. Approved partners must sign a Referral Partner Agreement & NDA (Non-Disclosure Agreement) before they can start referring clients. This protects both parties and ensures clear terms of engagement.",
    },
    {
      question: "Can the partnership be terminated?",
      answer:
        "Yes. Either party may terminate the partnership with written notice as per the terms specified in the agreement. Career HQ reserves the right to terminate immediately in cases of breach, misconduct, or unethical practices.",
    },
    {
      question: "What services can I refer clients for?",
      answer:
        "Partners can refer clients for Study Abroad, Study India, Job/Professional Placement, Career Services, and Corporate Hiring. You can choose to refer for one or multiple service categories based on your expertise and client base.",
    },
    {
      question: "How long does the approval process take?",
      answer:
        "The review process typically takes 3-5 business days after application submission. We evaluate each application carefully to ensure alignment with our values and partnership criteria.",
    },
    {
      question: "What happens if my application is rejected?",
      answer:
        "If your application doesn't meet our current partnership criteria, we'll notify you via email. You may reapply after 6 months if your business circumstances change or if you can better demonstrate alignment with our requirements.",
    },
    {
      question: "Do I need to be exclusive to Career HQ?",
      answer:
        "No, we don't require exclusivity. However, we expect partners to maintain ethical standards and not misrepresent our services or make false promises to clients.",
    },
    {
      question: "What support do partners receive?",
      answer:
        "Approved partners receive dedicated support including a partner success manager, marketing materials (with approval), training on our services, regular updates, and access to a partner portal for tracking referrals.",
    },
    {
      question: "How do I submit referrals?",
      answer:
        "Approved partners receive access to our partner portal where they can submit client referrals through a secure online form. All referrals must include genuine client information and consent.",
    },
    {
      question: "What information is considered confidential?",
      answer:
        "Confidential information includes client data, business strategies, pricing, commission structures, internal processes, marketing materials, and any proprietary information shared during the partnership. All partners must sign an NDA.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="pt-32 lg:pt-40 pb-16 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="lucide:help-circle" className="text-primary text-4xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Referral Partner FAQs
              </h1>
              <p className="text-xl text-foreground-600">
                Find answers to common questions about partnering with Career HQ
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Accordion
                variant="splitted"
                selectionMode="multiple"
                className="gap-4"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    aria-label={faq.question}
                    title={
                      <span className="font-semibold text-lg">
                        {faq.question}
                      </span>
                    }
                    className="bg-white border border-default-200 rounded-lg px-6 py-2 hover:shadow-md transition-shadow"
                    indicator={({ isOpen }) => (
                      <Icon
                        icon={
                          isOpen
                            ? "lucide:chevron-up"
                            : "lucide:chevron-down"
                        }
                        className="text-2xl text-primary"
                      />
                    )}
                  >
                    <div className="pb-4 text-foreground-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            {/* Still Have Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 text-center"
            >
              <div className="bg-white border border-default-200 rounded-2xl p-8 shadow-lg">
                <Icon
                  icon="lucide:message-circle"
                  className="text-primary text-4xl mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold mb-4">
                  Still Have Questions?
                </h3>
                <p className="text-foreground-600 mb-6">
                  Can't find the answer you're looking for? Our team is here to
                  help.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    as={Link}
                    href="/contact"
                    color="primary"
                    size="lg"
                    startContent={<Icon icon="lucide:mail" />}
                  >
                    Contact Us
                  </Button>
                  <Button
                    as={Link}
                    href="/partner-with-us/apply"
                    variant="bordered"
                    color="primary"
                    size="lg"
                    endContent={<Icon icon="lucide:arrow-right" />}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">
              Helpful Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/partner-with-us"
                className="p-6 border border-default-200 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1 text-center group"
              >
                <Icon
                  icon="lucide:handshake"
                  className="text-primary text-3xl mx-auto mb-3 group-hover:scale-110 transition-transform"
                />
                <h4 className="font-semibold mb-2">Partner Overview</h4>
                <p className="text-sm text-foreground-600">
                  Learn about partnership benefits
                </p>
              </Link>

              <Link
                href="/partner-with-us/agreement"
                className="p-6 border border-default-200 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1 text-center group"
              >
                <Icon
                  icon="lucide:file-text"
                  className="text-primary text-3xl mx-auto mb-3 group-hover:scale-110 transition-transform"
                />
                <h4 className="font-semibold mb-2">Partner Agreement</h4>
                <p className="text-sm text-foreground-600">
                  Review terms and conditions
                </p>
              </Link>

              <Link
                href="/partner-with-us/apply"
                className="p-6 border border-default-200 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1 text-center group"
              >
                <Icon
                  icon="lucide:clipboard-check"
                  className="text-primary text-3xl mx-auto mb-3 group-hover:scale-110 transition-transform"
                />
                <h4 className="font-semibold mb-2">Application Form</h4>
                <p className="text-sm text-foreground-600">
                  Start your partnership journey
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
