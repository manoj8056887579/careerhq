import mongoose from "mongoose";
import UniversalModule from "../src/models/UniversalModule";
import ModuleCategory from "../src/models/ModuleCategory";
import fs from "fs";
import path from "path";

interface UniversityData {
  Title: string;
  "Quick Details": string;
  "Short Description": string;
  "Detailed Description": string;
  Category: string;
}

async function importData() {
  try {
    // Read and parse the JSON data
    const rawData = fs.readFileSync(
      path.join(process.cwd(), "data", "placement-india.json"),
      "utf-8"
    );
    const universities: UniversityData[] = JSON.parse(rawData);

    // Transform the data to match our schema
    const transformedData = universities
      .filter((uni) => uni.Title && uni.Title.trim()) // Filter out empty titles
      .map((uni) => ({
        moduleType: "placement-india",
        title: uni.Title,
        shortDescription: uni["Short Description"],
        detailedDescription: uni["Detailed Description"],
        category: uni.Category,
        customFields: [
          {
            key: "location",
            value: uni["Quick Details"] || "Unknown",
          },
        ],
        coverImage: "/images/placeholder-university.jpg",
        published: true,
        slug: uni.Title.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));

    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://benitasamson_db_user:KmaOPnOxaMtN5hao@cluster0.bzqr2kt.mongodb.net/career-hq"
    );
    console.log("Connected to MongoDB");

    // Clear existing placement-india entries
    await UniversalModule.deleteMany({ moduleType: "placement-india" });
    await ModuleCategory.deleteMany({ moduleType: "placement-india" });
    console.log("Cleared existing placement-india entries");

    // Extract unique categories
    const uniqueCategories = [
      ...new Set(universities.map((uni) => uni.Category).filter(Boolean)),
    ];

    // Save categories to ModuleCategory
    for (const categoryName of uniqueCategories) {
      await ModuleCategory.create({
        name: categoryName,
        moduleType: "placement-india",
      });
    }
    console.log(`Created ${uniqueCategories.length} categories`);

    // Insert new data
    await UniversalModule.insertMany(transformedData);
    console.log("Successfully imported study india data");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

importData();
