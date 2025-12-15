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

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseFacilities(facilitiesString: string): string[] {
  if (!facilitiesString) return [];
  return facilitiesString
    .split(";")
    .map((f) => f.trim())
    .filter(Boolean);
}

async function importUSA() {
  try {
    const rawData = fs.readFileSync(
      path.join(process.cwd(), "data", "usa_updated.json"),
      "utf-8"
    );
    const universitiesData: UniversityData[] = JSON.parse(rawData);

    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://benitasamson_db_user:KmaOPnOxaMtN5hao@cluster0.bzqr2kt.mongodb.net/career-hq"
    );
    console.log("✓ Connected to MongoDB");

    let country = await Country.findOne({ name: "USA" });
    if (!country) {
      country = new Country({
        name: "USA",
        code: "US",
        slug: "usa",
        description: "USA is a leading destination for higher education",
        currency: "USD",
        language: "English",
        timezone: "UTC-5",
        published: true,
      });
      await country.save();
      console.log("✓ Created country: USA");
    } else {
      console.log("✓ Country already exists: USA");
    }

    const uniqueUniversities = new Map<string, UniversityData>();
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

    for (const [, uniData] of uniqueUniversities) {
      try {
        let university = await University.findOne({
          name: uniData["University Name"],
          countryId: country._id,
        });

        if (university) {
          skippedCount++;
          continue;
        }

        const facilities = parseFacilities(uniData.Facilities);
        const location = `${uniData.Location}, USA`;

        university = new University({
          name: uniData["University Name"],
          countryId: country._id,
          location: location,
          slug: generateSlug(uniData["University Name"]),
          description: uniData.Description,
          type: "Public",
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
          tags: ["USA", "Research University"],
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

    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("✗ Fatal Error:", error);
    process.exit(1);
  }
}

importUSA();
