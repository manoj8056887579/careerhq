"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/toast";
import Script from "next/script";

interface EnquiryFormProps {
  variant?: "default" | "compact";
  title?: string;
  subtitle?: string;
}

export type EnquiryFormHandle = {
  focus: () => void;
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
};

// Extend Window interface for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

export const EnquiryForm = React.forwardRef<
  EnquiryFormHandle,
  EnquiryFormProps
>(
  (
    {
      variant = "default",
      title = "Get Expert Guidance",
      subtitle = "Fill out the form below and our education consultants will get back to you within 24 hours.",
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        const el =
          rootRef.current?.querySelector<HTMLInputElement>(
            'input[name="name"]'
          );
        if (el) el.focus();
      },
      scrollIntoView: (options?: ScrollIntoViewOptions) => {
        rootRef.current?.scrollIntoView(options);
      },
    }));

    const [formData, setFormData] = React.useState({
      name: "",
      email: "",
      phone: "",
      preference: "",
      message: "",
      consent: false,
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [validationErrors, setValidationErrors] = React.useState<{
      name?: string;
      email?: string;
      phone?: string;
      consent?: string;
    }>({});
    const [touched, setTouched] = React.useState<{
      name: boolean;
      email: boolean;
      phone: boolean;
      consent: boolean;
    }>({
      name: false,
      email: false,
      phone: false,
      consent: false,
    });

    // Validation functions
    const validateName = (name: string): string | undefined => {
      if (!name.trim()) {
        return "Full name is required";
      }
      return undefined;
    };

    const validateEmail = (email: string): string | undefined => {
      if (!email.trim()) {
        return "Email address is required";
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
      // Remove all non-numeric characters for validation
      const numericPhone = phone.replace(/\D/g, "");
      if (numericPhone.length < 10) {
        return "Phone number must be at least 10 digits";
      }
      return undefined;
    };

    const validateConsent = (consent: boolean): string | undefined => {
      if (!consent) {
        return "You must consent to be contacted";
      }
      return undefined;
    };

    const handleBlur = (field: "name" | "email" | "phone" | "consent") => {
      setTouched({ ...touched, [field]: true });
      let error: string | undefined;
      switch (field) {
        case "name":
          error = validateName(formData.name);
          break;
        case "email":
          error = validateEmail(formData.email);
          break;
        case "phone":
          error = validatePhone(formData.phone);
          break;
        case "consent":
          error = validateConsent(formData.consent);
          break;
      }
      setValidationErrors({ ...validationErrors, [field]: error });
    };

    const validateForm = () => {
      const errors = {
        name: validateName(formData.name),
        email: validateEmail(formData.email),
        phone: validatePhone(formData.phone),
        consent: validateConsent(formData.consent),
      };
      setValidationErrors(errors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        consent: true,
      });
      return !errors.name && !errors.email && !errors.phone && !errors.consent;
    };

    const isFormValid = () => {
      return (
        formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.consent &&
        !validateName(formData.name) &&
        !validateEmail(formData.email) &&
        !validatePhone(formData.phone)
      );
    };

    const handleRecaptchaLoad = () => {
      console.log("✅ reCAPTCHA v3 loaded successfully");
      // Show the reCAPTCHA badge
      if (typeof window !== "undefined" && window.grecaptcha) {
        console.log("reCAPTCHA ready for use");
      }
    };

    const executeRecaptcha = async (): Promise<string | null> => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

      // Skip if not configured or in development
      if (!siteKey || siteKey === "your_recaptcha_site_key_here") {
        console.log("reCAPTCHA not configured, skipping");
        return null;
      }

      if (typeof window === "undefined" || !window.grecaptcha) {
        console.warn("reCAPTCHA not loaded yet");
        return null;
      }

      try {
        const token = await window.grecaptcha.execute(siteKey, {
          action: "submit",
        });
        console.log("reCAPTCHA token generated successfully");
        return token;
      } catch (error) {
        console.error("reCAPTCHA execution error:", error);
        return null;
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        addToast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly",
          color: "danger",
        });
        return;
      }

      setError(null);
      setIsSubmitting(true);

      try {
        // Execute reCAPTCHA
        const token = await executeRecaptcha();

        // Format phone number
        const formattedPhone = formData.phone.startsWith("+")
          ? formData.phone
          : formData.phone.startsWith("91")
          ? `+${formData.phone}`
          : `+91${formData.phone}`;

        // Submit to API
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formattedPhone,
            preference: formData.preference,
            message: formData.message,
            consent: formData.consent,
            program: "Enquiry Form",
            recaptchaToken: token,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 409) {
            throw new Error(
              data.error || "This email or phone number is already registered."
            );
          }
          throw new Error(data.error || "Failed to submit enquiry");
        }

        addToast({
          title: "Success!",
          description: "Your enquiry has been submitted successfully",
          color: "success",
        });

        setIsSubmitted(true);

        // Reset form after showing success message
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            preference: "",
            message: "",
            consent: false,
          });
          setTouched({
            name: false,
            email: false,
            phone: false,
            consent: false,
          });
          setValidationErrors({});
        }, 3000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to submit form";
        setError(errorMessage);
        addToast({
          title: "Submission Failed",
          description: errorMessage,
          color: "danger",
        });
        console.error("Form submission error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    return (
      <>
        {/* Load reCAPTCHA script */}
        {recaptchaSiteKey &&
          recaptchaSiteKey !== "your_recaptcha_site_key_here" && (
            <Script
              src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
              onLoad={handleRecaptchaLoad}
              strategy="lazyOnload"
            />
          )}

        <div ref={rootRef} className="w-full">
          <Card className="border border-default-200 w-full">
            <CardBody
              className={
                variant === "compact"
                  ? "p-3 xs:p-4 sm:p-5"
                  : "p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8"
              }
            >
              {!isSubmitted ? (
                <>
                  <div className="mb-3 xs:mb-4 sm:mb-5 md:mb-6">
                    <h3
                      className={`font-semibold ${
                        variant === "compact"
                          ? "text-sm xs:text-base sm:text-lg"
                          : "text-base xs:text-lg sm:text-xl md:text-2xl"
                      } mb-1 xs:mb-1.5 sm:mb-2`}
                    >
                      {title}
                    </h3>
                    <p className="text-foreground-500 text-[11px] xs:text-xs sm:text-sm leading-tight">
                      {subtitle}
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-2.5 xs:space-y-3 sm:space-y-4"
                  >
                    {/* Name and Email - Stack on mobile, side by side on tablet+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 xs:gap-3 sm:gap-4">
                      <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        name="name"
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
                        isRequired
                        variant="bordered"
                        startContent={
                          <Icon
                            icon="lucide:user"
                            className="text-default-400 text-sm xs:text-base"
                          />
                        }
                        isInvalid={touched.name && !!validationErrors.name}
                        errorMessage={
                          touched.name && validationErrors.name
                            ? validationErrors.name
                            : ""
                        }
                        classNames={{
                          label: "text-xs xs:text-sm",
                          input: "text-xs xs:text-sm sm:text-base",
                          inputWrapper: "min-h-[40px] xs:min-h-[44px]",
                          errorMessage: "text-[10px] xs:text-xs",
                        }}
                      />

                      <Input
                        label="Email Address"
                        placeholder="Enter your email address"
                        name="email"
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
                        isRequired
                        variant="bordered"
                        startContent={
                          <Icon
                            icon="lucide:mail"
                            className="text-default-400 text-sm xs:text-base"
                          />
                        }
                        isInvalid={touched.email && !!validationErrors.email}
                        errorMessage={
                          touched.email && validationErrors.email
                            ? validationErrors.email
                            : ""
                        }
                        classNames={{
                          label: "text-xs xs:text-sm",
                          input: "text-xs xs:text-sm sm:text-base",
                          inputWrapper: "min-h-[40px] xs:min-h-[44px]",
                          errorMessage: "text-[10px] xs:text-xs",
                        }}
                      />
                    </div>

                    {/* Phone and Preference - Stack on mobile, side by side on tablet+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 xs:gap-3 sm:gap-4">
                      <Input
                        label="Phone Number"
                        placeholder="Enter phone number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          // Allow only numbers, +, and spaces
                          const value = e.target.value.replace(/[^\d+\s]/g, "");
                          setFormData({ ...formData, phone: value });
                          if (touched.phone) {
                            setValidationErrors({
                              ...validationErrors,
                              phone: validatePhone(value),
                            });
                          }
                        }}
                        onBlur={() => handleBlur("phone")}
                        isRequired
                        variant="bordered"
                        startContent={
                          <Icon
                            icon="lucide:phone"
                            className="text-default-400 text-sm xs:text-base"
                          />
                        }
                        isInvalid={touched.phone && !!validationErrors.phone}
                        errorMessage={
                          touched.phone && validationErrors.phone
                            ? validationErrors.phone
                            : ""
                        }
                        classNames={{
                          label: "text-xs xs:text-sm",
                          input: "text-xs xs:text-sm sm:text-base",
                          inputWrapper: "min-h-[40px] xs:min-h-[44px]",
                          description: "text-[10px] xs:text-xs",
                          errorMessage: "text-[10px] xs:text-xs",
                        }}
                      />

                      <Input
                        label="Preference (Optional)"
                        placeholder="e.g., Canada, Harvard"
                        name="preference"
                        value={formData.preference}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preference: e.target.value,
                          })
                        }
                        variant="bordered"
                        startContent={
                          <Icon
                            icon="lucide:star"
                            className="text-default-400 text-sm xs:text-base"
                          />
                        }
                        classNames={{
                          label: "text-xs xs:text-sm",
                          input: "text-xs xs:text-sm sm:text-base",
                          inputWrapper: "min-h-[40px] xs:min-h-[44px]",
                          description: "text-[10px] xs:text-xs",
                        }}
                      />
                    </div>

                    <Textarea
                      label="Message (Optional)"
                      placeholder="Enter your message..."
                      name="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      variant="bordered"
                      minRows={3}
                      classNames={{
                        label: "text-xs xs:text-sm",
                        input: "text-xs xs:text-sm sm:text-base",
                        inputWrapper: "min-h-[70px] xs:min-h-[80px]",
                        description: "text-[10px] xs:text-xs",
                      }}
                    />

                    <div className="space-y-1 xs:space-y-1.5 sm:space-y-2">
                      <Checkbox
                        isSelected={formData.consent}
                        onValueChange={(checked) => {
                          setFormData({ ...formData, consent: checked });
                          if (touched.consent) {
                            setValidationErrors({
                              ...validationErrors,
                              consent: validateConsent(checked),
                            });
                          }
                        }}
                        onBlur={() => handleBlur("consent")}
                        isRequired
                        isInvalid={
                          touched.consent && !!validationErrors.consent
                        }
                        classNames={{
                          label: "text-[11px] xs:text-xs sm:text-sm",
                        }}
                      >
                        <span className="text-[11px] xs:text-xs sm:text-sm leading-tight">
                          Team HQ contacting me and There is terms and condition in all register
                        </span>
                      </Checkbox>
                      {touched.consent && validationErrors.consent && (
                        <p className="text-danger text-[10px] xs:text-xs pl-5 xs:pl-6">
                          {validationErrors.consent}
                        </p>
                      )}
                    </div>

                    <div className="text-[10px] xs:text-[11px] sm:text-xs text-foreground-400 flex items-start gap-1 xs:gap-1.5 sm:gap-2">
                      <Icon
                        icon="lucide:shield-check"
                        className="text-[11px] xs:text-xs sm:text-sm flex-shrink-0 mt-0.5"
                      />
                      <span className="leading-tight">
                        This site is protected by reCAPTCHA and the Google
                        Privacy Policy and Terms of Service apply.
                      </span>
                    </div>

                    {error && (
                      <div className="p-2 xs:p-2.5 sm:p-3 bg-danger/10 border border-danger/20 rounded-lg">
                        <div className="flex items-start gap-1.5 xs:gap-2 text-danger">
                          <Icon
                            icon="lucide:alert-circle"
                            className="text-sm xs:text-base sm:text-lg flex-shrink-0 mt-0.5"
                          />
                          <span className="text-[11px] xs:text-xs sm:text-sm leading-tight">
                            {error}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      className="w-full font-medium text-xs xs:text-sm sm:text-base min-h-[40px] xs:min-h-[44px] sm:min-h-[48px]"
                      isLoading={isSubmitting}
                      isDisabled={!isFormValid() || isSubmitting}
                      startContent={
                        !isSubmitting && (
                          <Icon icon="lucide:send" className="text-base xs:text-lg" />
                        )
                      }
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-4 xs:py-6 sm:py-8 md:py-10 px-3 xs:px-4"
                >
                  <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-success/10 rounded-full flex items-center justify-center mb-2 xs:mb-3 sm:mb-4">
                    <Icon
                      icon="lucide:check"
                      className="text-success text-lg xs:text-xl sm:text-2xl"
                    />
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold mb-1.5 xs:mb-2">
                    Thank You!
                  </h3>
                  <p className="text-center text-foreground-500 text-xs xs:text-sm sm:text-base max-w-md leading-relaxed">
                    Your enquiry has been submitted successfully. Our team will
                    contact you shortly.
                  </p>
                </motion.div>
              )}
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
);

EnquiryForm.displayName = "EnquiryForm";
