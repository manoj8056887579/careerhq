import * as React from "react";
import { getAllBlogPosts } from "@/lib/data";
import { HomePageClient } from "./home-page-client";
import type { Company } from "@/models/Company";
import { getApiUrl } from "@/lib/api-url";

// Force this page to be dynamic due to blog posts
export const dynamic = "force-dynamic";

async function getPlacementCompanies() {
  try {
    const apiUrl = getApiUrl("/api/companies?moduleType=placement-india");

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const companies: Company[] = await response.json();
      return companies;
    }

    console.error(
      "Failed to fetch placement companies:",
      response.status,
      response.statusText
    );
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
