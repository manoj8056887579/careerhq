"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Search, Download, Trash2, ExternalLink } from "lucide-react";
import { addToast } from "@heroui/toast";
import type { Job, JobApplication } from "@/types/career";

interface AdminJobApplicationsProps {
  applications: JobApplication[];
  jobs: Job[];
  onUpdate: () => void;
}

export function AdminJobApplications({
  applications,
  jobs,
  onUpdate,
}: AdminJobApplicationsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");

  const statusOptions = ["all", "pending", "reviewing", "shortlisted", "rejected", "hired"];
  const jobOptions = ["all", ...jobs.map(j => j.id)];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "reviewing":
        return "primary";
      case "shortlisted":
        return "success";
      case "rejected":
        return "danger";
      case "hired":
        return "success";
      default:
        return "default";
    }
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/careers/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        addToast({
          title: "Success",
          description: "Application status updated",
          color: "success",
        });
        onUpdate();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      addToast({
        title: "Error",
        description: "Failed to update application status",
        color: "danger",
      });
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const response = await fetch(`/api/careers/applications/${applicationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        addToast({
          title: "Success",
          description: "Application deleted successfully",
          color: "success",
        });
        onUpdate();
      } else {
        throw new Error("Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      addToast({
        title: "Error",
        description: "Failed to delete application",
        color: "danger",
      });
    }
  };

  const handleDownloadResume = async (applicationId: string, applicantName: string) => {
    try {
      const response = await fetch(`/api/careers/applications/${applicationId}/download`);
      
      if (!response.ok) {
        throw new Error("Failed to download resume");
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${applicantName.replace(/[^a-zA-Z0-9]/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addToast({
        title: "Success",
        description: "Resume downloaded successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Error downloading resume:", error);
      addToast({
        title: "Error",
        description: "Failed to download resume",
        color: "danger",
      });
    }
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesJob = jobFilter === "all" || app.jobId === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search size={18} />}
          className="flex-1"
        />
        <Select
          label="Status"
          selectedKeys={[statusFilter]}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48"
        >
          {statusOptions.map((status) => (
            <SelectItem key={status}>
              {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Job"
          selectedKeys={[jobFilter]}
          onChange={(e) => setJobFilter(e.target.value)}
          className="w-full md:w-64"
        >
          {[{ id: "all", title: "All Jobs" }, ...jobs].map((job) => (
            <SelectItem key={job.id}>
              {job.title}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{app.name}</h3>
                  <Chip color={getStatusColor(app.status)} size="sm">
                    {app.status}
                  </Chip>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Job:</strong> {app.jobTitle}
                  </p>
                  <p>
                    <strong>Email:</strong> {app.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {app.phone}
                  </p>
                  {app.coverLetter && (
                    <p>
                      <strong>Cover Letter:</strong> {app.coverLetter}
                    </p>
                  )}
                  <p className="text-xs">
                    <strong>Applied:</strong>{" "}
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Select
                  label="Change Status"
                  selectedKeys={[app.status]}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  size="sm"
                  className="w-full md:w-48"
                >
                  {["pending", "reviewing", "shortlisted", "rejected", "hired"].map((status) => (
                    <SelectItem key={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </Select>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<Download size={16} />}
                    onPress={() => handleDownloadResume(app.id, app.name)}
                  >
                    Resume
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    onPress={() => handleDelete(app.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredApplications.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No applications found
          </div>
        )}
      </div>
    </div>
  );
}
