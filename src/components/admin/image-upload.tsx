"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange?: (imageId: string) => void;
  onFileChange?: (file: File | null) => void;
  error?: string;
  label?: string;
  description?: string;
  folder?: string;
  multiple?: boolean;
  onMultipleChange?: (imageIds: string[]) => void;
}

export default function ImageUpload({
  value = "",
  onChange,
  onFileChange,
  error,
  label,
  description,
  folder = "uploads",
  multiple = false,
  onMultipleChange,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Handle multiple files
    if (multiple && files.length > 1) {
      await handleMultipleFiles(files);
      return;
    }

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    setUploadError("");

    // If onFileChange is provided, use file-based approach (country-management pattern)
    if (onFileChange) {
      onFileChange(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      if (onChange) {
        onChange(previewUrl);
      }
      return;
    }

    // Otherwise, upload immediately
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (onChange) {
        onChange(data.publicId);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleMultipleFiles = async (files: FileList) => {
    setIsUploading(true);
    setUploadError("");

    const uploadedIds: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedIds.push(data.publicId);
        }
      }

      if (onMultipleChange && uploadedIds.length > 0) {
        onMultipleChange(uploadedIds);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload some images. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    if (onChange) {
      onChange("");
    }
    if (onFileChange) {
      onFileChange(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getImageUrl = (imageId: string) => {
    // If it's a blob URL (preview), return as-is
    if (imageId.startsWith("blob:")) {
      return imageId;
    }
    // Otherwise, construct Cloudinary URL
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${imageId}`;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-default-700">{label}</label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <Card>
          <CardBody className="p-0 relative">
            <div className="relative w-full h-48">
              <Image
                src={getImageUrl(value)}
                alt={label || "Uploaded"}
                fill
                className="object-cover rounded-lg"
                unoptimized={value.startsWith("blob:")}
              />
            </div>
            <Button
              isIconOnly
              size="sm"
              color="danger"
              className="absolute top-2 right-2"
              onPress={handleRemove}
            >
              <X size={16} />
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Card
          isPressable
          onPress={handleClick}
          className={`border-2 border-dashed ${
            error ? "border-danger" : "border-default-300"
          }`}
        >
          <CardBody className="flex flex-col items-center justify-center py-8">
            {isUploading ? (
              <>
                <Loader2 size={32} className="animate-spin text-primary mb-2" />
                <p className="text-sm text-default-500">
                  {multiple ? "Uploading images..." : "Uploading..."}
                </p>
              </>
            ) : (
              <>
                {multiple ? (
                  <ImageIcon size={32} className="text-default-400 mb-2" />
                ) : (
                  <Upload size={32} className="text-default-400 mb-2" />
                )}
                <p className="text-sm text-default-600 font-medium">
                  Click to upload {multiple ? "images" : "image"}
                </p>
                <p className="text-xs text-default-400 mt-1">
                  PNG, JPG up to 5MB {multiple ? "(multiple files)" : ""}
                </p>
              </>
            )}
          </CardBody>
        </Card>
      )}

      {description && <p className="text-xs text-default-500">{description}</p>}

      {(error || uploadError) && (
        <p className="text-xs text-danger">{error || uploadError}</p>
      )}
    </div>
  );
}
