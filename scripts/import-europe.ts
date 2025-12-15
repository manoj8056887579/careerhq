import mongoose from "mongoose";
import Country from "../src/models/Country";
import University from "../src/models/University";
import fs from "fs";
import path from "path";

interface EuropeUniversityData {
  "UNIVERSITY NAME": string;
  COUNTRY: string;
  LOCATION: string;
  TYPE:
    | "Public University"
    | "Private University"
    | "Vocational College"
    | "Business School"
    | "Technical Institute";
  DESCRIPTION: string;
  FACILITIES: string;
}

// Country configuration with codes and details
const countryConfig: Record<
  string,
  { code: string; currency: string; language: string; timezone: string }
> = {
  Sweden: {
    code: "SE",
    currency: "SEK",
    language: "Swedish",
    timezone: "UTC+1",
  },
  Georgia: {
    code: "GE",
    currency: "GEL",
    language: "Georgian",
    timezone: "UTC+4",
  },
  Russia: {
    code: "RU",
    currency: "RUB",
    language: "Russian",
    timezone: "UTC+3",
  },
  Netherlands: {
    code: "NL",
    currency: "EUR",
    language: "Dutch",
    timezone: "UTC+1",
  },
  Hungary: {
    code: "HU",
    currency: "HUF",
    language: "Hungarian",
    timezone: "UTC+1",
  },
  Spain: {
    code: "ES",
    currency: "EUR",
    language: "Spanish",
    timezone: "UTC+1",
  },
  Denmark: {
    code: "DK",
    currency: "DKK",
    language: "Danish",
    timezone: "UTC+1",
  },
  Austria: {
    code: "AT",
    currency: "EUR",
    language: "German",
    timezone: "UTC+1",
  },
  Poland: {
    code: "PL",
    currency: "PLN",
    language: "Polish",
    timezone: "UTC+1",
  },
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

async function importEuropeData() {
  try {
    // Read and parse the JSON data
    const rawData = fs.readFileSync(
      path.join(process.cwd(), "data", "europe_7countries.json"),
      "utf-8"
    );
    const universitiesData: EuropeUniversityData[] = JSON.parse(rawData);

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://benitasamson_db_user:KmaOPnOxaMtN5hao@cluster0.bzqr2kt.mongodb.net/career-hq"
    );
    console.log("✓ Connected to MongoDB");

    // Get unique countries from data
    const countriesToProcess = [
      ...new Set(universitiesData.map((u) => u.COUNTRY)),
    ];
    console.log(`\nProcessing ${countriesToProcess.length} countries...`);

    const countryMap = new Map<string, Record<string, unknown>>();

    // Create or get countries
    for (const countryName of countriesToProcess) {
      try {
        let country = await Country.findOne({ name: countryName });

        if (!country) {
          const config = countryConfig[countryName];
          country = new Country({
            name: countryName,
            code: config?.code || countryName.substring(0, 2).toUpperCase(),
            slug: generateSlug(countryName),
            description: `${countryName} is a leading destination for higher education in Europe`,
            currency: config?.currency || "EUR",
            language: config?.language || "English",
            timezone: config?.timezone || "UTC+1",
            published: true,
          });
          await country.save();
          console.log(`  ✓ Created country: ${countryName}`);
        } else {
          console.log(`  ✓ Country already exists: ${countryName}`);
        }

        countryMap.set(countryName, country);
      } catch (error) {
        console.error(
          `  ✗ Error processing country ${countryName}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    // Track unique universities to avoid duplicates
    const uniqueUniversities = new Map<string, EuropeUniversityData>();

    // Process universities data - keep only unique ones
    universitiesData.forEach((uni) => {
      const key = `${uni["UNIVERSITY NAME"]}-${uni.COUNTRY}`;
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
        const country = countryMap.get(uniData.COUNTRY);
        if (!country) {
          console.error(
            `  ✗ Country not found for ${uniData["UNIVERSITY NAME"]}`
          );
          errorCount++;
          continue;
        }

        // Check if university already exists
        let university = await University.findOne({
          name: uniData["UNIVERSITY NAME"],
          countryId: country._id,
        });

        if (university) {
          skippedCount++;
          continue;
        }

        // Parse facilities
        const facilities = parseFacilities(uniData.FACILITIES);

        // Determine university type
        const universityType = mapUniversityType(uniData.TYPE);

        // Create location string
        const location = `${uniData.LOCATION}, ${uniData.COUNTRY}`;

        // Create new university
        university = new University({
          name: uniData["UNIVERSITY NAME"],
          countryId: country._id,
          location: location,
          slug: generateSlug(uniData["UNIVERSITY NAME"]),
          description: uniData.DESCRIPTION,
          type: universityType,
          facilities: facilities,
          campusSize: "Not specified",
          studentPopulation: "Not specified",
          published: true,
          campuses: [
            {
              name: uniData["UNIVERSITY NAME"],
              location: location,
              city: uniData.LOCATION,
              facilities: facilities,
            },
          ],
          tags: [uniData.TYPE, uniData.COUNTRY],
        });

        await university.save();
        createdCount++;
        console.log(
          `  ✓ Created: ${uniData["UNIVERSITY NAME"]} (${uniData.COUNTRY})`
        );
      } catch (error) {
        errorCount++;
        console.error(
          `  ✗ Error importing ${uniData["UNIVERSITY NAME"]}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    console.log("\n=== Import Summary ===");
    console.log(`Countries Created: ${countriesToProcess.length}`);
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

importEuropeData();
