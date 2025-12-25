"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { RadioGroup, Radio } from "@heroui/radio";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function PartnerApplicationPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    yearEstablished: "",
    website: "",
    country: "",
    contactName: "",
    designation: "",
    email: "",
    phone: "",
    servicesRefer: [] as string[],
    marketsServe: "",
    estimatedReferrals: "",
    familiarWithCommission: "",
    genuineInfo: "",
    signAgreement: "",
    partnershipReason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="border border-success-200">
            <CardBody className="p-8 text-center">
              <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="lucide:check-circle" className="text-success text-4xl" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
              <p className="text-foreground-600 mb-6">
                Thank you for your interest in partnering with Career HQ. Our team will review your
                application and get back to you within 3-5 business days.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button as={Link} href="/partner-with-us" color="primary">
                  Back to Partner Page
                </Button>
                <Button as={Link} href="/" variant="bordered">
                  Go to Home
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">
              Career HQ – B2B Referral Partner Application
            </h1>
            <p className="text-foreground-600 text-lg">
              Thank you for your interest in partnering with Career HQ. Please complete the form
              below.
            </p>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 font-medium">
                Submission does not guarantee approval.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardBody className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business / Company Name */}
                  <Input
                    label="Business / Company Name"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onValueChange={(value) =>
                      setFormData({ ...formData, businessName: value })
                    }
                    isRequired
                    variant="bordered"
                  />

                  {/* Business Type */}
                  <RadioGroup
                    label="Business Type"
                    value={formData.businessType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, businessType: value })
                    }
                    isRequired
                  >
                    <Radio value="education-consultancy">Education Consultancy</Radio>
                    <Radio value="recruitment-staffing">Recruitment / Staffing</Radio>
                    <Radio value="training-institute">Training Institute</Radio>
                    <Radio value="career-advisory">Career Advisory</Radio>
                    <Radio value="freelancer">Freelancer</Radio>
                    <Radio value="other">Other</Radio>
                  </RadioGroup>

                  {/* Year of Establishment */}
                  <Input
                    label="Year of Establishment"
                    placeholder="e.g., 2020"
                    type="number"
                    value={formData.yearEstablished}
                    onValueChange={(value) =>
                      setFormData({ ...formData, yearEstablished: value })
                    }
                    isRequired
                    variant="bordered"
                  />

                  {/* Website / LinkedIn Profile */}
                  <Input
                    label="Website / LinkedIn Profile"
                    placeholder="https://..."
                    type="url"
                    value={formData.website}
                    onValueChange={(value) => setFormData({ ...formData, website: value })}
                    isRequired
                    variant="bordered"
                  />

                  {/* Country of Operation */}
                  <Input
                    label="Country of Operation"
                    placeholder="Enter country"
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                    isRequired
                    variant="bordered"
                  />

                  {/* Contact Person Name */}
                  <Input
                    label="Contact Person Name"
                    placeholder="Enter full name"
                    value={formData.contactName}
                    onValueChange={(value) => setFormData({ ...formData, contactName: value })}
                    isRequired
                    variant="bordered"
                  />

                  {/* Designation */}
                  <Input
                    label="Designation"
                    placeholder="e.g., Director, Manager"
                    value={formData.designation}
                    onValueChange={(value) => setFormData({ ...formData, designation: value })}
                    isRequired
                    variant="bordered"
                  />

                  {/* Email Address */}
                  <Input
                    label="Email Address"
                    placeholder="email@example.com"
                    type="email"
                    value={formData.email}
                    onValueChange={(value) => setFormData({ ...formData, email: value })}
                    isRequired
                    variant="bordered"
                  />

                  {/* Phone / WhatsApp Number */}
                  <Input
                    label="Phone / WhatsApp Number"
                    placeholder="+1234567890"
                    type="tel"
                    value={formData.phone}
                    onValueChange={(value) => setFormData({ ...formData, phone: value })}
                    isRequired
                    variant="bordered"
                  />

                  {/* Services You Want to Refer */}
                  <CheckboxGroup
                    label="Services You Want to Refer"
                    value={formData.servicesRefer}
                    onValueChange={(value) =>
                      setFormData({ ...formData, servicesRefer: value })
                    }
                    isRequired
                  >
                    <Checkbox value="study-abroad">Study Abroad</Checkbox>
                    <Checkbox value="study-india">Study India</Checkbox>
                    <Checkbox value="job-professional">Job / Professional</Checkbox>
                    <Checkbox value="career-services">Career Services</Checkbox>
                    <Checkbox value="corporate-hiring">Corporate Hiring</Checkbox>
                  </CheckboxGroup>

                  {/* Countries / Markets You Serve */}
                  <Textarea
                    label="Countries / Markets You Serve"
                    placeholder="e.g., India, USA, UK, Canada..."
                    value={formData.marketsServe}
                    onValueChange={(value) => setFormData({ ...formData, marketsServe: value })}
                    isRequired
                    variant="bordered"
                    minRows={2}
                  />

                  {/* Estimated Referrals per Month */}
                  <RadioGroup
                    label="Estimated Referrals per Month"
                    value={formData.estimatedReferrals}
                    onValueChange={(value) =>
                      setFormData({ ...formData, estimatedReferrals: value })
                    }
                    isRequired
                  >
                    <Radio value="1-5">1–5</Radio>
                    <Radio value="6-10">6–10</Radio>
                    <Radio value="11-25">11–25</Radio>
                    <Radio value="25+">25+</Radio>
                  </RadioGroup>

                  {/* Are you familiar with referral commission models? */}
                  <RadioGroup
                    label="Are you familiar with referral commission models?"
                    value={formData.familiarWithCommission}
                    onValueChange={(value) =>
                      setFormData({ ...formData, familiarWithCommission: value })
                    }
                    isRequired
                    orientation="horizontal"
                  >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </RadioGroup>

                  {/* Do you agree to provide only genuine client information? */}
                  <RadioGroup
                    label="Do you agree to provide only genuine client information?"
                    value={formData.genuineInfo}
                    onValueChange={(value) => setFormData({ ...formData, genuineInfo: value })}
                    isRequired
                    orientation="horizontal"
                  >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </RadioGroup>

                  {/* Are you willing to sign a Referral Partner Agreement & NDA? */}
                  <RadioGroup
                    label="Are you willing to sign a Referral Partner Agreement & NDA?"
                    value={formData.signAgreement}
                    onValueChange={(value) => setFormData({ ...formData, signAgreement: value })}
                    isRequired
                    orientation="horizontal"
                  >
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </RadioGroup>

                  {/* Why do you want to partner with Career HQ? */}
                  <Textarea
                    label="Why do you want to partner with Career HQ?"
                    placeholder="Tell us about your interest in partnering with us..."
                    value={formData.partnershipReason}
                    onValueChange={(value) =>
                      setFormData({ ...formData, partnershipReason: value })
                    }
                    isRequired
                    variant="bordered"
                    minRows={4}
                  />

                  {/* Submit Button */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      className="flex-1 min-w-[200px]"
                    >
                      Submit Application
                    </Button>
                    <Button
                      as={Link}
                      href="/partner-with-us"
                      variant="bordered"
                      size="lg"
                      className="flex-1 min-w-[200px]"
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Error Message */}
                  {submitStatus === "error" && (
                    <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                      <p className="text-danger text-center">
                        Something went wrong. Please try again.
                      </p>
                    </div>
                  )}
                </form>
              </CardBody>
            </Card>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-foreground-600 mb-4">
              Have questions before applying?{" "}
              <Link href="/partner-with-us/faq" className="text-primary font-semibold hover:underline">
                Check our Partner FAQs
              </Link>
            </p>
            <p className="text-sm text-foreground-500">
              By submitting this form, you acknowledge that you have read and agree to our{" "}
              <Link href="/partner-with-us/agreement" className="text-primary hover:underline">
                Referral Partner Agreement
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
