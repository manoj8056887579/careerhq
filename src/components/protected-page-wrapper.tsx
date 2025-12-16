"use client";

import React, { useState, useEffect } from "react";
import { useUserRegistration } from "@/hooks/useUserRegistration";
import {
  UserRegistrationModal,
  UserData,
} from "@/components/user-registration-modal";

interface ProtectedPageWrapperProps {
  children: React.ReactNode;
  requiredFor: string;
  showModalOnMount?: boolean;
}

export function ProtectedPageWrapper({
  children,
  requiredFor,
  showModalOnMount = true,
}: ProtectedPageWrapperProps) {
  const { isRegistered, isLoading, registerUser } = useUserRegistration();
  const [showModal, setShowModal] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const response = await fetch("/api/admin/auth/session", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAdmin(true);
            setCanAccess(true);
          }
        }
        // 401 is expected when not logged in as admin - don't log as error
      } catch (error) {
        // Only log actual network errors, not 401s
        if (error instanceof TypeError) {
          console.error("Network error checking admin session:", error);
        }
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminSession();
  }, []);

  useEffect(() => {
    if (!isLoading && !checkingAdmin) {
      if (isAdmin) {
        // Admin has full access
        setCanAccess(true);
      } else if (isRegistered) {
        // Regular user is registered
        setCanAccess(true);
      } else if (showModalOnMount) {
        // Show registration modal for non-registered users
        setShowModal(true);
      }
    }
  }, [isLoading, isRegistered, showModalOnMount, isAdmin, checkingAdmin]);

  const handleSuccess = (userData: UserData) => {
    registerUser(userData);
    setCanAccess(true);
    setShowModal(false);
  };

  if (isLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Admin users bypass registration
  if (isAdmin) {
    return <>{children}</>;
  }

  if (!canAccess && !showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Registration Required</h2>
          <p className="text-gray-600 mb-6">
            Please register to access {requiredFor}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Register Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <UserRegistrationModal
        isOpen={showModal}
        onClose={() => {
          // Don't allow closing without registration
        }}
        onSuccess={handleSuccess}
        requiredFor={requiredFor}
      />
    </>
  );
}
