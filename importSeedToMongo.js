const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "tuktukdb";
const dataPath = path.join(__dirname, "seed.json");

if (!uri) {
  console.error("Missing MONGODB_URI environment variable.");
  console.error("Example: set MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const collections = [
  { name: "provinces", docs: data.provinces || [] },
  { name: "districts", docs: data.districts || [] },
  { name: "stations", docs: data.stations || [] },
  { name: "vehicles", docs: data.vehicles || [] },
  { name: "pings", docs: data.pings || [] }
];

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    for (const { name, docs } of collections) {
      const collection = db.collection(name);
      await collection.deleteMany({});
      if (docs.length > 0) {
        await collection.insertMany(docs);
      }
      console.log(`Imported ${docs.length} documents into ${dbName}.${name}`);
    }

    console.log("Seed data import completed successfully.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
