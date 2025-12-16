"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { addToast } from "@heroui/toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      addToast({
        title: "Invalid Link",
        description: "Reset token is missing",
        color: "danger",
      });
      router.push("/admin/login");
    }
  }, [token, router]);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.password = "Password must contain a lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain a number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        addToast({
          title: "Reset Failed",
          description: data.error || "Failed to reset password",
          color: "danger",
        });
        return;
      }

      setIsSuccess(true);
      addToast({
        title: "Success",
        description: "Your password has been reset successfully",
        color: "success",
      });

      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      addToast({
        title: "Error",
        description: "An error occurred. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="flex flex-col gap-3 items-center pt-8 pb-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <Icon
                icon="lucide:check-circle"
                className="text-success text-3xl"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Password Reset!</h1>
              <p className="text-sm text-foreground-500 mt-1">
                Your password has been changed successfully
              </p>
            </div>
          </CardHeader>

          <CardBody className="px-8 pb-8">
            <div className="space-y-4 text-center">
              <p className="text-foreground-600">
                You can now log in with your new password.
              </p>

              <Button
                as={Link}
                href="/admin/login"
                color="primary"
                size="lg"
                className="w-full"
                startContent={<Icon icon="lucide:log-in" />}
              >
                Go to Login
              </Button>
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
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon icon="lucide:lock-keyhole" className="text-primary text-3xl" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-sm text-foreground-500 mt-1">
              Enter your new password
            </p>
          </div>
        </CardHeader>

        <CardBody className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type={showPassword ? "text" : "password"}
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: undefined });
              }}
              startContent={
                <Icon icon="lucide:lock" className="text-foreground-400" />
              }
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  <Icon
                    icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                    className="text-foreground-400 hover:text-foreground-600"
                  />
                </button>
              }
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              variant="bordered"
              size="lg"
              isRequired
              description="At least 8 characters with uppercase, lowercase, and number"
            />

            <Input
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirmPassword: undefined });
              }}
              startContent={
                <Icon icon="lucide:lock-keyhole" className="text-foreground-400" />
              }
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                >
                  <Icon
                    icon={
                      showConfirmPassword ? "lucide:eye-off" : "lucide:eye"
                    }
                    className="text-foreground-400 hover:text-foreground-600"
                  />
                </button>
              }
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              variant="bordered"
              size="lg"
              isRequired
            />

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full font-semibold"
              isLoading={isLoading}
              startContent={
                !isLoading && <Icon icon="lucide:check" className="text-xl" />
              }
            >
              {isLoading ? "Resetting..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
