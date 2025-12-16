"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { addToast } from "@heroui/toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  useEffect(() => {
    // Check if already logged in
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/admin/auth/session");
      if (response.ok) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        addToast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          color: "danger",
        });
        return;
      }

      addToast({
        title: "Login Successful",
        description: `Welcome back, ${data.admin.name || data.admin.email}!`,
        color: "success",
      });

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      addToast({
        title: "Error",
        description: "An error occurred during login",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="flex flex-col gap-3 items-center pt-8 pb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon
              icon="lucide:shield-check"
              className="text-primary text-3xl"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-sm text-foreground-500 mt-1">
              Career HQ Admin Panel
            </p>
          </div>
        </CardHeader>

        <CardBody className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: undefined });
              }}
              startContent={
                <Icon icon="lucide:mail" className="text-foreground-400" />
              }
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              variant="bordered"
              size="lg"
              isRequired
            />

            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
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
            />

            <div className="flex justify-end">
              <Link
                href="/admin/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full font-semibold"
              isLoading={isLoading}
              startContent={
                !isLoading && <Icon icon="lucide:log-in" className="text-xl" />
              }
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-foreground-500">
              Secure admin access only
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
