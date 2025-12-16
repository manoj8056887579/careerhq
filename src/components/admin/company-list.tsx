"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import type { Company } from "@/models/Company";

interface CompanyListProps {
  companies: Company[];
  isLoading: boolean;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

export default function CompanyList({
  companies,
  isLoading,
  onEdit,
  onDelete,
}: CompanyListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading companies...</p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No companies found. Add your first company!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company) => (
        <Card key={company.id} className="hover:shadow-lg transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 border rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${company.logo}`}
                  alt={company.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<Edit size={14} />}
                    onPress={() => onEdit(company)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    startContent={<Trash2 size={14} />}
                    onPress={() => onDelete(company.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
