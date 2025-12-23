import React from "react";
import { Metadata } from "next";
import { getAllBlogPosts, getBlogCategories } from "@/lib/data";
import { BlogListingClient } from "./blog-listing-client";

// Force this page to be dynamic due to blog posts
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog - Study Abroad Insights & Guides | Career HQ",
  description:
    "Insights, guides, and resources for your international education journey. Expert advice on studying abroad, scholarships, visas, and more.",
  openGraph: {
    title: "Blog - Study Abroad Insights & Guides",
    description:
      "Expert insights and guides for international students planning to study abroad.",
    images: ["/images/blog-hero.jpg"],
  },
};

export default async function BlogPage() {
  const [blogPosts, categories] = await Promise.all([
    getAllBlogPosts(),
    getBlogCategories(),
  ]);

  return <BlogListingClient initialPosts={blogPosts} categories={categories} />;
}
