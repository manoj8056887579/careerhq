"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function NewVideoPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    youtubeUrl: "",
    isPublished: true,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewThumbnail, setPreviewThumbnail] = React.useState("");

  // Extract video ID and show preview
  const handleYouTubeUrlChange = (url: string) => {
    setFormData({ ...formData, youtubeUrl: url });

    // Extract video ID for preview
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const videoId = match[1];
        setPreviewThumbnail(
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        );
        return;
      }
    }
    setPreviewThumbnail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting form data:", formData);

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        router.push("/admin/media");
      } else {
        console.error("Error response:", data);
        alert(data.error || "Failed to create video");
        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (error) {
      console.error("Error creating video:", error);
      alert("Failed to create video: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="light"
          startContent={<Icon icon="lucide:arrow-left" />}
          onPress={() => router.push("/admin/media")}
          className="mb-4"
        >
          Back to Media
        </Button>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Add New Video</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Video Title"
                placeholder="Enter video title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                isRequired
                variant="bordered"
              />

              <Textarea
                label="Description"
                placeholder="Enter video description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                isRequired
                minRows={4}
                variant="bordered"
              />

              <Input
                label="YouTube URL"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.youtubeUrl}
                onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                isRequired
                variant="bordered"
                description="Paste the full YouTube video URL"
              />

              {previewThumbnail && (
                <div>
                  <p className="text-sm font-medium mb-2">Preview</p>
                  <img
                    src={previewThumbnail}
                    alt="Video thumbnail"
                    className="w-full max-w-md rounded-lg border border-default-200"
                  />
                </div>
              )}

              <Switch
                isSelected={formData.isPublished}
                onValueChange={(value) =>
                  setFormData({ ...formData, isPublished: value })
                }
              >
                Publish immediately
              </Switch>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="flat"
                  onPress={() => router.push("/admin/media")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isSubmitting}
                  startContent={!isSubmitting && <Icon icon="lucide:save" />}
                >
                  Create Video
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
