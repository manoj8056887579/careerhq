const { execSync } = require("child_process");
const path = require("path");

// Source and destination connection strings
const SOURCE_URI =
  "mongodb+srv://azar:[password]@3i-smarthome.mj57pex.mongodb.net/career-hq";
const DEST_URI =
  "mongodb+srv://azar_db_user:[password]@cluster0.6ytaamy.mongodb.net/new-career-hq";

// Temporary dump directory
const DUMP_DIR = path.join(__dirname, "mongodb-dump");

console.log("🚀 Starting MongoDB migration...\n");

try {
  // Step 1: Dump from source
  console.log("📦 Step 1: Dumping data from source cluster...");
  console.log("Source: career-hq database");

  execSync(`mongodump --uri="${SOURCE_URI}" --out="${DUMP_DIR}"`, {
    stdio: "inherit",
  });

  console.log("✅ Dump completed successfully!\n");

  // Step 2: Restore to destination
  console.log("📥 Step 2: Restoring data to destination cluster...");
  console.log("Destination: new-career-hq database");

  execSync(
    `mongorestore --uri="${DEST_URI}" "${DUMP_DIR}/career-hq" --nsFrom="career-hq.*" --nsTo="new-career-hq.*"`,
    { stdio: "inherit" }
  );

  console.log("✅ Restore completed successfully!\n");
  console.log(
    "🎉 Migration completed! All data has been copied from career-hq to new-career-hq"
  );
} catch (error) {
  console.error("❌ Migration failed:", error.message);
  process.exit(1);
}
