"use client";

import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function PartnerAgreementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="lucide:file-text" className="text-primary text-4xl" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Career HQ – Referral Partner Agreement
            </h1>
            <p className="text-foreground-600 text-lg">
              Including Confidentiality & Non-Disclosure
            </p>
          </motion.div>

          {/* Agreement Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardBody className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  {/* Introduction */}
                  <div className="mb-8 p-6 bg-primary-50 border-l-4 border-primary rounded-r-lg">
                    <p className="text-foreground-700 mb-0">
                      This Referral Partner Agreement ("Agreement") is entered into between{" "}
                      <strong>Career HQ</strong> ("Company") and{" "}
                      <strong>[Partner Name]</strong> ("Referral Partner").
                    </p>
                  </div>

                  {/* Section 1 */}
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-foreground-800 flex items-center gap-2">
                      <span className="text-primary">1.</span> Purpose of Agreement
                    </h2>
                    <p className="text-foreground-600 leading-relaxed">
                      The Referral Partner agrees to refer potential clients to Career HQ for
                      career, education, recruitment, or related services in accordance with this
                      Agreement.
                    </p>
                  </section>

                  {/* Section 2 */}
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-foreground-800 flex items-center gap-2">
                      <span className="text-primary">2.</span> Nature of Relationship
                    </h2>
                    <p className="text-fo