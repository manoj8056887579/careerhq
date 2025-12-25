"use client";

import React from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Chip } from "@heroui/chip";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  date: string;
}

export default function MediaPage() {
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos?limit=100");
      const data = await response.json();

      if (response.ok) {
        // Transform API data to match component interface
        const transformedVideos = data.videos.map((video: any) => ({
          id: video._id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          videoUrl: `https://www.youtube.com/embed/${video.videoId}`,
          date: video.createdAt,
        }));
        setVideos(transformedVideos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos;
  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
            alt="Students learning"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/60 to-secondary-600/60" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <Icon
              icon="lucide:play-circle"
              className="text-6xl mx-auto mb-4"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Media Gallery
            </h1>
            <p className="text-xl text-white/90">
              Watch our latest videos on study abroad, career guidance, and success stories
            </p>
          </motion.div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-16">
                <Icon
                  icon="lucide:loader-2"
                  className="text-6xl text-primary mx-auto mb-4 animate-spin"
                />
                <p className="text-default-600">Loading videos...</p>
              </div>
            ) : filteredVideos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Icon
                  icon="lucide:video-off"
                  className="text-6xl text-default-300 mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold text-default-600 mb-2">
                  No videos found
                </h3>
                <p className="text-default-500">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="border border-default-200 hover:shadow-xl transition-all duration-300">
                      <CardBody className="p-0">
                        {/* Thumbnail */}
                        <div 
                          className="relative aspect-video bg-default-100 overflow-hidden cursor-pointer"
                          onClick={() => handleVideoClick(video)}
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <Icon
                              icon="lucide:play-circle"
                              className="text-6xl text-white"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-2 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-sm text-foreground-600 line-clamp-2 mb-3">
                            {video.description}
                          </p>
                          <div className="flex items-center justify-end text-xs text-foreground-500">
                            <div className="flex items-center gap-1">
                              <Icon icon="lucide:calendar" />
                              <span>{new Date(video.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                      <CardFooter className="pt-0 px-4 pb-4">
                        <Button
                          color="primary"
                          variant="flat"
                          className="w-full"
                          startContent={<Icon icon="lucide:play" />}
                          onPress={() => handleVideoClick(video)}
                        >
                          Watch Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold">{selectedVideo?.title}</h3>
            <div className="flex items-center gap-3 text-sm text-foreground-600">
              <div className="flex items-center gap-1">
                <Icon icon="lucide:calendar" />
                <span>
                  {selectedVideo?.date &&
                    new Date(selectedVideo.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="pb-6">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <iframe
                src={selectedVideo?.videoUrl}
                title={selectedVideo?.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold mb-2">About this video</h4>
              <p className="text-foreground-600">{selectedVideo?.description}</p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
