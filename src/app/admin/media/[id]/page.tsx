"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface Video {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  videoId: string;
  thumbnail: string;
  isPublished: boolean;
}

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    youtubeUrl: "",
    isPublished: true,
  });
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewThumbnail, setPreviewThumbnail] = React.useState("");

  React.useEffect(() => {
    if (id) {
      fetchVideo();
    }
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await fetch(`/api/videos/${id}`);
      const data = await response.json();

      if (response.ok) {
        const video = data.video;
        setFormData({
          title: video.title,
          description: video.description,
          youtubeUrl: video.youtubeUrl,
          isPublished: video.isPublished,
        });
        setPreviewThumbnail(video.thumbnail);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYouTubeUrlChange = (url: string) => {
    setFormData({ ...formData, youtubeUrl: url });

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
      const response = await fetch(`/api/videos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/media");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update video");
      }
    } catch (error) {
      console.error("Error updating video:", error);
      alert("Failed to update video");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icon
          icon="lucide:loader-2"
          className="text-4xl text-primary animate-spin"
        />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">Edit Video</h1>
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
                Published
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
                  Update Video
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
