import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

await mongoose.connect(process.env.MONGO_URL);
console.log('Connected to DB');

const db = mongoose.connection.db;
const conversations = db.collection('conversations');

// Find conversations where all participants are the same (self-conversations)
const allConvs = await conversations.find({}).toArray();
const selfConvs = allConvs.filter(c => {
  const ids = c.participants.map(p => p.toString());
  const unique = new Set(ids);
  return unique.size < ids.length || ids.length < 2; // duplicates or less than 2 participants
});

console.log(`Found ${selfConvs.length} self/malformed conversations`);
if (selfConvs.length > 0) {
  const ids = selfConvs.map(c => c._id);
  const res = await conversations.deleteMany({ _id: { $in: ids } });
  console.log(`Deleted ${res.deletedCount} self-conversations`);
}

await mongoose.disconnect();
console.log('Done');
