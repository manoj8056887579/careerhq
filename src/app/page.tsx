import * as React from "react";
import { getAllBlogPosts } from "@/lib/data";
import { HomePageClient } from "./home-page-client";
import type { Company } from "@/models/Company";

// Force this page to be dynamic due to blog posts
export const dynamic = "force-dynamic";

async function getPlacementCompanies() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/companies?moduleType=placement-india`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const companies: Company[] = await response.json();
      return companies;
    }
    return [];
  } catch (error) {
    console.error("Error fetching placement companies:", error);
    return [];
  }
}

export default async function HomePage() {
  // Fetch real blog posts and placement companies from the API
  const [blogPosts, placementCompanies] = await Promise.all([
    getAllBlogPosts({ limit: 3 }),
    getPlacementCompanies(),
  ]);

  return (
    <HomePageClient
      blogPosts={blogPosts}
      placementCompanies={placementCompanies}
    />
  );
}
