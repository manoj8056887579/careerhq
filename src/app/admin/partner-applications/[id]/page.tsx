"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Divider } from "@heroui/divider";

interface PartnerApplication {
  _id: string;
  businessName: string;
  businessType: string;
  yearEstablished: string;
  website?: string;
  country: string;
  contactName: string;
  designation: string;
  email: string;
  phone: string;
  services: string[];
  markets: string;
  referralsPerMonth: string;
  familiarWithCommission: string;
  agreeGenuineInfo: string;
  agreeNDA: string;
  partnershipReason: string;
  status: "pending" | "approved" | "rejected" | "under-review";
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PartnerApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [application, setApplication] =
    React.useState<PartnerApplication | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/partner-applications/${id}`);
      const data = await response.json();

      if (response.ok) {
        setApplication(data.application);
        setStatus(data.application.status);
        setNotes(data.application.notes || "");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/partner-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        await fetchApplication();
        alert("Application updated successfully");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const response = await fetch(`/api/partner-applications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin/partner-applications");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    }
  };

  const getStatusColor = (
    status: string
  ): "default" | "primary" | "success" | "warning" | "danger" => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      case "under-review":
        return "primary";
      default:
        return "default";
    }
  };

  const getBusinessTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      education: "Education Consultancy",
      recruitment: "Recruitment / Staffing",
      training: "Training Institute",
      advisory: "Career Advisory",
      freelancer: "Freelancer",
      other: "Other",
    };
    return labels[type] || type;
  };

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      "study-abroad": "Study Abroad",
      "study-india": "Study India",
      "job-placement": "Job / Professional Placement",
      "career-services": "Career Services",
      "corporate-hiring": "Corporate Hiring",
    };
    return labels[service] || service;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon
            icon="lucide:loader-2"
            className="text-4xl text-primary animate-spin mx-auto mb-2"
          />
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon
            icon="lucide:alert-circle"
            className="text-4xl text-danger mx-auto mb-2"
          />
          <p>Application not found</p>
          <Button
            color="primary"
            className="mt-4"
            onPress={() => router.push("/admin/partner-applications")}
          >
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Button
              variant="light"
              startContent={<Icon icon="lucide:arrow-left" />}
              onPress={() => router.push("/admin/partner-applications")}
              className="mb-2"
            >
              Back to Applications
            </Button>
            <h1 className="text-3xl font-bold">{application.businessName}</h1>
            <p className="text-foreground-600 mt-1">
              Application ID: {application._id}
            </p>
          </div>
          <Chip
            size="lg"
            color={getStatusColor(application.status)}
            variant="flat"
          >
            {application.status}
          </Chip>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Business Information</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground-500">Business Name</p>
                    <p className="font-semibold">{application.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-500">Business Type</p>
                    <Chip size="sm" variant="flat">
                      {getBusinessTypeLabel(application.businessType)}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-500">
                      Year Established
                    </p>
                    <p className="font-semibold">
                      {application.yearEstablished}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-500">Country</p>
                    <p className="font-semibold">{application.country}</p>
                  </div>
                  {application.website && (
                    <div className="col-span-2">
                      <p className="text-sm text-foreground-500">Website</p>
                      <a
                        href={application.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {application.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Contact Information</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground-500">Contact Name</p>
                    <p className="font-semibold">{application.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-500">Designation</p>
                    <p className="font-semibold">{application.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-500">Email</p>
                    <a
                      href={`mailto:${application.email}`}
                      className="text-primary hover:underline"
                    >
                      {application.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-500">Phone</p>
                    <a
                      href={`tel:${application.phone}`}
                      className="text-primary hover:underline"
                    >
                      {application.phone}
                    </a>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Partnership Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Partnership Details</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-sm text-foreground-500 mb-2">
                    Services to Refer
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {application.services.map((service, idx) => (
                      <Chip key={idx} color="primary" variant="flat">
                        {getServiceLabel(service)}
                      </Chip>
                    ))}
                  </div>
                </div>

                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground-500">
                      Markets Served
                    </p>
                    <p className="font-semibold">{application.markets}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-500">
                      Estimated Referrals/Month
                    </p>
                    <p className="font-semibold">
                      {application.referralsPerMonth}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-500">
                      Familiar with Commission Models
                    </p>
                    <Chip
                      size="sm"
                      color={
                        application.familiarWithCommission === "yes"
                          ? "success"
                          : "default"
                      }
                      variant="flat"
                    >
                      {application.familiarWithCommission}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-500">
                      Agrees to Genuine Info
                    </p>
                    <Chip
                      size="sm"
                      color={
                        application.agreeGenuineInfo === "yes"
                          ? "success"
                          : "danger"
                      }
                      variant="flat"
                    >
                      {application.agreeGenuineInfo}
                    </Chip>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-foreground-500">
                      Willing to Sign NDA
                    </p>
                    <Chip
                      size="sm"
                      color={
                        application.agreeNDA === "yes" ? "success" : "danger"
                      }
                      variant="flat"
                    >
                      {application.agreeNDA}
                    </Chip>
                  </div>
                </div>

                <Divider />

                <div>
                  <p className="text-sm text-foreground-500 mb-2">
                    Why Partner with Career HQ?
                  </p>
                  <p className="text-foreground-700 whitespace-pre-wrap">
                    {application.partnershipReason}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Update Status</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Select
                  label="Status"
                  selectedKeys={[status]}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <SelectItem key="pending">
                    Pending
                  </SelectItem>
                  <SelectItem key="under-review">
                    Under Review
                  </SelectItem>
                  <SelectItem key="approved">
                    Approved
                  </SelectItem>
                  <SelectItem key="rejected">
                    Rejected
                  </SelectItem>
                </Select>

                <Textarea
                  label="Internal Notes"
                  placeholder="Add notes about this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  minRows={4}
                />

                <Button
                  color="primary"
                  className="w-full"
                  onPress={handleUpdate}
                  isLoading={updating}
                  startContent={
                    !updating && <Icon icon="lucide:save" />
                  }
                >
                  Update Application
                </Button>
              </CardBody>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Metadata</h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <div>
                  <p className="text-sm text-foreground-500">Submitted</p>
                  <p className="font-semibold">
                    {new Date(application.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground-500">Last Updated</p>
                  <p className="font-semibold">
                    {new Date(application.updatedAt).toLocaleString()}
                  </p>
                </div>
                {application.reviewedAt && (
                  <div>
                    <p className="text-sm text-foreground-500">Reviewed At</p>
                    <p className="font-semibold">
                      {new Date(application.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Actions</h2>
              </CardHeader>
              <CardBody className="space-y-2">
                <Button
                  color="danger"
                  variant="flat"
                  className="w-full"
                  startContent={<Icon icon="lucide:trash-2" />}
                  onPress={handleDelete}
                >
                  Delete Application
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
