const { MongoClient } = require("mongodb");

const SOURCE_URI =
  "mongodb+srv://azar:izGKEBQ4n4kAgsXo@3i-smarthome.mj57pex.mongodb.net/career";
const DEST_URI =
  "mongodb+srv://benitasamson_db_user:KmaOPnOxaMtN5hao@cluster0.bzqr2kt.mongodb.net/career-hq";

async function migrateDatabase() {
  let sourceClient, destClient;

  try {
    console.log("🚀 Starting MongoDB migration...\n");

    // Connect to source
    console.log("📡 Connecting to source cluster...");
    sourceClient = new MongoClient(SOURCE_URI);
    await sourceClient.connect();
    const sourceDb = sourceClient.db("career");
    console.log("✅ Connected to source\n");

    // Connect to destination
    console.log("📡 Connecting to destination cluster...");
    destClient = new MongoClient(DEST_URI);
    await destClient.connect();
    const destDb = destClient.db("career-hq");
    console.log("✅ Connected to destination\n");

    // Get all collections
    const collections = await sourceDb.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collections to migrate\n`);

    // Migrate each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`⏳ Migrating collection: ${collectionName}`);

      const sourceCollection = sourceDb.collection(collectionName);
      const destCollection = destDb.collection(collectionName);

      // Get all documents
      const documents = await sourceCollection.find({}).toArray();
      console.log(`   Found ${documents.length} documents`);

      if (documents.length > 0) {
        await destCollection.insertMany(documents, { ordered: false });
        console.log(`   ✅ Copied ${documents.length} documents`);
      }

      // Copy indexes
      const indexes = await sourceCollection.indexes();
      for (const index of indexes) {
        if (index.name !== "_id_") {
          try {
            delete index.v;
            delete index.ns;
            const key = index.key;
            delete index.key;
            delete index.name;
            await destCollection.createIndex(key, index);
          } catch (err) {
            // Index might already exist
          }
        }
      }
      console.log(`   ✅ Copied indexes\n`);
    }

    console.log("🎉 Migration completed successfully!");
    console.log(`✅ All data copied from career to career-hq`);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    if (sourceClient) await sourceClient.close();
    if (destClient) await destClient.close();
  }
}

migrateDatabase();
