"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion } from "framer-motion";

import { TestimonialCard } from "@/components/testimonial-card";
import { EnquiryForm } from "@/components/enquiry-form";
import Mentors from "@/components/mentors";
import { ChromaGrid } from "@/components/ui/chroma-grid";
import { AppleCardsCarousel } from "@/components/ui/apple-cards-carousel";

export default function AboutPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const values = [
    {
      title: "Empowerment",
      description:
        "We uplift individuals to take control of their career journeys with clarity, confidence, and independence.",
      icon: "lucide:zap",
    },
    {
      title: "Integrity",
      description:
        "We operate with honesty, transparency, and trust, ensuring ethical practices in every interaction.",
      icon: "lucide:shield",
    },
    {
      title: "Growth Mindset",
      description:
        "We believe that learning never stops and encourage continuous personal and professional evolution.",
      icon: "lucide:trending-up",
    },
    {
      title: "Inclusivity",
      description:
        "We create an environment where every individual is respected, valued, and given equal opportunity—without barriers.",
      icon: "lucide:users",
    },
    {
      title: "Innovation",
      description:
        "We embrace new ideas, forward-thinking strategies, and transformative tools that drive meaningful career advancement.",
      icon: "lucide:lightbulb",
    },
    {
      title: "Impact",
      description:
        "We define success by the positive and lasting difference we create in people's lives and career paths.",
      icon: "lucide:target",
    },
  ];
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "MBA Student, Harvard Business School",
      content:
        "CareerHQ made my dream of studying at Harvard a reality. Their counselors provided personalized guidance throughout the application process, helping me secure a scholarship as well.",
      avatarId: "👩",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Engineering Student, University of Toronto",
      content:
        "I was overwhelmed by the options until I found CareerHQ. They simplified the process and helped me find the perfect engineering program that matched my career goals.",
      avatarId: "👨",
      rating: 5,
    },
    {
      name: "Mei Lin",
      role: "Computer Science Student, University of Melbourne",
      content:
        "The visa application process seemed daunting, but CareerHQ&apos;s step-by-step guidance made it straightforward. I&apos;m now thriving in my program in Australia!",
      avatarId: "👩‍💻",
      rating: 4,
    },
    {
      name: "Sample Student",
      role: "CSE, SSN College of Engineering",
      content:
        "SSN's placement cell connected me with top recruiters; I landed a software role at a unicorn and my coding skills grew fast.",
      avatarId: "🧑‍💻",
      rating: 5,
    },
    {
      name: "Sample Student",
      role: "Civil Engineering, SRM Institute of Science & Technology",
      content:
        "SRM's placement coaching and mock interviews were game-changers — I cleared multiple rounds and joined a large MNC.",
      avatarId: "👨‍🔧",
      rating: 5,
    },
    {
      name: "Sample Student",
      role: "Health Sciences, Flinders University",
      content:
        "Flinders' internship pathways and hands-on training directly helped me secure a role in the healthcare sector.",
      avatarId: "👩‍⚕️",
      rating: 5,
    },
    {
      name: "Sample Student",
      role: "Mechanical Engineering, The University of Newcastle (Australia)",
      content:
        "Newcastle's research-driven learning gave me the technical depth to join an international engineering firm.",
      avatarId: "👨‍🔬",
      rating: 5,
    },
    {
      name: "Sample Student",
      role: "IT, EDU International (Adelaide)",
      content:
        "Practical training sessions and faculty mentorship helped me build strong skills and secure my placement.",
      avatarId: "🧑‍💼",
      rating: 5,
    },
    {
      name: "Sample Student",
      role: "Entrepreneurship, Jönköping University (Sweden)",
      content:
        "The startup-driven ecosystem at Jönköping helped me co-found a student-led venture during my course.",
      avatarId: "👨‍💼",
      rating: 5,
    },
  ];

  return (
    <>
      {/* Founder/Mentor Section - First */}
      <Mentors />

      {/* Our Story Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient-primary">CareerHQ</span>
            </h1>
            <p className="text-xl text-foreground-600 mb-8">
              Welcome to Career Head Quarters — your trusted partner in
              education, placement, and global opportunities.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-foreground-600 mb-4">
                CareerHQ started with one goal—to help students dream bigger and
                go further. What began as a small counseling center has evolved
                into a global education and career platform, enabling access to
                world-class academic and professional opportunities.
              </p>
              <p className="text-foreground-600 mb-4">
                We have helped thousands of students pursue international
                education, explore global careers, and build futures without
                borders. CareerHQ connects ambitious individuals with leading
                universities and meaningful career pathways worldwide.
              </p>
              <p className="text-foreground-600 mb-6">
                CareerHQ is led by Gandhi and Benita, whose vision is rooted in
                real-world experience. Having navigated international education
                and global career transitions themselves, they recognized the
                need for reliable, transparent, and personalized guidance. Their
                leadership has shaped CareerHQ into an organization built on
                trust, integrity, and long-term success—focused on empowering
                students and professionals to make confident, informed
                decisions.
              </p>
              <p className="text-foreground-600 mb-4">
                At CareerHQ, we don’t just support admission / placement—we
                partner in building futures. Because talent has no boundaries,
                and neither should opportunities.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  color="primary"
                  endContent={<Icon icon="lucide:arrow-right" />}
                  as={Link}
                  href="/contact"
                >
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/images/19871.jpg"
                  alt="CareerHQ Office"
                  width={400}
                  height={200}
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-100 rounded-full z-0"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What We Do</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Comprehensive services to guide your education and career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border border-default-200 hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <Icon icon="lucide:plane" className="text-primary text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Study Abroad Services
                </h3>
                <p className="text-foreground-600">
                  From course selection to visa assistance, we provide
                  end-to-end support that makes global education accessible,
                  smooth, and stress-free.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200 hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-14 h-14 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
                  <Icon
                    icon="lucide:graduation-cap"
                    className="text-secondary text-2xl"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Admissions in Indian Universities
                </h3>
                <p className="text-foreground-600">
                  We help students secure seats in reputable Indian universities
                  through personalized counseling, documentation guidance, and
                  transparent processes.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200 hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center mb-4">
                  <Icon
                    icon="lucide:briefcase"
                    className="text-success text-2xl"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Placement in India
                </h3>
                <p className="text-foreground-600">
                  Our strong industry partnerships open the door to diverse job
                  opportunities for freshers and experienced professionals
                  across India.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200 hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-14 h-14 rounded-full bg-warning-100 flex items-center justify-center mb-4">
                  <Icon
                    icon="lucide:globe-2"
                    className="text-warning text-2xl"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Placement Abroad
                </h3>
                <p className="text-foreground-600">
                  We connect candidates to global employers, helping them build
                  successful international careers with ethical, verified, and
                  high-quality opportunities.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Career HQ Section */}
      <ChromaGrid className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
            >
              Why Choose Career HQ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-foreground-600 max-w-3xl mx-auto text-lg"
            >
              Your trusted partner in shaping successful careers worldwide
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              {
                icon: "lucide:user-check",
                title: "Personalized Guidance",
                description:
                  "Tailored support for every student and job-seeker to help you achieve your unique goals.",
                gradient: "from-blue-500 to-cyan-500",
                color: "text-blue-500",
              },
              {
                icon: "lucide:network",
                title: "Trusted Network",
                description:
                  "A reliable network of universities and employers across the globe.",
                gradient: "from-purple-500 to-pink-500",
                color: "text-purple-500",
              },
              {
                icon: "lucide:eye",
                title: "Transparent Processes",
                description:
                  "No hidden steps or false promises—just honest, clear guidance every step of the way.",
                gradient: "from-green-500 to-emerald-500",
                color: "text-green-500",
              },
              {
                icon: "lucide:award",
                title: "Expert Team",
                description:
                  "Years of industry experience backing every piece of advice and support we provide.",
                gradient: "from-orange-500 to-red-500",
                color: "text-orange-500",
              },
              {
                icon: "lucide:heart",
                title: "Student-First Values",
                description:
                  "Our commitment to putting students and careers first in everything we do.",
                gradient: "from-red-500 to-pink-500",
                color: "text-red-500",
              },
              {
                icon: "lucide:globe-2",
                title: "Global Reach",
                description:
                  "Connecting worldwide careers at one dot with opportunities across 12+ countries.",
                gradient: "from-indigo-500 to-blue-500",
                color: "text-indigo-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -12,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative flex flex-col items-center text-center cursor-pointer p-6 rounded-3xl hover:bg-white/50 dark:hover:bg-gray-900/50 backdrop-blur-sm transition-all duration-300"
              >
                {/* Floating Icon with Glow Effect */}
                <motion.div
                  className="relative mb-6"
                  whileHover={{
                    scale: 1.15,
                    rotate: 360,
                    transition: { duration: 0.6, ease: "easeInOut" },
                  }}
                >
                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-60 transition-all duration-500 scale-150 group-hover:scale-[2]`}
                  />
                  {/* Icon container */}
                  <div
                    className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-500`}
                  >
                    <Icon
                      icon={feature.icon}
                      className="w-10 h-10 text-white"
                    />
                  </div>

                  {/* Animated ring */}
                  <div
                    className={`absolute inset-0 rounded-full border-2 border-transparent group-hover:border-current ${feature.color} opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500`}
                  />
                </motion.div>

                {/* Content */}
                <motion.h3
                  className="text-2xl font-bold mb-4 transition-all duration-300 group-hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                >
                  <span
                    className={`group-hover:bg-gradient-to-r group-hover:${feature.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}
                  >
                    {feature.title}
                  </span>
                </motion.h3>
                <motion.p
                  className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  {feature.description}
                </motion.p>

                {/* Decorative line */}
                <div className="mt-6 w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover:w-32 group-hover:via-primary-500 transition-all duration-500" />

                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </ChromaGrid>

      {/* Mission & Vision Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
            >
              Our Mission & Vision
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 md:mb-6 rounded-full"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-foreground-600 max-w-3xl mx-auto text-base md:text-lg px-4"
            >
              Guiding principles that drive everything we do at Career Head
              Quarters
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 max-w-6xl mx-auto items-stretch">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, rotateY: -90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative perspective-1000 flex"
            >
              <motion.div
                whileHover={{ scale: 1.02, rotateX: 5 }}
                transition={{ duration: 0.3 }}
                className="relative w-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Floating gradient orb */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-2xl"
                />

                <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-6 md:p-10 lg:p-12 rounded-2xl overflow-hidden h-full flex flex-col">
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)",
                    }}
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Number badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
                    viewport={{ once: true }}
                    className="inline-block mb-4 md:mb-6 text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text text-transparent opacity-20"
                  >
                    01
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      viewport={{ once: true }}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                    >
                      Our Mission
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      viewport={{ once: true }}
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg flex-1"
                    >
                      At Career Head Quarters, our mission is to empower
                      individuals to realize their fullest potential and build
                      meaningful, sustainable career paths. We inspire growth,
                      enable informed choices, and create a future where every
                      person has the opportunity to thrive professionally with
                      global exposure.
                    </motion.p>
                  </div>

                  {/* Decorative dots */}
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="group relative perspective-1000 flex"
            >
              <motion.div
                whileHover={{ scale: 1.02, rotateX: 5 }}
                transition={{ duration: 0.3 }}
                className="relative w-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Floating gradient orb */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -top-10 -left-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl"
                />

                <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl p-6 md:p-10 lg:p-12 rounded-2xl overflow-hidden h-full flex flex-col">
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent)",
                    }}
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1.5,
                    }}
                  />

                  {/* Number badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7, type: "spring" }}
                    viewport={{ once: true }}
                    className="inline-block mb-4 md:mb-6 text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent opacity-20"
                  >
                    02
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      viewport={{ once: true }}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    >
                      Our Vision
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1 }}
                      viewport={{ once: true }}
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg flex-1"
                    >
                      To become a trusted global gateway for education, careers,
                      and professional development—empowering students,
                      professionals, and organizations to learn, grow, and
                      succeed with future-ready skills across borders.
                    </motion.p>
                  </div>

                  {/* Decorative dots */}
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3 + 0.5,
                        }}
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
            >
              Our Core Values
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-foreground-600 max-w-3xl mx-auto text-lg"
            >
              The principles that guide our approach and define our culture
            </motion.p>
          </div>

          <AppleCardsCarousel cards={values} />
        </div>
      </section>

      {/* Global Exclusive Tie-up Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Animated background lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary-300"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 px-2">
              Global Exclusive Tie-up With
            </h2>
            <p className="text-sm sm:text-base text-foreground-500 max-w-2xl mx-auto px-4">
              We have established exclusive partnerships with leading career
              providers across 24 countries worldwide
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Connecting lines SVG overlay - Full network mesh - Hidden on mobile for performance */}
            <svg
              className="hidden sm:block absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            >
              {/* Generate comprehensive network connections */}
              {(() => {
                const positions = [
                  { x: "8%", y: "12%" },
                  { x: "25%", y: "12%" },
                  { x: "41%", y: "12%" },
                  { x: "58%", y: "12%" },
                  { x: "75%", y: "12%" },
                  { x: "92%", y: "12%" },
                  { x: "8%", y: "35%" },
                  { x: "25%", y: "35%" },
                  { x: "41%", y: "35%" },
                  { x: "58%", y: "35%" },
                  { x: "75%", y: "35%" },
                  { x: "92%", y: "35%" },
                  { x: "8%", y: "58%" },
                  { x: "25%", y: "58%" },
                  { x: "41%", y: "58%" },
                  { x: "58%", y: "58%" },
                  { x: "75%", y: "58%" },
                  { x: "92%", y: "58%" },
                  { x: "8%", y: "81%" },
                  { x: "25%", y: "81%" },
                  { x: "41%", y: "81%" },
                  { x: "58%", y: "81%" },
                  { x: "75%", y: "81%" },
                  { x: "92%", y: "81%" },
                ];

                const lines: Array<{
                  x1: string;
                  y1: string;
                  x2: string;
                  y2: string;
                }> = [];
                // Connect each country to nearby countries (within 2 positions)
                positions.forEach((pos1, i) => {
                  positions.forEach((pos2, j) => {
                    if (i < j) {
                      const distance = Math.sqrt(
                        Math.pow(parseFloat(pos1.x) - parseFloat(pos2.x), 2) +
                          Math.pow(parseFloat(pos1.y) - parseFloat(pos2.y), 2)
                      );
                      // Only connect if distance is reasonable (not too far)
                      if (distance < 50) {
                        lines.push({
                          x1: pos1.x,
                          y1: pos1.y,
                          x2: pos2.x,
                          y2: pos2.y,
                        });
                      }
                    }
                  });
                });

                return lines.map((line, i) => (
                  <motion.line
                    key={i}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="url(#lineGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.25 }}
                    transition={{ duration: 2, delay: i * 0.02 }}
                    viewport={{ once: true }}
                  />
                ));
              })()}

              {/* Animated particles moving along lines */}
              {[...Array(8)].map((_, i) => (
                <motion.circle
                  key={`particle-${i}`}
                  r="2"
                  fill="#3b82f6"
                  initial={{ cx: "8%", cy: "12%" }}
                  animate={{
                    cx: ["8%", "92%", "92%", "8%", "8%"],
                    cy: ["12%", "12%", "81%", "81%", "12%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay: i * 1.25,
                    ease: "linear",
                  }}
                  opacity={0.6}
                />
              ))}

              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                </linearGradient>
                <radialGradient id="glowGradient">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 relative"
              style={{ zIndex: 1 }}
            >
              {[
                { name: "Australia", code: "au" },
                { name: "New Zealand", code: "nz" },
                { name: "USA", code: "us" },
                { name: "Canada", code: "ca" },
                { name: "Poland", code: "pl" },
                { name: "Spain", code: "es" },
                { name: "Germany", code: "de" },
                { name: "France", code: "fr" },
                { name: "Denmark", code: "dk" },
                { name: "Austria", code: "at" },
                { name: "Netherlands", code: "nl" },
                { name: "Malta", code: "mt" },
                { name: "Lithuania", code: "lt" },
                { name: "Belgium", code: "be" },
                { name: "Finland", code: "fi" },
                { name: "Hungary", code: "hu" },
                { name: "Italy", code: "it" },
                { name: "Russia", code: "ru" },
                { name: "Singapore", code: "sg" },
                { name: "Georgia", code: "ge" },
                { name: "Sweden", code: "se" },
                { name: "United Kingdom", code: "gb" },
                { name: "Ireland", code: "ie" },
                { name: "India", code: "in" },
              ].map((country, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  viewport={{ once: true }}
                  className="group flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer relative py-2"
                >
                  {/* Pulse ring effect - Hidden on very small screens */}
                  <motion.div
                    className="hidden sm:block absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-primary-300"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.1,
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300 ring-1 sm:ring-2 ring-white"
                  >
                    <Image
                      src={`https://flagcdn.com/w160/${country.code}.png`}
                      alt={`${country.name} flag`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-primary transition-colors duration-300 text-center px-1 leading-tight">
                    {country.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What Our Students Say</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Hear from our students who have successfully achieved their career
              goals with our guidance.
            </p>
          </div>

         
          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentPage * 100}%)`,
                }}
              >
                {Array.from({
                  length: Math.ceil(testimonials.length / 3),
                }).map((_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-2"
                  >
                    {testimonials
                      .slice(pageIndex * 3, pageIndex * 3 + 3)
                      .map((testimonial, index) => (
                        <div key={index}>
                          <TestimonialCard
                            name={testimonial.name}
                            role={testimonial.role}
                            content={testimonial.content}
                            avatarId={testimonial.avatarId}
                            rating={testimonial.rating}
                          />
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>

            
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentPage === index
                        ? "bg-primary w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial page ${index + 1}`}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
               Get In Touch with DOT Agent
              </h2>
              <p className="text-white/90 mb-6">
                One destination, countless opportunities – where worldwide
                careers meet at one dot .
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  as={Link}
                  href="/career-test"
                  color="default"
                  variant="solid"
                  size="lg"
                  startContent={<Icon icon="lucide:calendar" />}
                  className="font-medium bg-white text-primary"
                >
                  Register
                </Button>
                <Button
                  as={Link}
                  href="/study-abroad"
                  variant="bordered"
                  size="lg"
                  className="font-medium text-white border-white"
                >
                  Explore Programs
                </Button>
              </div>
            </div>
            <div className=" p-6 ">
              <EnquiryForm
                title="Get Expert Guidance"
                subtitle="Fill out this form and our experts will get back to you within 24 hours."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
