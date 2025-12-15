"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Radio, RadioGroup } from "@heroui/radio";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { careerTestQuestions } from "@/data/career-test-questions";

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: UserData) => void;
  requiredFor?: string;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  program: string;
}

export function UserRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  requiredFor = "Study Abroad",
}: UserRegistrationModalProps) {
  const [step, setStep] = useState<"form" | "questions" | "verification">("form");
  const [verificationField, setVerificationField] = useState<"email" | "phone">(
    "email"
  );
  const [verificationValue, setVerificationValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [touched, setTouched] = useState<{
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
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, "").slice(-10))) {
      return "Please enter a valid 10-digit phone number";
    }
    return undefined;
  };

  const validateForm = () => {
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
    };
    setValidationErrors(errors);
    return !errors.name && !errors.email && !errors.phone;
  };

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

  const handleVerification = async () => {
    if (!verificationValue.trim()) {
      setVerificationError(
        `Please enter your ${verificationField === "email" ? "email" : "phone number"}`
      );
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    try {
      const response = await fetch(
        `/api/leads/verify?${verificationField}=${encodeURIComponent(verificationValue)}`
      );

      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();

      if (data.exists) {
        // User exists, store in localStorage
        const userData: UserData = {
          name: data.lead.name,
          email: data.lead.email,
          phone: data.lead.phone,
          program: data.lead.program || requiredFor,
        };
        localStorage.setItem("userRegistered", "true");
        localStorage.setItem("userData", JSON.stringify(userData));
        onSuccess(userData);
        onClose();
      } else {
        setVerificationError("No account found. Please register below.");
        setStep("form");
      }
    } catch (_err) {
      setVerificationError(
        "No account found with this information. Please register below."
      );
      setStep("form");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFormNext = () => {
    if (!validateForm()) {
      return;
    }
    setStep("questions");
  };

  const areAllQuestionsAnswered = () => {
    return careerTestQuestions.every((q) => questionAnswers[q.id]);
  };

  const handleSubmit = async () => {
    if (!validateForm() || !areAllQuestionsAnswered()) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formattedPhone = formData.phone.startsWith("+91")
        ? formData.phone
        : `+91${formData.phone}`;

      // Convert answers to readable format
      const answersArray: Array<{ question: string; answer: string }> = [];
      careerTestQuestions.forEach((q) => {
        const answerValue = questionAnswers[q.id];
        if (answerValue) {
          const option = q.options?.find((opt) => opt.value === answerValue);
          answersArray.push({
            question: q.question,
            answer: option?.label || answerValue,
          });
        }
      });

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        program: requiredFor,
        message: `User registered for ${requiredFor}`,
        careerTestAnswers: answersArray,
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(
            data.error || "This email or phone number is already registered."
          );
        }
        throw new Error(data.error || "Failed to register");
      }

      // Success - store in localStorage
      const userData: UserData = {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        program: requiredFor,
      };
      localStorage.setItem("userRegistered", "true");
      localStorage.setItem("userData", JSON.stringify(userData));

      onSuccess(userData);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isDismissable={false}
      hideCloseButton
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
            <ModalHeader className="flex flex-col gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">
                  {step === "verification"
                    ? "Verify Your Account"
                    : step === "questions"
                    ? "Career Profiling Questions"
                    : "Register to Continue"}
                </h2>
                <p className="text-sm text-foreground-500 font-normal mt-1">
                  {step === "verification"
                    ? "Enter your details to verify"
                    : step === "questions"
                    ? `Step 2 of 2: Answer ${careerTestQuestions.length} quick questions`
                    : `Step 1 of 2: Enter your details to access ${requiredFor}`}
                </p>
              </div>
              {step !== "verification" && (
                <div className="flex gap-2">
                  <div
                    className={`flex-1 h-1 rounded-full ${
                      step === "form" || step === "questions"
                        ? "bg-primary"
                        : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`flex-1 h-1 rounded-full ${
                      step === "questions" ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </ModalHeader>
            <ModalBody>
              <AnimatePresence mode="wait">
                {step === "verification" ? (
                  <motion.div
                    key="verification"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-foreground-600">
                      Enter your registered{" "}
                      {verificationField === "email"
                        ? "email"
                        : "phone number"}{" "}
                      to continue
                    </p>
                    <Input
                      label={
                        verificationField === "email" ? "Email" : "Phone Number"
                      }
                      placeholder={
                        verificationField === "email"
                          ? "Enter your email"
                          : "Enter your phone number"
                      }
                      type={verificationField === "email" ? "email" : "tel"}
                      value={verificationValue}
                      onChange={(e) => {
                        setVerificationValue(e.target.value);
                        setVerificationError("");
                      }}
                      startContent={
                        <Icon
                          icon={
                            verificationField === "email"
                              ? "lucide:mail"
                              : "lucide:phone"
                          }
                          className="text-foreground-400"
                        />
                      }
                      variant="bordered"
                      size="lg"
                      isInvalid={!!verificationError}
                      errorMessage={verificationError}
                    />
                    <div className="flex gap-2">
                      <Button
                        color="primary"
                        onPress={handleVerification}
                        isLoading={isVerifying}
                        className="flex-1"
                      >
                        Verify
                      </Button>
                      <Button
                        variant="flat"
                        onPress={() => {
                          setStep("form");
                          setVerificationValue("");
                          setVerificationError("");
                        }}
                      >
                        Back
                      </Button>
                    </div>
                    <Button
                      variant="light"
                      size="sm"
                      onPress={() => {
                        setVerificationField(
                          verificationField === "email" ? "phone" : "email"
                        );
                        setVerificationValue("");
                        setVerificationError("");
                      }}
                      className="w-full"
                    >
                      Use{" "}
                      {verificationField === "email"
                        ? "phone number"
                        : "email"}{" "}
                      instead
                    </Button>
                  </motion.div>
                ) : step === "questions" ? (
                  <motion.div
                    key="questions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <p className="text-sm text-foreground-600 mb-4">
                      Please answer these questions to help us serve you better
                    </p>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                      {careerTestQuestions.map((question, index) => (
                        <div key={question.id} className="space-y-3">
                          <h3 className="text-sm font-medium">
                            {index + 1}. {question.question}
                          </h3>
                          <RadioGroup
                            value={questionAnswers[question.id] || ""}
                            onValueChange={(value) =>
                              setQuestionAnswers({
                                ...questionAnswers,
                                [question.id]: value,
                              })
                            }
                            orientation="vertical"
                            className="gap-2"
                          >
                            {question.options?.map((option) => (
                              <Radio
                                key={option.value}
                                value={option.value}
                                classNames={{
                                  base: "max-w-full",
                                }}
                              >
                                {option.label}
                              </Radio>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="registration"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
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
                      isInvalid={touched.name && !!validationErrors.name}
                      errorMessage={
                        touched.name && validationErrors.name
                          ? validationErrors.name
                          : ""
                      }
                    />
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
                      isInvalid={touched.email && !!validationErrors.email}
                      errorMessage={
                        touched.email && validationErrors.email
                          ? validationErrors.email
                          : ""
                      }
                    />
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
                      isInvalid={touched.phone && !!validationErrors.phone}
                      errorMessage={
                        touched.phone && validationErrors.phone
                          ? validationErrors.phone
                          : ""
                      }
                    />
                    {error && (
                      <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
                        <div className="flex items-center gap-2 text-danger">
                          <Icon
                            icon="lucide:alert-circle"
                            className="text-lg flex-shrink-0"
                          />
                          <span className="text-sm">{error}</span>
                        </div>
                      </div>
                    )}
                    <Checkbox
                      size="sm"
                      onValueChange={(checked) => {
                        if (checked) {
                          setStep("verification");
                        }
                      }}
                    >
                      <span className="text-sm">
                        Already filled the form? Click to verify
                      </span>
                    </Checkbox>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModalBody>
            {step === "form" && (
              <ModalFooter>
                <Button
                  color="primary"
                  size="lg"
                  className="w-full"
                  isDisabled={!isFormValid()}
                  onPress={handleFormNext}
                >
                  Next: Answer Questions
                </Button>
              </ModalFooter>
            )}
            {step === "questions" && (
              <ModalFooter className="flex gap-2">
                <Button
                  variant="flat"
                  size="lg"
                  onPress={() => setStep("form")}
                >
                  Back
                </Button>
                <Button
                  color="primary"
                  size="lg"
                  className="flex-1"
                  isDisabled={!areAllQuestionsAnswered() || isSubmitting}
                  isLoading={isSubmitting}
                  onPress={handleSubmit}
                >
                  Submit & Continue
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
