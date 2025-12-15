"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserData } from "@/components/user-registration-modal";

interface UserRegistrationContextType {
  isRegistered: boolean;
  userData: UserData | null;
  isLoading: boolean;
  registerUser: (data: UserData) => void;
  clearRegistration: () => void;
}

const UserRegistrationContext = createContext<
  UserRegistrationContextType | undefined
>(undefined);

export function UserRegistrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const registered = localStorage.getItem("userRegistered");
    const storedData = localStorage.getItem("userData");

    if (registered === "true" && storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
        setIsRegistered(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("userRegistered");
        localStorage.removeItem("userData");
      }
    }
    setIsLoading(false);
  }, []);

  const registerUser = (data: UserData) => {
    setUserData(data);
    setIsRegistered(true);
    localStorage.setItem("userRegistered", "true");
    localStorage.setItem("userData", JSON.stringify(data));
  };

  const clearRegistration = () => {
    setUserData(null);
    setIsRegistered(false);
    localStorage.removeItem("userRegistered");
    localStorage.removeItem("userData");
  };

  return (
    <UserRegistrationContext.Provider
      value={{
        isRegistered,
        userData,
        isLoading,
        registerUser,
        clearRegistration,
      }}
    >
      {children}
    </UserRegistrationContext.Provider>
  );
}

export function useUserRegistration() {
  const context = useContext(UserRegistrationContext);
  if (context === undefined) {
    throw new Error(
      "useUserRegistration must be used within a UserRegistrationProvider"
    );
  }
  return context;
}
