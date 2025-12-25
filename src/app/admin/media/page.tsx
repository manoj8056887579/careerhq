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

interface Video {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  videoId: string;
  thumbnail: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [search, setSearch] = React.useState("");

  const fetchVideos = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        includeUnpublished: "true",
        ...(search && { search }),
      });

      const response = await fetch(`/api/videos?${params}`);
      const data = await response.json();

      if (response.ok) {
        setVideos(data.videos);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  React.useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchVideos();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (response.ok) {
        fetchVideos();
      }
    } catch (error) {
      console.error("Error updating video:", error);
      alert("Failed to update video");
    }
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
            <h1 className="text-3xl font-bold">Media Management</h1>
            <p className="text-foreground-600 mt-1">
              Manage media gallery videos
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" />}
            onPress={() => router.push("/admin/media/new")}
          >
            Add Video
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Input
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<Icon icon="lucide:search" />}
            isClearable
            onClear={() => setSearch("")}
            className="max-w-md"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-default-200">
          <Table
            aria-label="Videos table"
            classNames={{
              wrapper: "shadow-none",
            }}
          >
            <TableHeader>
              <TableColumn>VIDEO</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              items={videos}
              isLoading={loading}
              loadingContent={<div>Loading...</div>}
              emptyContent={
                <div className="text-center py-8">
                  <Icon
                    icon="lucide:video-off"
                    className="text-4xl text-default-300 mx-auto mb-2"
                  />
                  <p className="text-default-500">No videos found</p>
                </div>
              }
            >
              {(video) => (
                <TableRow key={video._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 h-14 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold line-clamp-1">
                          {video.title}
                        </p>
                        <p className="text-sm text-foreground-500 line-clamp-1">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={video.isPublished ? "success" : "warning"}
                      variant="flat"
                    >
                      {video.isPublished ? "Published" : "Draft"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {new Date(video.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        isIconOnly
                        onPress={() =>
                          router.push(`/admin/media/${video._id}`)
                        }
                      >
                        <Icon icon="lucide:edit" />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color={video.isPublished ? "warning" : "success"}
                        isIconOnly
                        onPress={() =>
                          handleTogglePublish(video._id, video.isPublished)
                        }
                      >
                        <Icon
                          icon={
                            video.isPublished
                              ? "lucide:eye-off"
                              : "lucide:eye"
                          }
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isIconOnly
                        onPress={() => handleDelete(video._id)}
                      >
                        <Icon icon="lucide:trash-2" />
                      </Button>
                    </div>
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
