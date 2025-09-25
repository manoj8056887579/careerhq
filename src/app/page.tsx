import * as React from "react";
import { getAllBlogPosts } from "@/lib/data";
import { HomePageClient } from "./home-page-client";

// Force this page to be dynamic due to blog posts
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real blog posts from the API
  const blogPosts = await getAllBlogPosts({ limit: 3 });

  return <HomePageClient blogPosts={blogPosts} />;
}
