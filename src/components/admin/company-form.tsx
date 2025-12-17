"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import type { Company } from "@/models/Company";

interface CompanyFormProps {
  initialData?: Company;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function CompanyForm({
  initialData,
  onSubmit,
  onCancel,
}: CompanyFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logo || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload?folder=companies", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const result = await response.json();
    return result.data.publicId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter company name");
      return;
    }

    if (!logoFile && !initialData?.logo) {
      alert("Please upload a company logo");
      return;
    }

    setIsSubmitting(true);

    try {
      let logoId = initialData?.logo || "";

      // Upload new logo if selected
      if (logoFile) {
        setUploadingLogo(true);
        logoId = await uploadToCloudinary(logoFile);
        setUploadingLogo(false);
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("logo", logoId);
      formData.append("moduleType", "placement-india");

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save company");
    } finally {
      setIsSubmitting(false);
      setUploadingLogo(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Company Name"
        placeholder="Enter company name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        isRequired
        variant="bordered"
      />

      <div>
        <label className="block text-sm font-medium mb-2">
          Company Logo <span className="text-red-500">*</span>
        </label>

        {logoPreview ? (
          <div className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <Image
              src={
                logoPreview.startsWith("data:")
                  ? logoPreview
                  : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${logoPreview}`
              }
              alt="Company logo preview"
              fill
              className="object-contain p-2"
            />
            <button
              type="button"
              onClick={removeLogo}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Upload Logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting || uploadingLogo}
          isDisabled={isSubmitting || uploadingLogo}
        >
          {uploadingLogo ? "Uploading..." : isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
