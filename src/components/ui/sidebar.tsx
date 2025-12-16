"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

export interface SidebarProps {
  links: SidebarLink[];
  className?: string;
  onLinkClick?: (href: string) => void;
}

// Admin Footer Component
function AdminFooter({
  isExpanded,
  isMobile,
}: {
  isExpanded: boolean;
  isMobile: boolean;
}) {
  const [adminData, setAdminData] = useState<{
    email: string;
    name?: string;
  } | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch("/api/admin/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setAdminData(data.admin);
          }
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!adminData) return null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-3">
      {/* Admin Info */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 p-3 bg-danger/5 rounded-lg border border-danger/10"
          >
            <Avatar
              name={adminData.name || "Admin"}
              size="sm"
              className="bg-danger text-white flex-shrink-0"
              icon={<Icon icon="lucide:shield-check" className="text-lg" />}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate flex items-center gap-1">
                {adminData.name || "Admin"}
                <Icon
                  icon="lucide:shield-check"
                  className="text-xs text-danger flex-shrink-0"
                />
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {adminData.email}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isExpanded ? (
          <>
            <Button
              as={Link}
              href="/"
              variant="flat"
              color="default"
              className="flex-1"
              startContent={<Icon icon="lucide:home" className="text-lg" />}
            >
              Home
            </Button>
            <Button
              variant="flat"
              color="danger"
              className="flex-1"
              startContent={<Icon icon="lucide:log-out" className="text-lg" />}
              onPress={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              as={Link}
              href="/"
              isIconOnly
              variant="flat"
              color="default"
              className="flex-1"
            >
              <Icon icon="lucide:home" className="text-lg" />
            </Button>
            <Button
              isIconOnly
              variant="flat"
              color="danger"
              className="flex-1"
              onPress={handleLogout}
            >
              <Icon icon="lucide:log-out" className="text-lg" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ links, className, onLinkClick }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Default to open
  const [isPinned, setIsPinned] = useState(true); // Track if sidebar is pinned open
  const [isMobile, setIsMobile] = useState(false); // Default to false for SSR
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle link click
  const handleLinkClick = (href: string) => {
    onLinkClick?.(href);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Mobile overlay
  const MobileOverlay = () => (
    <AnimatePresence>
      {isMobile && isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </AnimatePresence>
  );

  // Sidebar content
  const SidebarContent = () => (
    <motion.div
      initial={false}
      animate={{
        width: isMobile ? "280px" : isPinned || isExpanded ? "280px" : "80px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
        "flex flex-col h-full",
        isMobile && "shadow-xl",
        className
      )}
      onMouseEnter={() => !isMobile && !isPinned && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && !isPinned && setIsExpanded(false)}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <motion.div
            initial={false}
            animate={{
              opacity: isMobile || isPinned || isExpanded ? 1 : 0,
              scale: isMobile || isPinned || isExpanded ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className="font-semibold text-lg text-gray-900 dark:text-white"
          >
            Admin Panel
          </motion.div>

          {!isMobile && (isPinned || isExpanded) && (
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => {
                setIsPinned(!isPinned);
                if (isPinned) {
                  setIsExpanded(false);
                }
              }}
              className="opacity-60 hover:opacity-100"
            >
              <svg
                className={cn(
                  "w-4 h-4 transition-transform",
                  isPinned ? "rotate-180" : ""
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link, _index) => (
          <Button
            key={link.href}
            variant={link.isActive ? "solid" : "light"}
            color={link.isActive ? "primary" : "default"}
            className={cn(
              "w-full h-12 transition-all duration-200",
              // When collapsed, center the icon and remove active button width expansion
              !isMobile && !isPinned && !isExpanded
                ? "justify-center px-3 min-w-0"
                : "justify-start",
              // Prevent active button from expanding when collapsed
              !isMobile && !isPinned && !isExpanded && link.isActive && "!w-12"
            )}
            startContent={
              <span
                className={cn(
                  "flex-shrink-0 w-5 h-5",
                  !isMobile && !isPinned && !isExpanded && "mx-0"
                )}
              >
                {link.icon}
              </span>
            }
            onPress={() => handleLinkClick(link.href)}
          >
            <AnimatePresence mode="wait">
              {(isMobile || isPinned || isExpanded) && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 text-left flex-1"
                >
                  {link.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        ))}
      </nav>

      {/* Admin Info Footer */}
      <AdminFooter
        isExpanded={isMobile || isPinned || isExpanded}
        isMobile={isMobile}
      />
    </motion.div>
  );

  // Desktop Sidebar (always render this for SSR)
  return (
    <>
      {/* Mobile Menu Button - only show after mount */}
      {mounted && isMobile && (
        <Button
          variant="light"
          isIconOnly
          className="md:hidden fixed top-4 left-4 z-50"
          onPress={() => setIsMobileOpen(true)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      )}

      {/* Mobile Overlay */}
      {mounted && <MobileOverlay />}

      {/* Mobile Sidebar */}
      {mounted && isMobile && (
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full z-50 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Desktop Sidebar - always rendered for SSR */}
      <div className="hidden md:flex h-full">
        <SidebarContent />
      </div>
    </>
  );
}

// Export mobile menu toggle hook for external control
export function useSidebarMobile() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return {
    isMobileOpen,
    openMobile: () => setIsMobileOpen(true),
    closeMobile: () => setIsMobileOpen(false),
    toggleMobile: () => setIsMobileOpen((prev) => !prev),
  };
}
