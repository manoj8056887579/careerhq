const mongoose = require("mongoose");

const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const envVars = {};

        envFile.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                envVars[key.trim()] = value;
            }
        });

        return envVars;
    } catch (error) {
        console.error('Error loading .env file:', error);
        return {};
    }
}

const env = loadEnv();

// MongoDB connection
const MONGODB_URI = env.MONGODB_URI || "mongodb://localhost:27017/careerhq";

// Module Schema
const UniversalModuleSchema = new mongoose.Schema(
    {
        moduleType: {
            type: String,
            required: true,
            enum: [
                "study-india",
                "placement-india",
                "placement-abroad",
                "internship-india",
                "internship-abroad",
                "mbbs-india",
                "mbbs-abroad",
                "lms",
                "uni-project",
                "school-project",
                "mou-project",
                "loans",
            ],
        },
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        detailedDescription: { type: String, required: true },
        category: { type: String, required: true },
        customFields: [
            {
                key: String,
                value: String,
            },
        ],
        highlights: [String],
        coverImage: String,
        galleryImages: [String],
        published: { type: Boolean, default: false },
        slug: String,
    },
    { timestamps: true }
);

const ModuleCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        moduleType: {
            type: String,
            required: true,
            enum: [
                "study-india",
                "placement-india",
                "placement-abroad",
                "internship-india",
                "internship-abroad",
                "mbbs-india",
                "mbbs-abroad",
                "lms",
                "uni-project",
                "school-project",
                "mou-project",
                "loans",
            ],
        },
    },
    { timestamps: true }
);

const UniversalModule =
    mongoose.models.UniversalModule ||
    mongoose.model("UniversalModule", UniversalModuleSchema);
const ModuleCategory =
    mongoose.models.ModuleCategory ||
    mongoose.model("ModuleCategory", ModuleCategorySchema);

// Sample data (same as TypeScript version but in JS)
const sampleData = require("./sample-data.json");

async function seedModules() {
    try {
        console.log("🌱 Starting to seed modules...");

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to database");

        // Clear existing data
        await UniversalModule.deleteMany({});
        await ModuleCategory.deleteMany({});
        console.log("🗑️  Cleared existing data");

        let totalModules = 0;
        let totalCategories = 0;

        // Seed each module type
        for (const [moduleType, data] of Object.entries(sampleData)) {
            console.log(`\n📦 Seeding ${moduleType}...`);

            // Create categories
            for (const categoryName of data.categories) {
                await ModuleCategory.create({
                    name: categoryName,
                    moduleType: moduleType,
                });
                totalCategories++;
            }
            console.log(`  ✅ Created ${data.categories.length} categories`);

            // Create modules
            for (const moduleData of data.modules) {
                await UniversalModule.create({
                    ...moduleData,
                    moduleType: moduleType,
                });
                totalModules++;
            }
            console.log(`  ✅ Created ${data.modules.length} modules`);
        }

        console.log("\n🎉 Seeding completed successfully!");
        console.log(`📊 Total categories created: ${totalCategories}`);
        console.log(`📊 Total modules created: ${totalModules}`);
        console.log("\n✨ Sample data is ready to use!");

        await mongoose.connection.close();
        console.log("\n✅ Done! You can now view the data in your app.");
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
}

// Run the seed function
seedModules();
