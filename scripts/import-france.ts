import mongoose from "mongoose";
import Country from "../src/models/Country";
import University from "../src/models/University";
import fs from "fs";
import path from "path";

interface FranceUniversityData {
  University: string;
  Country: string;
  Location: string;
  Type: string;
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
  return facilitiesString
    .split(";")
    .map((f) => f.trim())
    .filter(Boolean);
}

// Helper function to determine university type (map to Public/Private)
function mapUniversityType(type: string): "Public" | "Private" {
  const publicTypes = [
    "Public University",
    "Higher Education Institution",
    "Institute / College (public or private)",
  ];
  return publicTypes.includes(type) ? "Public" : "Private";
}

// Helper function to extract city from location string
function extractPrimaryCity(location: string): string {
  if (!location) return "France";
  // Get first city if multiple are listed
  const cities = location.split(",");
  return cities[0].trim();
}

async function importFranceData() {
  try {
    // Read and parse the JSON data
    const rawData = fs.readFileSync(
      path.join(process.cwd(), "data", "france_universities.json"),
      "utf-8"
    );
    const universitiesData: FranceUniversityData[] = JSON.parse(rawData);

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://benitasamson_db_user:KmaOPnOxaMtN5hao@cluster0.bzqr2kt.mongodb.net/career-hq"
    );
    console.log("✓ Connected to MongoDB");

    // Get or create France country
    let franceCountry = await Country.findOne({ name: "France" });

    if (!franceCountry) {
      franceCountry = new Country({
        name: "France",
        code: "FR",
        slug: "france",
        description:
          "France is a leading destination for higher education in Europe",
        currency: "EUR",
        language: "French",
        timezone: "UTC+1",
        published: true,
      });
      await franceCountry.save();
      console.log("✓ Created France country");
    } else {
      console.log("✓ France country already exists");
    }

    // Track unique universities to avoid duplicates
    const uniqueUniversities = new Map<string, FranceUniversityData>();

    // Process universities data - keep only unique ones
    universitiesData.forEach((uni) => {
      const key = `${uni.University}-France`;
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
          name: uniData.University,
          countryId: franceCountry._id,
        });

        if (university) {
          skippedCount++;
          continue;
        }

        // Parse facilities
        const facilities = parseFacilities(uniData.Facilities);

        // Determine university type
        const universityType = mapUniversityType(uniData.Type);

        // Extract primary city
        const primaryCity = extractPrimaryCity(uniData.Location);

        // Create location string
        const location = `${uniData.Location}, France`;

        // Create new university
        university = new University({
          name: uniData.University,
          countryId: franceCountry._id,
          location: location,
          slug: generateSlug(uniData.University),
          description: uniData.Description,
          type: universityType,
          facilities: facilities,
          campusSize: "Not specified",
          studentPopulation: "Not specified",
          published: true,
          campuses: [
            {
              name: uniData.University,
              location: location,
              city: primaryCity,
              facilities: facilities,
            },
          ],
          tags: [uniData.Type, "France"],
        });

        await university.save();
        createdCount++;
        console.log(`  ✓ Created: ${uniData.University}`);
      } catch (error) {
        errorCount++;
        console.error(
          `  ✗ Error importing ${uniData.University}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    console.log("\n=== Import Summary ===");
    console.log(`Universities Created: ${createdCount}`);
    console.log(`Universities Skipped: ${skippedCount}`);
    console.log(`Universities Errors: ${errorCount}`);
    console.log(
      `Total Universities Processed: ${
        createdCount + skippedCount + errorCount
      }`
    );

    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("✗ Fatal Error:", error);
    process.exit(1);
  }
}

importFranceData();
