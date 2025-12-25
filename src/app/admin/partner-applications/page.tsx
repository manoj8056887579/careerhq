"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { Pagination } from "@heroui/pagination";
import { motion } from "framer-motion";

interface PartnerApplication {
  _id: string;
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  services: string[];
  status: "pending" | "approved" | "rejected" | "under-review";
  createdAt: string;
}

export default function PartnerApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = React.useState<PartnerApplication[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [businessTypeFilter, setBusinessTypeFilter] = React.useState("all");

  const fetchApplications = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(businessTypeFilter !== "all" && {
          businessType: businessTypeFilter,
        }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/partner-applications?${params}`);
      const data = await response.json();

      if (response.ok) {
        setApplications(data.applications);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, businessTypeFilter, search]);

  React.useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

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

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Partner Applications</h1>
            <p className="text-foreground-600 mt-1">
              Manage B2B referral partner applications
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search by name, email, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<Icon icon="lucide:search" />}
            isClearable
            onClear={() => setSearch("")}
          />

          <Select
            label="Status"
            selectedKeys={[statusFilter]}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <SelectItem key="all" value="all">
              All Status
            </SelectItem>
            <SelectItem key="pending" value="pending">
              Pending
            </SelectItem>
            <SelectItem key="under-review" value="under-review">
              Under Review
            </SelectItem>
            <SelectItem key="approved" value="approved">
              Approved
            </SelectItem>
            <SelectItem key="rejected" value="rejected">
              Rejected
            </SelectItem>
          </Select>

          <Select
            label="Business Type"
            selectedKeys={[businessTypeFilter]}
            onChange={(e) => setBusinessTypeFilter(e.target.value)}
          >
            <SelectItem key="all" value="all">
              All Types
            </SelectItem>
            <SelectItem key="education" value="education">
              Education Consultancy
            </SelectItem>
            <SelectItem key="recruitment" value="recruitment">
              Recruitment / Staffing
            </SelectItem>
            <SelectItem key="training" value="training">
              Training Institute
            </SelectItem>
            <SelectItem key="advisory" value="advisory">
              Career Advisory
            </SelectItem>
            <SelectItem key="freelancer" value="freelancer">
              Freelancer
            </SelectItem>
            <SelectItem key="other" value="other">
              Other
            </SelectItem>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-default-200">
          <Table
            aria-label="Partner applications table"
            classNames={{
              wrapper: "shadow-none",
            }}
          >
            <TableHeader>
              <TableColumn>BUSINESS</TableColumn>
              <TableColumn>CONTACT</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>SERVICES</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              items={applications}
              isLoading={loading}
              loadingContent={<div>Loading...</div>}
              emptyContent={
                <div className="text-center py-8">
                  <Icon
                    icon="lucide:inbox"
                    className="text-4xl text-default-300 mx-auto mb-2"
                  />
                  <p className="text-default-500">No applications found</p>
                </div>
              }
            >
              {(application) => (
                <TableRow key={application._id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{application.businessName}</p>
                      <p className="text-sm text-foreground-500">
                        {application.country}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{application.contactName}</p>
                      <p className="text-sm text-foreground-500">
                        {application.email}
                      </p>
                      <p className="text-sm text-foreground-500">
                        {application.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">
                      {getBusinessTypeLabel(application.businessType)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {application.services.slice(0, 2).map((service, idx) => (
                        <Chip key={idx} size="sm" variant="flat" color="primary">
                          {service.replace("-", " ")}
                        </Chip>
                      ))}
                      {application.services.length > 2 && (
                        <Chip size="sm" variant="flat">
                          +{application.services.length - 2}
                        </Chip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={getStatusColor(application.status)}
                      variant="flat"
                    >
                      {application.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {new Date(application.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:eye" />}
                      onPress={() =>
                        router.push(
                          `/admin/partner-applications/${application._id}`
                        )
                      }
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-4">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                showControls
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
