"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { addToast } from "@heroui/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        addToast({
          title: "Error",
          description: data.error || "Failed to send reset email",
          color: "danger",
        });
        return;
      }

      setIsSubmitted(true);
      addToast({
        title: "Email Sent",
        description: "Check your inbox for password reset instructions",
        color: "success",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      addToast({
        title: "Error",
        description: "An error occurred. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="flex flex-col gap-3 items-center pt-8 pb-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <Icon
                icon="lucide:mail-check"
                className="text-success text-3xl"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Check Your Email</h1>
              <p className="text-sm text-foreground-500 mt-1">
                Password reset instructions sent
              </p>
            </div>
          </CardHeader>

          <CardBody className="px-8 pb-8">
            <div className="space-y-4 text-center">
              <p className="text-foreground-600">
                We&apos;ve sent password reset instructions to:
              </p>
              <p className="font-semibold text-primary">{email}</p>
              <p className="text-sm text-foreground-500">
                The link will expire in 1 hour. If you don&apos;t see the email,
                check your spam folder.
              </p>

              <div className="pt-4 space-y-3">
                <Button
                  as={Link}
                  href="/admin/login"
                  color="primary"
                  variant="flat"
                  size="lg"
                  className="w-full"
                  startContent={<Icon icon="lucide:arrow-left" />}
                >
                  Back to Login
                </Button>

                <Button
                  onPress={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  variant="light"
                  size="sm"
                  className="w-full"
                >
                  Send to a different email
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col gap-3 items-center pt-8 pb-4">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center">
            <Icon icon="lucide:key-round" className="text-warning text-3xl" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Forgot Password?</h1>
            <p className="text-sm text-foreground-500 mt-1">
              No worries, we&apos;ll send you reset instructions
            </p>
          </div>
        </CardHeader>

        <CardBody className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              startContent={
                <Icon icon="lucide:mail" className="text-foreground-400" />
              }
              isInvalid={!!error}
              errorMessage={error}
              variant="bordered"
              size="lg"
              isRequired
              description="Enter the email associated with your admin account"
            />

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full font-semibold"
              isLoading={isLoading}
              startContent={
                !isLoading && <Icon icon="lucide:send" className="text-xl" />
              }
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <Button
              as={Link}
              href="/admin/login"
              variant="light"
              size="lg"
              className="w-full"
              startContent={<Icon icon="lucide:arrow-left" />}
            >
              Back to Login
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
