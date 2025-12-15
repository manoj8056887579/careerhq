"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { TestimonialCard } from "@/components/testimonial-card";
import { EnquiryForm } from "@/components/enquiry-form";

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-16 ">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient-primary">CareerHQ</span>
            </h1>
            <p className="text-xl text-foreground-600 mb-8">
             Welcome to Career Head Quarters — your trusted partner in education, placement, and global opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-foreground-600 mb-4">
                CareerHQ began with a simple vision – to make global education
                and career guidance accessible to every student. What started as
                a small counseling center has now evolved into a trusted global
                education consultancy, connecting worldwide career at one dot.
              </p>
              <p className="text-foreground-600 mb-4">
                Over the years, we've helped thousands of students turn their
                dream of studying abroad into reality. With offices across
                multiple countries, CareerHQ bridges students with top
                universities and international career opportunities around the
                world.
              </p>
              <p className="text-foreground-600 mb-6">
                Our team of expert counselors – many of whom have experienced
                studying abroad themselves – provide end-to-end guidance, from
                choosing the right course and university to securing
                scholarships and handling visa procedures.
              </p>
              <p className="text-foreground-600 mb-6">
                At CareerHQ, we believe in more than just admissions; we believe
                in connecting students to a world of limitless career
                possibilities, all at one dot.
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
                <h3 className="text-2xl font-semibold mb-3">Study Abroad Services</h3>
                <p className="text-foreground-600">
                  From course selection to visa assistance, we provide end-to-end support that makes global education accessible, smooth, and stress-free.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200 hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-14 h-14 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
                  <Icon icon="lucide:graduation-cap" className="text-secondary text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Admissions in Indian Universities</h3>
                <p className="text-foreground-600">
                  We help students secure seats in reputable Indian universities through personalized counseling, documentation guidance, and transparent processes.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200 hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center mb-4">
                  <Icon icon="lucide:briefcase" className="text-success text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Placement in India</h3>
                <p className="text-foreground-600">
                  Our strong industry partnerships open the door to diverse job opportunities for freshers and experienced professionals across India.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200 hover:shadow-xl transition-shadow">
              <CardBody className="p-8">
                <div className="w-14 h-14 rounded-full bg-warning-100 flex items-center justify-center mb-4">
                  <Icon icon="lucide:globe-2" className="text-warning text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Placement Abroad</h3>
                <p className="text-foreground-600">
                  We connect candidates to global employers, helping them build successful international careers with ethical, verified, and high-quality opportunities.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Mission & Vision</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Guiding principles that drive everything we do at Career Head Quarters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-default-200">
              <CardBody className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <Icon icon="lucide:target" className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-foreground-600">
                  At Career Head Quarters, our mission is to empower individuals to realize their fullest potential and build meaningful, sustainable career paths. We inspire growth, enable informed choices, and create a future where every person has the opportunity to thrive professionally with global exposure.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-default-200">
              <CardBody className="p-6">
                <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
                  <Icon icon="lucide:eye" className="text-secondary text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-foreground-600">
                  To become a trusted global gateway for education, careers, and professional development—empowering students, professionals, and organizations to learn, grow, and succeed with future-ready skills across borders.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Core Values</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              The principles that guide our approach and define our culture
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border border-default-200 h-full">
                <CardBody className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <Icon icon={value.icon} className="text-primary text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-foreground-500">{value.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Exclusive Tie-up Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Global Exclusive Tie-up With
            </h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              We have established exclusive partnerships with leading career
              providers across 12 countries worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {[
              { name: "India", code: "in" },
              { name: "United Kingdom", code: "gb" },
              { name: "Australia", code: "au" },
              { name: "Canada", code: "ca" },
              { name: "USA", code: "us" },
              { name: "New Zealand", code: "nz" },
              { name: "Finland", code: "fi" },
              { name: "Europe", code: "eu" },
              { name: "Kyrgyzstan", code: "kg" },
              { name: "Uzbekistan", code: "uz" },
              { name: "Vietnam", code: "vn" },
              { name: "Georgia", code: "ge" },
            ].map((country, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-default-200 bg-white/80 backdrop-blur-sm"
              >
                <CardBody className="p-6 flex flex-col items-center justify-center text-center gap-3">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-gray-200">
                    <Image
                      src={`https://flagcdn.com/w160/${country.code}.png`}
                      alt={`${country.name} flag`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {country.name}
                  </h3>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What Our Students Say</h2>
            <p className="text-foreground-500 max-w-2xl mx-auto">
              Hear from our students who have successfully achieved their career
              goals with our guidance.
            </p>
          </div>

          {/* Testimonials Carousel */}
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

            {/* Pagination Dots */}
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
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Connecting worldwide career in one dot
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
                  Begin Test
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
            <div className="bg-white p-6 rounded-lg shadow-lg">
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
