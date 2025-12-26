"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Plus,
  Search,
  Briefcase,
  Users,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { addToast } from "@heroui/toast";
import type { Job, JobApplication } from "@/types/career";
import { AdminJobForm } from "@/components/admin/careers/admin-job-form";
import { AdminJobApplications } from "@/components/admin/careers/admin-job-applications";

export default function AdminCareersPage() {
  const [selectedTab, setSelectedTab] = useState("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "/api/careers/jobs?includeUnpublished=true&limit=100"
      );
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      addToast({
        title: "Error",
        description: "Failed to fetch jobs",
        type: "error",
      });
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/careers/applications?limit=100");
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      addToast({
        title: "Error",
        description: "Failed to fetch applications",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchApplications()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Delete job
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`/api/careers/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        addToast({
          title: "Success",
          description: "Job deleted successfully",
          type: "success",
        });
        fetchJobs();
      } else {
        throw new Error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      addToast({
        title: "Error",
        description: "Failed to delete job",
        type: "error",
      });
    }
  };

  // Toggle job published status
  const handleTogglePublished = async (job: Job) => {
    try {
      const response = await fetch(`/api/careers/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !job.published }),
      });

      if (response.ok) {
        addToast({
          title: "Success",
          description: `Job ${!job.published ? "published" : "unpublished"} successfully`,
          type: "success",
        });
        fetchJobs();
      } else {
        throw new Error("Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      addToast({
        title: "Error",
        description: "Failed to update job",
        type: "error",
      });
    }
  };

  // Filter jobs based on search
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Careers Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage job postings and applications
        </p>
      </div>

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="mb-6"
      >
        <Tab
          key="jobs"
          title={
            <div className="flex items-center gap-2">
              <Briefcase size={18} />
              <span>Jobs ({jobs.length})</span>
            </div>
          }
        >
          <div className="mt-6">
            {!showJobForm && !editingJob ? (
              <>
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<Search size={18} />}
                    className="flex-1"
                  />
                  <Button
                    color="primary"
                    startContent={<Plus size={18} />}
                    onPress={() => setShowJobForm(true)}
                  >
                    Create Job
                  </Button>
                </div>

                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">
                              {job.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                job.published
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {job.published ? "Published" : "Draft"}
                            </span>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <span>{job.department}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                            <span>•</span>
                            <span>{job.experience}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="flat"
                            isIconOnly
                            onPress={() => handleTogglePublished(job)}
                          >
                            {job.published ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            isIconOnly
                            onPress={() => setEditingJob(job)}
                          >
                            <Edit size={18} />
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            isIconOnly
                            onPress={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredJobs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No jobs found
                    </div>
                  )}
                </div>
              </>
            ) : (
              <AdminJobForm
                job={editingJob}
                onClose={() => {
                  setShowJobForm(false);
                  setEditingJob(null);
                }}
                onSuccess={() => {
                  setShowJobForm(false);
                  setEditingJob(null);
                  fetchJobs();
                }}
              />
            )}
          </div>
        </Tab>

        <Tab
          key="applications"
          title={
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>Applications ({applications.length})</span>
            </div>
          }
        >
          <div className="mt-6">
            <AdminJobApplications
              applications={applications}
              jobs={jobs}
              onUpdate={fetchApplications}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
