import React from "react";
import Link from "next/link";
import { Link as HeroLink } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Study Abroad",
      links: [
        { name: "United States", path: "/study-abroad/usa" },
        { name: "United Kingdom", path: "/study-abroad/uk" },
        { name: "Canada", path: "/study-abroad/canada" },
        { name: "Australia", path: "/study-abroad/australia" },
        { name: "Germany", path: "/study-abroad/germany" },
        { name: "Ireland", path: "/study-abroad/ireland" },
        { name: "France", path: "/study-abroad/france" },
        { name: "New Zealand", path: "/study-abroad/new-zealand" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", path: "/blog" },
        { name: "Career Test", path: "/career-test" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Home", path: "/" },

        { name: "About Us", path: "/about" },
        { name: "Study Abroad", path: "/study-abroad" },

        { name: "Contact", path: "/contact" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "logos:facebook", url: "https://facebook.com" },
    { name: "Twitter", icon: "logos:x", url: "https://twitter.com" },
    {
      name: "Instagram",
      icon: "logos:instagram-icon",
      url: "https://instagram.com",
    },
    {
      name: "LinkedIn",
      icon: "logos:linkedin-icon",
      url: "https://linkedin.com",
    },
    { name: "YouTube", icon: "logos:youtube-icon", url: "https://youtube.com" },
  ];

  return (
    <footer className="bg-content1 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
                <span className="text-white font-bold text-lg">CH</span>
              </div>
              <p className="font-bold text-xl">
                Career<span className="text-primary">HQ</span>
              </p>
            </Link>
            <p className="text-foreground-500 mb-6 max-w-md">
              Empowering students and professionals to achieve their
              international education and career goals through expert guidance
              and comprehensive resources.
            </p>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => (
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
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-foreground-500 text-sm text-center">
            © {currentYear} CareerHQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
