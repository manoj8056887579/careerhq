"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface Section {
  title: string;
  content: string | string[];
  icon?: string;
  subsections?: { title: string; content: string | string[] }[];
}

interface LegalContentProps {
  title: string;
  lastUpdated?: string;
  sections: Section[];
  type: "terms" | "privacy";
}

export const LegalContent: React.FC<LegalContentProps> = ({
  title,
  sections,
  type,
}) => {
  const [activeSection, setActiveSection] = React.useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const sectionRefs = React.useRef<(HTMLElement | null)[]>([]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Scroll spy effect to track active section
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const section = sectionRefs.current[index];
    if (section) {
      const yOffset = -100;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl flex items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <Icon
                icon={
                  type === "terms" ? "lucide:file-text" : "lucide:shield-check"
                }
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-3 sm:mb-4 px-2">
            {title}
          </h1>
        </motion.div>
      </div>

      {/* Mobile Table of Contents Toggle */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full py-4 flex items-center justify-between text-gray-900 font-medium"
          >
            <span className="flex items-center gap-2 text-sm sm:text-base">
              <Icon icon="lucide:list" className="w-5 h-5 text-blue-600" />
              Table of Contents
            </span>
            <Icon
              icon={
                isMobileMenuOpen ? "lucide:chevron-up" : "lucide:chevron-down"
              }
              className="w-5 h-5 text-gray-600"
            />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-white max-h-[60vh] overflow-y-auto"
          >
            <nav className="px-4 sm:px-6 py-4 space-y-2">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 ${
                    activeSection === index
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    {section.icon && (
                      <Icon
                        icon={section.icon}
                        className={`w-4 h-4 flex-shrink-0 ${
                          activeSection === index
                            ? "text-white"
                            : "text-blue-600"
                        }`}
                      />
                    )}
                    <span className="text-xs sm:text-sm font-medium">
                      {section.title}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Desktop Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block lg:col-span-3"
          >
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="lucide:list" className="w-5 h-5 text-blue-600" />
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === index
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon && (
                        <Icon
                          icon={section.icon}
                          className={`w-4 h-4 flex-shrink-0 ${
                            activeSection === index
                              ? "text-white"
                              : "text-blue-600"
                          }`}
                        />
                      )}
                      <span className="text-sm font-medium line-clamp-2">
                        {section.title}
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Content Area */}
          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-9"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-12">
              {sections.map((section, index) => (
                <motion.section
                  key={index}
                  ref={(el) => {
                    sectionRefs.current[index] = el;
                  }}
                  id={`section-${index}`}
                  variants={itemVariants}
                  className="mb-8 sm:mb-10 md:mb-12 last:mb-0 scroll-mt-32 lg:scroll-mt-24"
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {section.icon && (
                      <div className="bg-blue-100 p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
                        <Icon
                          icon={section.icon}
                          className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
                        {index + 1}. {section.title}
                      </h2>
                      <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="ml-0 sm:ml-12 md:ml-16 space-y-3 sm:space-y-4">
                    {Array.isArray(section.content) ? (
                      section.content.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="text-gray-700 leading-relaxed text-sm sm:text-base"
                        >
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {section.content}
                      </p>
                    )}

                    {section.subsections && (
                      <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                        {section.subsections.map((subsection, subIndex) => (
                          <div
                            key={subIndex}
                            className="pl-3 sm:pl-4 md:pl-6 border-l-2 sm:border-l-4 border-blue-200"
                          >
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 break-words">
                              {index + 1}.{subIndex + 1} {subsection.title}
                            </h3>
                            {Array.isArray(subsection.content) ? (
                              <ul className="space-y-2">
                                {subsection.content.map((item, itemIndex) => (
                                  <li
                                    key={itemIndex}
                                    className="flex items-start gap-2 sm:gap-3 text-gray-700"
                                  >
                                    <Icon
                                      icon="lucide:check-circle"
                                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
                                    />
                                    <span className="leading-relaxed text-sm sm:text-base break-words">
                                      {item}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                {subsection.content}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.section>
              ))}

              {/* Contact Section */}
              <motion.div
                variants={itemVariants}
                className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200"
              >
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="bg-blue-600 p-2.5 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0">
                      <Icon
                        icon="lucide:mail"
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        Questions or Concerns?
                      </h3>
                      <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                        If you have any questions about{" "}
                        {type === "terms"
                          ? "these terms"
                          : "this privacy policy"}
                        , please contact us:
                      </p>
                      <div className="flex flex-col gap-2">
                        <a
                          href="mailto:info@career-hq.com"
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-sm sm:text-base break-all"
                        >
                          <Icon
                            icon="lucide:mail"
                            className="w-4 h-4 flex-shrink-0"
                          />
                          <span>info@career-hq.com</span>
                        </a>
                        <a
                          href="/contact"
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-sm sm:text-base"
                        >
                          <Icon
                            icon="lucide:message-circle"
                            className="w-4 h-4 flex-shrink-0"
                          />
                          <span>Contact Form</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};
