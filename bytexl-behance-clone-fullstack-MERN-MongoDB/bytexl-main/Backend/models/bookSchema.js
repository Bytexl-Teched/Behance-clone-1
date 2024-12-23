// Import mongoose to define the schema and interact with MongoDB
import mongoose from "mongoose";

// Define a new schema for the 'Book' collection in MongoDB
const bookSchema = new mongoose.Schema({
    /**
     * @field title
     * - Type: String
     * - Required: Yes
     * - Description: The title of the book.
     * - Example: "Clean Code"
     */
    title: {
        type: String,
        required: [true, "Title is required"], // Custom error message if title is missing
    },

    /**
     * @field author
     * - Type: String
     * - Required: Yes
     * - Description: The author of the book.
     * - Example: "Robert C. Martin"
     */
    author: {
        type: String,
        required: [true, "Author is required"], // Custom error message for missing author
    },

    /**
     * @field publicationYear
     * - Type: Number
     * - Required: Yes
     * - Description: The year the book was published.
     * - Example: 2008
     */
    year: {
        type: Number,
        required: [true, "Publication Year is required"], // Ensures the year is provided
    },

    /**
     * @field category
     * - Type: String
     * - Required: Yes
     * - Description: The genre or category of the book.
     * - Example: "Technology", "Fiction", "Biography"
     */
    category: {
        type: String,
        required: [true, "Category is required"], // Ensures a category is selected
    },

    /**
     * @field price
     * - Type: Number
     * - Required: Yes
     * - Description: The price of the book in USD or local currency.
     * - Constraints: Must be non-negative.
     * - Example: 45.99
     */
    price: {
        type: Number,
        required: [true, "Price is required"], // Price is mandatory
        min: [0, "Price cannot be negative"], // Ensures the price is not negative
    },

    /**
     * @field rating
     * - Type: Number
     * - Required: Yes
     * - Description: The rating of the book (on a scale of 1 to 5).
     * - Constraints: Must be between 1 and 5 (inclusive).
     * - Example: 4.5
     */
    rating: {
        type: Number,
        required: [true, "Rating is required"], // Rating must be provided
        min: [1, "Rating must be at least 1"], // Minimum allowed rating is 1
        max: [5, "Rating cannot exceed 5"], // Maximum allowed rating is 5
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    }
});

// Export the Book model, which corresponds to the 'books' collection in MongoDB
export const Book = mongoose.model("Book", bookSchema);
