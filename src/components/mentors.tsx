"use client";

import { motion } from "framer-motion";
import ProfileCard from "@/components/ui/profile-card";
import TargetCursor from "@/components/ui/target-cursor";

export default function Mentors() {
  const founders = [
    {
      name: "Gandhi",
      title: "Founder & Visionary Leader – Career HQ",
      image: "/mentors/gandhi.png",
      paragraphs: [
        "At the core of Career HQ stands Gandhi, a visionary educator and entrepreneur with over nine years of leadership experience in the educational consulting industry. Guided by a strong belief in purposeful education and ethical guidance, he has dedicated his career to shaping impactful academic and career pathways for students.",
        "A defining achievement of his journey is the successful facilitation of over 5,000 undergraduate admissions into leading deemed universities and premier colleges across Tamil Nadu. His deep industry insight, strategic institutional partnerships, and unwavering student-centric philosophy have positioned him as a trusted authority and respected leader within the education ecosystem.",
        "Gandhi's vision is rooted in delivering value through clarity, integrity, and innovation. Under his leadership, Career HQ has evolved into a premium educational consulting and placement support organization, consistently delivering measurable outcomes and long-term success for students and families.",
        "Driven by excellence and purpose, Gandhi continues to lead Career HQ with a commitment to transforming aspirations into achievements and setting new benchmarks in educational consulting.",
      ],
      quote:
        "True leadership in education is not about directing choices, but about empowering students with clarity, confidence, and the right opportunities to define their own future.",
    },
    {
      name: "Benita Samson",
      title: "Founder & Strategic Leader – Career HQ",
      image: "/mentors/benita-samson.png",
      paragraphs: [
        "At the heart of Career HQ, Benita Samson is driving the organization with a clear focus on building a nationally respected, professionally structured career enterprise. With 10 years of experience in an Australian private bank, she brings global corporate discipline, governance-led thinking, and execution excellence into the career development space.",
        "Her leadership emphasizes strong systems, operational clarity, and long-term brand credibility. By embedding international best practices, Benita ensures Career HQ operates with consistency, accountability, and scalability.",
        "Under her strategic direction, Career HQ is not just a service provider — it is a corporation built to address every dimension of a career journey. Working alongside Gandhi's academic leadership, she plays a key role in shaping Career HQ as a future-focused organization driven by trust, structure, and measurable outcomes.",
      ],
      quote:
        "Sustainable impact is built on structure, ethics, and disciplined leadership — the same principles that define successful global organizations.",
    },
  ];

  return (
    <section className="py-20 bg-white" id="mentors-section">
      <TargetCursor targetSelector="#mentors-section .cursor-target" />
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-primary-600">
            Meet Our Founders
          </h2>
          <p className="text-foreground-600 text-lg max-w-2xl mx-auto">
            Visionary leaders transforming education and careers globally
          </p>
        </motion.div>

        {/* Founders */}
        <div className="space-y-20">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Image Section */}
                <div
                  className={`relative ${
                    index % 2 === 1 ? "lg:col-start-2" : ""
                  }`}
                >
                  <ProfileCard
                    name={founder.name}
                    avatarUrl={founder.image}
                    className="cursor-target"
                  />
                </div>

                {/* Content Section */}
                <div
                  className={`space-y-6 ${
                    index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                  }`}
                >
                  <h4 className="text-xl font-bold text-gray-900">
                    <span className="cursor-target inline-block">
                      {founder.title}
                    </span>
                  </h4>

                  <div className="space-y-4">
                    {founder.paragraphs.map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-foreground-700 leading-relaxed cursor-target"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="relative pl-6 py-4 mt-6 border-l-4 border-primary-500">
                    <p className="text-lg italic text-gray-800 leading-relaxed mb-2">
                      &ldquo;{founder.quote}&rdquo;
                    </p>
                    <p className="text-sm font-bold text-primary-600">
                      — {founder.name}
                    </p>
                  </div>
                </div>
              </div>

              {index < founders.length - 1 && (
                <div className="mt-20 h-px bg-gray-200"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
