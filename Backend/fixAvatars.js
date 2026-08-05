import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";
import { User } from "./models/userModel.js";

dotenv.config();

// Add DNS fix
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const fixAvatars = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    // Update each user's avatar
    for (const user of users) {
      const oldPhoto = user.profilePhoto;
      
      // Generate new avatar URL - adventurer style (fun cartoon adventure)
      const newPhoto = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`;
      
      // Update user
      user.profilePhoto = newPhoto;
      await user.save();
      
      console.log(`Updated ${user.username}`);
    }

    console.log("\n✅ All avatars fixed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

fixAvatars();
