import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import dns from "node:dns";
import { fileURLToPath } from "url";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

async function clearDatabase() {
  if (!process.env.MONGO_URL) {
    console.error("❌ MONGO_URL not found in Backend/.env");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected successfully to:", mongoose.connection.name);

    const adminDb = mongoose.connection.db.admin();
    const { databases } = await adminDb.listDatabases();
    console.log("Databases on cluster:", databases.map(d => d.name));

    for (const dbInfo of databases) {
      if (["admin", "local", "config"].includes(dbInfo.name)) continue;
      const targetDb = mongoose.connection.client.db(dbInfo.name);
      const collections = await targetDb.listCollections().toArray();
      console.log(`\n📁 Checking database '${dbInfo.name}' (${collections.length} collections)...`);
      for (const coll of collections) {
        const collection = targetDb.collection(coll.name);
        const count = await collection.countDocuments();
        const res = await collection.deleteMany({});
        console.log(`  🗑️ Cleared '${dbInfo.name}.${coll.name}': deleted ${res.deletedCount} of ${count} documents.`);
      }
    }

    console.log("✨ Database cleared completely!");
  } catch (err) {
    console.error("❌ Error while clearing database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
  }
}

clearDatabase();
