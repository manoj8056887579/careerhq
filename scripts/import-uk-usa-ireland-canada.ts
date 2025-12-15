import mongoose from "mongoose";
import Country from "../src/models/Country";
import University from "../src/models/University";
import fs from "fs";
import path from "path";

interface UniversityData {
  "University Name": string;
  Country: string;
  Location: string;
  Type: string;
  Description: string;
  Facilities: string;
}

// Country configuration
const countryConfig: Record<string, { code: string; currency: string; language: string; timezone: string }> = {
  UK: { code: "GB", currency: "GBP", language: "English", timezone: "UTC+0" },
  USA: { code: "US", currency: "USD", language: "English", timezone: "UTC-5" },
  Ireland: { code: "IE", currency: "EUR", language: "English", timezone: "UTC+0" },
  Canada: { code: "CA", currency: "CAD", language: "English", timezone: "UTC-5" },
};

// Helper function to generate slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper function to parse facilities string into array
function parseFacilities(facilitiesString: string): string[] {
  if (!facilitiesString) return [];
  return facilitiesString.split(";").map((f) => f.trim()).filter(Boolean);
}

// Helper function to determine university type (map to Public/Private)
function mapUniversityType(_type: string): "Public" | "Private" {
  return "Public"; // Default to Public for research universities
}

async function importUniversities(countryName: string, fileName: string) {
  try {
    // Read and parse the JSON data
    const rawData = fs.readFileSync(
      path.join(process.cwd(), "data", fileName),
      "utf-8"
    );
    const universitiesData: UniversityData[] = JSON.parse(rawData);

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://benitasamson_db_user:KmaOPnOxaMtN5hao@cluster0.bzqr2kt.mongodb.net/career-hq"
    );
    console.log(`✓ Connected to MongoDB`);

    // Get or create country
    let country = await Country.findOne({ name: countryName });

    if (!country) {
      const config = countryConfig[countryName];
      country = new Country({
        name: countryName,
        code: config?.code || countryName.substring(0, 2).toUpperCase(),
        slug: generateSlug(countryName),
        description: `${countryName} is a leading destination for higher education`,
        currency: config?.currency || "USD",
        language: config?.language || "English",
        timezone: config?.timezone || "UTC+0",
        published: true,
      });
      await country.save();
      console.log(`✓ Created country: ${countryName}`);
    } else {
      console.log(`✓ Country already exists: ${countryName}`);
    }

    // Track unique universities to avoid duplicates
    const uniqueUniversities = new Map<string, UniversityData>();

    // Process universities data - keep only unique ones
    universitiesData.forEach((uni) => {
      const key = `${uni["University Name"]}-${uni.Country}`;
      if (!uniqueUniversities.has(key)) {
        uniqueUniversities.set(key, uni);
      }
    });

    console.log(
      `\nProcessing ${uniqueUniversities.size} unique universities...`
    );

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Import or update universities
    for (const [, uniData] of uniqueUniversities) {
      try {
        // Check if university already exists
        let university = await University.findOne({
          name: uniData["University Name"],
          countryId: country._id,
        });

        if (university) {
          skippedCount++;
          continue;
        }

        // Parse facilities
        const facilities = parseFacilities(uniData.Facilities);

        // Determine university type
        const universityType = mapUniversityType(uniData.Type);

        // Create location string
        const location = `${uniData.Location}, ${uniData.Country}`;

        // Create new university
        university = new University({
          name: uniData["University Name"],
          countryId: country._id,
          location: location,
          slug: generateSlug(uniData["University Name"]),
          description: uniData.Description,
          type: universityType,
          facilities: facilities,
          campusSize: "Not specified",
          studentPopulation: "Not specified",
          published: true,
          campuses: [
            {
              name: uniData["University Name"],
              location: location,
              city: uniData.Location,
              facilities: facilities,
            },
          ],
          tags: [uniData.Type, uniData.Country],
        });

        await university.save();
        createdCount++;
        console.log(`  ✓ Created: ${uniData["University Name"]}`);
      } catch (error) {
        errorCount++;
        console.error(
          `  ✗ Error importing ${uniData["University Name"]}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    console.log("\n=== Import Summary ===");
    console.log(`Universities Created: ${createdCount}`);
    console.log(`Universities Skipped: ${skippedCount}`);
    console.log(`Universities Errors: ${errorCount}`);
    console.log(`Total Universities Processed: ${createdCount + skippedCount + errorCount}`);

    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("✗ Fatal Error:", error);
    process.exit(1);
  }
}

// Determine which country to import based on the script name or environment
const scriptName = process.argv[1];
let countryName = "UK";
let fileName = "uk_updated.json";

if (scriptName.includes("usa")) {
  countryName = "USA";
  fileName = "usa_updated.json";
} else if (scriptName.includes("ireland")) {
  countryName = "Ireland";
  fileName = "ireland_updated.json";
} else if (scriptName.includes("canada")) {
  countryName = "Canada";
  fileName = "canada_updated.json";
}

importUniversities(countryName, fileName);
