"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { X, Plus, Trash2 } from "lucide-react";
import { addToast } from "@heroui/toast";
import type { Job, CreateJobData } from "@/types/career";

interface AdminJobFormProps {
  job?: Job | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminJobForm({ job, onClose, onSuccess }: AdminJobFormProps) {
  const [formData, setFormData] = useState<CreateJobData>({
    title: job?.title || "",
    slug: job?.slug || "",
    department: job?.department || "",
    location: job?.location || "",
    type: job?.type || "Full-time",
    experience: job?.experience || "",
    description: job?.description || "",
    responsibilities: job?.responsibilities || [""],
    requirements: job?.requirements || [""],
    benefits: job?.benefits || [""],
    salary: job?.salary || "",
    published: job?.published || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty arrays
      const cleanedData = {
        ...formData,
        responsibilities: formData.responsibilities.filter((r) => r.trim()),
        requirements: formData.requirements.filter((r) => r.trim()),
        benefits: formData.benefits.filter((b) => b.trim()),
      };

      const url = job
        ? `/api/careers/jobs/${job.id}`
        : "/api/careers/jobs";
      const method = job ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        addToast({
          title: "Success",
          description: `Job ${job ? "updated" : "created"} successfully`,
          type: "success",
        });
        onSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to save job");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save job",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (field: "responsibilities" | "requirements" | "benefits") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const updateArrayItem = (
    field: "responsibilities" | "requirements" | "benefits",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const removeArrayItem = (
    field: "responsibilities" | "requirements" | "benefits",
    index: number
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {job ? "Edit Job" : "Create New Job"}
        </h2>
        <Button isIconOnly variant="light" onPress={onClose}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            placeholder="e.g., Senior Software Engineer"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <Input
            label="Department"
            placeholder="e.g., Engineering"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            required
          />

          <Input
            label="Location"
            placeholder="e.g., Remote, New York, Hybrid"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />

          <Select
            label="Job Type"
            selectedKeys={[formData.type]}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as CreateJobData["type"],
              })
            }
            required
          >
            <SelectItem key="Full-time" value="Full-time">
              Full-time
            </SelectItem>
            <SelectItem key="Part-time" value="Part-time">
              Part-time
            </SelectItem>
            <SelectItem key="Contract" value="Contract">
              Contract
            </SelectItem>
            <SelectItem key="Internship" value="Internship">
              Internship
            </SelectItem>
          </Select>

          <Input
            label="Experience Required"
            placeholder="e.g., 3-5 years"
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
            required
          />

          <Input
            label="Salary Range (Optional)"
            placeholder="e.g., $80,000 - $120,000"
            value={formData.salary}
            onChange={(e) =>
              setFormData({ ...formData, salary: e.target.value })
            }
          />
        </div>

        <Textarea
          label="Job Description"
          placeholder="Describe the role and what the candidate will be doing..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          minRows={4}
          required
        />

        {/* Responsibilities */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Responsibilities</label>
            <Button
              size="sm"
              variant="flat"
              startContent={<Plus size={16} />}
              onPress={() => addArrayItem("responsibilities")}
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {formData.responsibilities.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter responsibility"
                  value={item}
                  onChange={(e) =>
                    updateArrayItem("responsibilities", index, e.target.value)
                  }
                  className="flex-1"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => removeArrayItem("responsibilities", index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Requirements</label>
            <Button
              size="sm"
              variant="flat"
              startContent={<Plus size={16} />}
              onPress={() => addArrayItem("requirements")}
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {formData.requirements.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter requirement"
                  value={item}
                  onChange={(e) =>
                    updateArrayItem("requirements", index, e.target.value)
                  }
                  className="flex-1"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => removeArrayItem("requirements", index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Benefits (Optional)</label>
            <Button
              size="sm"
              variant="flat"
              startContent={<Plus size={16} />}
              onPress={() => addArrayItem("benefits")}
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {formData.benefits.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter benefit"
                  value={item}
                  onChange={(e) =>
                    updateArrayItem("benefits", index, e.target.value)
                  }
                  className="flex-1"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => removeArrayItem("benefits", index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Switch
          isSelected={formData.published}
          onValueChange={(checked) =>
            setFormData({ ...formData, published: checked })
          }
        >
          Publish job immediately
        </Switch>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit" isLoading={loading}>
            {job ? "Update Job" : "Create Job"}
          </Button>
        </div>
      </form>
    </div>
  );
}
