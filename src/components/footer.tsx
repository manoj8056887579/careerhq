"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Link as HeroLink } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import type { Country } from "@/types/education";
import { generateCountrySlug } from "@/lib/slug-utils";
import {
  logDataFetchError,
  logNetworkError,
  logApiError,
} from "@/utils/errorUtils";

interface AdminProfile {
  emails?: string[];
  phones?: string[];
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [adminProfile, setAdminProfile] = React.useState<AdminProfile>({});
  const [mounted, setMounted] = React.useState(false);

  const footerSections = [
   
    {
      title: "Resources",
      links: [
        // { name: "Blog", path: "/blog" },
        { name: "Career Test", path: "/career-test" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Home", path: "/" },

        { name: "About Us", path: "/about" },

        { name: "Contact", path: "/contact" },
      ],
    },
  ];

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch("/api/admin/profile/public");
      if (response.ok) {
        const data = await response.json();
        setAdminProfile(data);
      }
    } catch (error) {
      console.error("Error fetching admin profile for footer:", error);
    }
  };

  // Use useMemo to prevent hydration mismatch
  const socialLinks = React.useMemo(() => [
    { 
      name: "Facebook", 
      icon: "logos:facebook", 
      url: adminProfile.socialLinks?.facebook || "https://facebook.com",
      enabled: !!adminProfile.socialLinks?.facebook
    },
    { 
      name: "Twitter", 
      icon: "logos:x", 
      url: adminProfile.socialLinks?.twitter || "https://twitter.com",
      enabled: !!adminProfile.socialLinks?.twitter
    },
    {
      name: "Instagram",
      icon: "logos:instagram-icon",
      url: adminProfile.socialLinks?.instagram || "https://instagram.com",
      enabled: !!adminProfile.socialLinks?.instagram
    },
    {
      name: "LinkedIn",
      icon: "logos:linkedin-icon",
      url: adminProfile.socialLinks?.linkedin || "https://linkedin.com",
      enabled: !!adminProfile.socialLinks?.linkedin
    },
    { 
      name: "YouTube", 
      icon: "logos:youtube-icon", 
      url: adminProfile.socialLinks?.youtube || "https://youtube.com",
      enabled: !!adminProfile.socialLinks?.youtube
    },
  ], [adminProfile.socialLinks]);

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/countries?limit=8");

      if (!response.ok) {
        logApiError(
          `Failed to fetch countries for footer: ${response.status}`,
          "/api/countries",
          { limit: 8 },
          response.status
        );
        return;
      }

      const data = await response.json();

      if (data.countries) {
        setCountries(data.countries);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        logNetworkError(error, "/api/countries", { limit: 8 });
      } else {
        logDataFetchError(
          error instanceof Error ? error : String(error),
          "footer_countries",
          undefined,
          { limit: 8 }
        );
      }
    }
  };

  React.useEffect(() => {
    setMounted(true);
    fetchCountries();
    fetchAdminProfile();
  }, []);

  return (
    <footer className="bg-content1 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/images/career-hq-logo.png"
                alt="CareerHQ Logo"
                width={240}
                height={80}
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-foreground-500 mb-6 max-w-md">
              Empowering students and professionals to achieve their
              international education and career goals through expert guidance
              and comprehensive resources.
            </p>

            {/* Social Media Links */}
            {mounted && (
              <div className="flex gap-4 mb-6">
                {socialLinks.filter(social => social.enabled).map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-default-100 hover:bg-default-200 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon icon={social.icon} width={20} height={20} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <HeroLink
                      as={Link}
                      href={link.path}
                      color="foreground"
                      className="text-foreground-500 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </HeroLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              {adminProfile.emails && adminProfile.emails.length > 0 && (
                <div className="flex items-start gap-2">
                  <Icon icon="lucide:mail" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    {adminProfile.emails.map((email, index) => (
                      <a
                        key={index}
                        href={`mailto:${email}`}
                        className="text-foreground-500 hover:text-primary transition-colors text-sm break-all"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {adminProfile.phones && adminProfile.phones.length > 0 && (
                <div className="flex items-start gap-2">
                  <Icon icon="lucide:phone" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    {adminProfile.phones.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone}`}
                        className="text-foreground-500 hover:text-primary transition-colors text-sm"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {adminProfile.address && (
                <div className="flex items-start gap-2">
                  <Icon icon="lucide:map-pin" className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-foreground-500 text-sm">
                    {adminProfile.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-foreground-500 text-sm text-center">
            © {currentYear} CareerHQ. Powered by{" "}
            <Link
              href="https://mntfuture.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 bg-clip-text text-transparent hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-300"
            >
              MnT
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
