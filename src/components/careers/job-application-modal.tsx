"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Upload, FileText, X } from "lucide-react";
import { addToast } from "@heroui/toast";
import type { Job } from "@/types/career";

interface JobApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export function JobApplicationModal({
  job,
  isOpen,
  onClose,
}: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        addToast({
          title: "Invalid File",
          description: "Please upload a PDF or Word document",
          color: "danger",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        addToast({
          title: "File Too Large",
          description: "Resume must be less than 5MB",
          color: "danger",
        });
        return;
      }

      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      addToast({
        title: "Resume Required",
        description: "Please upload your resume",
        color: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("jobId", job.id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("coverLetter", formData.coverLetter);
      formDataToSend.append("resume", resumeFile);

      const response = await fetch("/api/careers/applications", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        addToast({
          title: "Application Submitted!",
          description: "We'll review your application and get back to you soon.",
          color: "success",
        });
        onClose();
        // Reset form
        setFormData({ name: "", email: "", phone: "", coverLetter: "" });
        setResumeFile(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      addToast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Please try again later",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {job.department} • {job.location}
            </p>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                isRequired
              />

              <Input
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                isRequired
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                isRequired
              />

              <Textarea
                label="Cover Letter (Optional)"
                placeholder="Tell us why you're a great fit for this role..."
                value={formData.coverLetter}
                onChange={(e) =>
                  setFormData({ ...formData, coverLetter: e.target.value })
                }
                minRows={4}
              />

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resume <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  {!resumeFile ? (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <label
                        htmlFor="resume-upload"
                        className="cursor-pointer"
                      >
                        <span className="text-primary-600 hover:text-primary-700 font-medium">
                          Click to upload
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {" "}
                          or drag and drop
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF or Word document (Max 5MB)
                      </p>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary-600" />
                        <div className="text-left">
                          <p className="font-medium text-sm">
                            {resumeFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(resumeFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => setResumeFile(null)}
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                By submitting this application, you agree to our privacy policy
                and terms of service.
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={loading}>
              Submit Application
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
