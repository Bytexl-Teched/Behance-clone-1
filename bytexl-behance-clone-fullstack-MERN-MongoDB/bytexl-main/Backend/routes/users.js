// Import the Express framework to create routes
import express from "express";
import { User } from "../models/userSchema.js";
import mongoose from "mongoose";

// Create a new router instance for user-related routes
const router = express.Router();

router.get("/:userId/liked_books", async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    try {
      const user = await User.findById(userId).populate("likedBooks");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ likedBooks: user.likedBooks });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error });
    }
});

// Export the router to be used in the main server file
export { router as userRoutes };
