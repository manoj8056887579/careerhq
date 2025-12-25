"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";
import { Checkbox } from "@heroui/checkbox";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface PartnerApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PartnerApplicationModal({
  isOpen,
  onClose,
}: PartnerApplicationModalProps) {
  const [formData, setFormData] = React.useState({
    businessName: "",
    businessType: "",
    yearEstablished: "",
    website: "",
    country: "",
    contactName: "",
    designation: "",
    email: "",
    phone: "",
    services: [] as string[],
    markets: "",
    referralsPerMonth: "",
    familiarWithCommission: "",
    agreeGenuineInfo: "",
    agreeNDA: "",
    partnershipReason: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/partner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        businessName: "",
        businessType: "",
        yearEstablished: "",
        website: "",
        country: "",
        contactName: "",
        designation: "",
        email: "",
        phone: "",
        services: [],
        markets: "",
        referralsPerMonth: "",
        familiarWithCommission: "",
        agreeGenuineInfo: "",
        agreeNDA: "",
        partnershipReason: "",
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error instanceof Error ? error.message : "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-default-200">
          <h3 className="text-2xl font-bold">
            B2B Referral Partner Application
          </h3>
          <p className="text-sm text-foreground-600 font-normal">
            Thank you for your interest in partnering with Career HQ. Please
            complete the form below. Submission does not guarantee approval.
          </p>
        </ModalHeader>
        <ModalBody className="py-6">
          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Icon
                  icon="lucide:check-circle"
                  className="text-success text-6xl mb-4"
                />
              </motion.div>
              <h4 className="text-2xl font-bold text-success mb-2">
                Application Submitted!
              </h4>
              <p className="text-foreground-600 text-center">
                Our team will review your application and contact you shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Business / Company Name"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                isRequired
                variant="bordered"
              />

              <RadioGroup
                label="Business Type"
                value={formData.businessType}
                onValueChange={(value) =>
                  setFormData({ ...formData, businessType: value })
                }
                isRequired
              >
                <Radio value="education">Education Consultancy</Radio>
                <Radio value="recruitment">Recruitment / Staffing</Radio>
                <Radio value="training">Training Institute</Radio>
                <Radio value="advisory">Career Advisory</Radio>
                <Radio value="freelancer">Freelancer</Radio>
                <Radio value="other">Other</Radio>
              </RadioGroup>

              <Input
                label="Year of Establishment"
                placeholder="e.g., 2020"
                value={formData.yearEstablished}
                onChange={(e) =>
                  setFormData({ ...formData, yearEstablished: e.target.value })
                }
                isRequired
                variant="bordered"
              />

              <Input
                label="Website / LinkedIn Profile"
                placeholder="https://"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                variant="bordered"
              />

              <Input
                label="Country of Operation"
                placeholder="Enter country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                isRequired
                variant="bordered"
              />

              <Input
                label="Contact Person Name"
                placeholder="Enter your name"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                isRequired
                variant="bordered"
              />

              <Input
                label="Designation"
                placeholder="Your role/title"
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
                isRequired
                variant="bordered"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                isRequired
                variant="bordered"
              />

              <Input
                label="Phone / WhatsApp Number"
                placeholder="+91 XXXXXXXXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                isRequired
                variant="bordered"
              />

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Services You Want to Refer{" "}
                  <span className="text-danger">*</span>
                </label>
                <div className="space-y-2 pl-1">
                  {[
                    { value: "study-abroad", label: "Study Abroad" },
                    { value: "study-india", label: "Study India" },
                    {
                      value: "job-placement",
                      label: "Job / Professional Placement",
                    },
                    { value: "career-services", label: "Career Services" },
                    { value: "corporate-hiring", label: "Corporate Hiring" },
                  ].map((service) => (
                    <Checkbox
                      key={service.value}
                      isSelected={formData.services.includes(service.value)}
                      onValueChange={() => handleServiceToggle(service.value)}
                    >
                      {service.label}
                    </Checkbox>
                  ))}
                </div>
              </div>

              <Input
                label="Countries / Markets You Serve"
                placeholder="e.g., India, USA, UK"
                value={formData.markets}
                onChange={(e) =>
                  setFormData({ ...formData, markets: e.target.value })
                }
                isRequired
                variant="bordered"
              />

              <RadioGroup
                label="Estimated Referrals per Month"
                value={formData.referralsPerMonth}
                onValueChange={(value) =>
                  setFormData({ ...formData, referralsPerMonth: value })
                }
                isRequired
              >
                <Radio value="1-5">1–5</Radio>
                <Radio value="6-10">6–10</Radio>
                <Radio value="11-25">11–25</Radio>
                <Radio value="25+">25+</Radio>
              </RadioGroup>

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

              <RadioGroup
                label="Do you agree to provide only genuine client information?"
                value={formData.agreeGenuineInfo}
                onValueChange={(value) =>
                  setFormData({ ...formData, agreeGenuineInfo: value })
                }
                isRequired
                orientation="horizontal"
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </RadioGroup>

              <RadioGroup
                label="Are you willing to sign a Referral Partner Agreement & NDA?"
                value={formData.agreeNDA}
                onValueChange={(value) =>
                  setFormData({ ...formData, agreeNDA: value })
                }
                isRequired
                orientation="horizontal"
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </RadioGroup>

              <Textarea
                label="Why do you want to partner with Career HQ?"
                placeholder="Tell us about your interest in partnering with us..."
                value={formData.partnershipReason}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    partnershipReason: e.target.value,
                  })
                }
                isRequired
                minRows={4}
                variant="bordered"
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isSubmitting}
                  startContent={!isSubmitting && <Icon icon="lucide:send" />}
                >
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
