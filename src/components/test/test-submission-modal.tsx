"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface TestSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  testScore: {
    total: number;
    percentage: number;
    maxScore: number;
  };
  onSubmitSuccess?: () => void;
}

export function TestSubmissionModal({
  isOpen,
  onClose,
  testScore,
  onSubmitSuccess,
}: TestSubmissionModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [touched, setTouched] = React.useState<{
    name: boolean;
    email: boolean;
    phone: boolean;
  }>({
    name: false,
    email: false,
    phone: false,
  });

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "Name is required";
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) {
      return "Phone number is required";
    }
    return undefined;
  };

  // Validate all fields
  const validateForm = () => {
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
    };
    setValidationErrors(errors);
    return !errors.name && !errors.email && !errors.phone;
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      !validateName(formData.name) &&
      !validateEmail(formData.email) &&
      !validatePhone(formData.phone)
    );
  };

  // Handle field blur
  const handleBlur = (field: "name" | "email" | "phone") => {
    setTouched({ ...touched, [field]: true });
    const error =
      field === "name"
        ? validateName(formData.name)
        : field === "email"
        ? validateEmail(formData.email)
        : validatePhone(formData.phone);
    setValidationErrors({ ...validationErrors, [field]: error });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Format phone number - prepend +91 if not present
      const formattedPhone = formData.phone.startsWith("+91")
        ? formData.phone
        : `+91${formData.phone}`;

      // Prepare payload
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        program: "Career Test",
        message: `Career Test Score: ${testScore.total}/${testScore.maxScore} (${testScore.percentage}%)`,
      };

      // Make POST request to /api/leads
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle different error types
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              "Invalid form data. Please check your information."
          );
        } else if (response.status === 500) {
          throw new Error("Something went wrong. Please try again later.");
        } else {
          throw new Error("Failed to submit. Please try again.");
        }
      }

      // Success - set submitted state
      setIsSubmitted(true);

      // Close modal after 2-3 seconds and call success callback
      setTimeout(() => {
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        onClose();
      }, 2500);
    } catch (err) {
      // Set appropriate error message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to submit. Please check your connection and try again."
        );
      }
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "max-w-[500px] w-[95vw] md:w-full mx-4 md:mx-0",
        wrapper: "overflow-y-auto",
        body: "py-4 md:py-6",
        header: "px-4 md:px-6 pt-4 md:pt-6",
        footer: "px-4 md:px-6 pb-4 md:pb-6",
      }}
    >
      <ModalContent>
        {() => (
          <>
            {!isSubmitted ? (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold">
                      Get Your Career Test Results
                    </h2>
                  </div>
                  <div className="mt-3 md:mt-4 p-3 md:p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Icon
                        icon="lucide:target"
                        className="text-primary text-2xl md:text-3xl flex-shrink-0"
                      />
                      <div>
                        <p className="text-xs md:text-sm text-foreground-500">
                          Your Score
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-primary">
                          {testScore.total}/{testScore.maxScore} (
                          {testScore.percentage}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <p className="text-sm md:text-base text-foreground-500 mb-3 md:mb-4">
                    Enter your details to receive personalized career guidance
                  </p>
                  <form className="flex flex-col gap-3 md:gap-4">
                    <div>
                      <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (touched.name) {
                            setValidationErrors({
                              ...validationErrors,
                              name: validateName(e.target.value),
                            });
                          }
                        }}
                        onBlur={() => handleBlur("name")}
                        startContent={
                          <Icon
                            icon="lucide:user"
                            className="text-foreground-400"
                          />
                        }
                        isRequired
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-base",
                          inputWrapper: "min-h-[44px] md:min-h-[48px]",
                        }}
                        isInvalid={touched.name && !!validationErrors.name}
                        errorMessage={
                          touched.name && validationErrors.name
                            ? validationErrors.name
                            : ""
                        }
                      />
                    </div>
                    <div>
                      <Input
                        label="Email"
                        placeholder="Enter your email address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (touched.email) {
                            setValidationErrors({
                              ...validationErrors,
                              email: validateEmail(e.target.value),
                            });
                          }
                        }}
                        onBlur={() => handleBlur("email")}
                        startContent={
                          <Icon
                            icon="lucide:mail"
                            className="text-foreground-400"
                          />
                        }
                        isRequired
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-base",
                          inputWrapper: "min-h-[44px] md:min-h-[48px]",
                        }}
                        isInvalid={touched.email && !!validationErrors.email}
                        errorMessage={
                          touched.email && validationErrors.email
                            ? validationErrors.email
                            : ""
                        }
                      />
                    </div>
                    <div>
                      <Input
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (touched.phone) {
                            setValidationErrors({
                              ...validationErrors,
                              phone: validatePhone(e.target.value),
                            });
                          }
                        }}
                        onBlur={() => handleBlur("phone")}
                        startContent={
                          <Icon
                            icon="lucide:phone"
                            className="text-foreground-400"
                          />
                        }
                        isRequired
                        variant="bordered"
                        size="lg"
                        classNames={{
                          input: "text-base",
                          inputWrapper: "min-h-[44px] md:min-h-[48px]",
                        }}
                        isInvalid={touched.phone && !!validationErrors.phone}
                        errorMessage={
                          touched.phone && validationErrors.phone
                            ? validationErrors.phone
                            : ""
                        }
                      />
                    </div>
                  </form>
                  {error && (
                    <div className="mt-3 md:mt-4 p-3 bg-danger/10 border border-danger/20 rounded-lg">
                      <div className="flex items-center gap-2 text-danger">
                        <Icon
                          icon="lucide:alert-circle"
                          className="text-lg flex-shrink-0"
                        />
                        <span className="text-sm">{error}</span>
                      </div>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full min-h-[44px] md:min-h-[48px] text-base"
                    isDisabled={!isFormValid() || isSubmitting}
                    isLoading={isSubmitting}
                    onPress={handleSubmit}
                  >
                    Submit & Get Results
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[300px]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-4 md:mb-6"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-success/20 flex items-center justify-center">
                    <Icon
                      icon="lucide:check"
                      className="text-success text-4xl md:text-5xl"
                    />
                  </div>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl font-bold mb-2 md:mb-3"
                >
                  Thank You!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm md:text-base text-foreground-500 max-w-md px-4"
                >
                  Your results have been submitted successfully. Our career
                  counselors will contact you within 24 hours.
                </motion.p>
              </motion.div>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
