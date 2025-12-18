"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { Divider } from "@heroui/divider";
import { ILead } from "@/models/lead";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<ILead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await fetch(`/api/leads/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch lead");
        }
        const data = await response.json();
        setLead(data.lead);
      } catch (error) {
        console.error("Error fetching lead:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLead();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Icon icon="lucide:loader-2" className="animate-spin text-4xl" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">Lead not found</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="light"
          startContent={<Icon icon="lucide:arrow-left" />}
          onPress={() => router.back()}
        >
          Back to Leads
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Lead Details</h2>
            <Chip
              color={
                lead.status === "new"
                  ? "primary"
                  : lead.status === "contacted"
                  ? "warning"
                  : lead.status === "converted"
                  ? "success"
                  : "default"
              }
              size="lg"
            >
              {lead.status.toUpperCase()}
            </Chip>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="text-lg font-medium">{lead.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-lg font-medium">{lead.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="text-lg font-medium">{lead.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Program</label>
                <p className="text-lg font-medium">{lead.program || "N/A"}</p>
              </div>
              {lead.country && (
                <div>
                  <label className="text-sm text-gray-500">Country</label>
                  <p className="text-lg font-medium">{lead.country}</p>
                </div>
              )}
              {lead.university && (
                <div>
                  <label className="text-sm text-gray-500">University</label>
                  <p className="text-lg font-medium">{lead.university}</p>
                </div>
              )}
              {lead.qualification && (
                <div>
                  <label className="text-sm text-gray-500">Qualification</label>
                  <p className="text-lg font-medium">{lead.qualification}</p>
                </div>
              )}
              {lead.ieltsScore && (
                <div>
                  <label className="text-sm text-gray-500">IELTS Score</label>
                  <p className="text-lg font-medium">{lead.ieltsScore}</p>
                </div>
              )}
              {lead.preference && (
                <div>
                  <label className="text-sm text-gray-500">
                    Preference (Country/University/Job Role)
                  </label>
                  <p className="text-lg font-medium">{lead.preference}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500">Consent Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {lead.consent ? (
                    <>
                      <Icon
                        icon="lucide:check-circle"
                        className="text-success text-xl"
                      />
                      <span className="text-lg font-medium text-success">
                        Consented
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon
                        icon="lucide:x-circle"
                        className="text-danger text-xl"
                      />
                      <span className="text-lg font-medium text-danger">
                        Not Consented
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Created At</label>
                <p className="text-lg font-medium">
                  {new Date(lead.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Updated At</label>
                <p className="text-lg font-medium">
                  {new Date(lead.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {lead.message && (
              <>
                <Divider className="my-6" />
                <div>
                  <label className="text-sm text-gray-500 block mb-2">
                    Message
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-base whitespace-pre-wrap">
                      {lead.message}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        {/* Career Test Answers */}
        {lead.careerTestAnswers && lead.careerTestAnswers.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Register Answers</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {lead.careerTestAnswers.map((item, index) => (
                  <div key={index} className="pb-4 border-b last:border-b-0">
                    <p className="font-medium text-gray-700 mb-2">
                      {index + 1}. {item.question}
                    </p>
                    <p className="text-lg text-primary pl-4">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
