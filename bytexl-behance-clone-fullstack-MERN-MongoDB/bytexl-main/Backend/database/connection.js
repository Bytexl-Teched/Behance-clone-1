// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

// Import config from dotenv to load environment variables from the .env file
import { config } from "dotenv";

// Load the .env file's variables into process.env
config();

/**
 * Establishes a connection to the MongoDB database.
 *
 * How to set up MongoDB connection string:
 * - For MongoDB Atlas (Cloud):
 *   1. Log in to https://www.mongodb.com/cloud/atlas.
 *   2. Create a cluster, click "Connect", and choose "Connect your application".
 *   3. Use the provided connection string:
 *      Example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
 *   4. Replace <username>, <password>, and <dbname> with your own values.
 *   5. Store this connection string in the .env file as MONGODB_URI.
 */
export default async function connection() {
    // Get the MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;

    try {
        // Attempt to connect to the database
        await mongoose.connect(mongoURI, {
            dbName: "booksdatabase", // Optional: Set the database name explicitly
        });

        // Log a success message if the connection is established
        console.log("Database is connected");
    } catch (error) {
        // Log an error message if the connection fails
        console.error("MongoDB connection error:", error);
    }
}
