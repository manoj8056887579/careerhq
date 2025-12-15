import mongoose from "mongoose";
import Country from "../src/models/Country";
import University from "../src/models/University";
import fs from "fs";
import path from "path";

interface AustraliaUniversityData {
  UNIVERSITY: {
    COLLEGE: string;
  };
  STATE: string;
  CITY: string;
  Country: string;
  Type:
    | "Public University"
    | "Private University"
    | "Vocational College"
    | "Business School"
    | "Technical Institute";
  Description: string;
  Facilities: string;
}

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
  return facilitiesString.split(",").map((f) => f.trim());
}

// Helper function to determine university type (map to Public/Private)
function mapUniversityType(type: string): "Public" | "Private" {
  const publicTypes = [
    "Public University",
    "Technical Institute",
    "Vocational College",
  ];
  return publicTypes.includes(type) ? "Public" : "Private";
}

async function importAustraliaData() {
  try {
    // Read and parse the JSON data
    const rawData = fs.readFileSync(
      path.join(process.cwd(), "data", "Australia.json"),
      "utf-8"
    );
    const universitiesData: AustraliaUniversityData[] = JSON.parse(rawData);

    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://azar:izGKEBQ4n4kAgsXo@3i-smarthome.mj57pex.mongodb.net/career-hq"
    );
    console.log("✓ Connected to MongoDB");

    // Get or create Australia country
    let australiaCountry = await Country.findOne({ name: "Australia" });

    if (!australiaCountry) {
      australiaCountry = new Country({
        name: "Australia",
        code: "AU",
        slug: "australia",
        description: "Australia is a leading destination for higher education",
        currency: "AUD",
        language: "English",
        timezone: "UTC+10",
        published: true,
      });
      await australiaCountry.save();
      console.log("✓ Created Australia country");
    } else {
      console.log("✓ Australia country already exists");
    }

    // Track unique universities to avoid duplicates
    const uniqueUniversities = new Map<string, AustraliaUniversityData>();

    // Process universities data - keep only unique ones
    universitiesData.forEach((uni) => {
      const collegeName = uni.UNIVERSITY.COLLEGE;
      if (!uniqueUniversities.has(collegeName)) {
        uniqueUniversities.set(collegeName, uni);
      }
    });

    console.log(
      `\nProcessing ${uniqueUniversities.size} unique universities...`
    );

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Import or update universities
    for (const [collegeName, uniData] of uniqueUniversities) {
      try {
        // Check if university already exists
        let university = await University.findOne({
          name: collegeName,
          countryId: australiaCountry._id,
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
        const location = `${uniData.CITY}, ${uniData.STATE}, Australia`;

        // Create new university
        university = new University({
          name: collegeName,
          countryId: australiaCountry._id,
          location: location,
          slug: generateSlug(collegeName),
          description: uniData.Description,
          type: universityType,
          facilities: facilities,
          campusSize: "Not specified",
          studentPopulation: "Not specified",
          published: true,
          campuses: [
            {
              name: collegeName,
              location: location,
              city: uniData.CITY,
              facilities: facilities,
            },
          ],
          tags: [uniData.Type, uniData.STATE],
        });

        await university.save();
        createdCount++;
        console.log(`  ✓ Created: ${collegeName}`);
      } catch (error) {
        errorCount++;
        console.error(
          `  ✗ Error importing ${collegeName}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    console.log("\n=== Import Summary ===");
    console.log(`Created: ${createdCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Total Processed: ${createdCount + skippedCount + errorCount}`);

    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("✗ Fatal Error:", error);
    process.exit(1);
  }
}

importAustraliaData();
