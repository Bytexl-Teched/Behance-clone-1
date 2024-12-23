// Import the Express framework to create routes
import express from "express";

// Import the Book model to interact with the MongoDB collection
import { Book } from "../models/bookSchema.js";
import { verifyToken } from "../middleware/auth.js";
import { User } from "../models/userSchema.js";
import mongoose from "mongoose";

// Create a new router instance for book-related routes
const router = express.Router();

router.post("/:bookId/like", async (req, res) => {
    const bookId = req.params.bookId;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) 
        || !mongoose.Types.ObjectId.isValid(bookId)
    ) {
      return res.status(400).json({ message: "Invalid userId or bookId" });
    }

    try {
      const alreadyLiked = await User.findOne({_id: userId, likedBooks: {$in: [bookId]}});
      
      if(alreadyLiked){
        return res.status(400).json({message: "Book is already liked"});
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { likedBooks: bookId } },
        { new: true }
      ).populate("likedBooks");
        
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Book liked successfully", likedBooks: user.likedBooks });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error });
    }
});

router.post("/:bookId/unlike", async (req, res) => {
    const bookId = req.params.bookId;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) 
      || !mongoose.Types.ObjectId.isValid(bookId)
    ) {
      return res.status(400).json({ message: "Invalid userId or bookId" });
    }

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { likedBooks: bookId } },
        { new: true }
      ).populate("likedBooks");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Book unliked successfully", likedBooks: user.likedBooks });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error });
    }
});

/**
 * READ: Get a single book by ID
 * - Route: GET /api/books/:id
 * - Response: The requested book or a 404 error if not found
 */
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id); // Find book by ID
        if (!book) {
            return res.status(404).json({ message: "Book not found" }); // If not found, respond with 404
        }
        res.status(200).json(book); // Send the found book as JSON
    } catch (error) {
        res.status(500).json({
            message: "Error fetching book", // Handle server errors
            error: error.message,
        });
    }
});

/**
 * UPDATE: Update a book by ID
 * - Route: PUT /api/books/:id
 * - Middleware: verifyToken to ensure the user is authenticated
 * - Request Body: JSON containing the updated fields
 * - Response: The updated book or a 404 error if not found
 */
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id, // Book ID from the route parameters
            req.body, // Fields to update
            { new: true, runValidators: true } // Return the updated document and run validations
        );
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" }); // If not found, respond with 404
        }
        res.status(200).json(updatedBook); // Send the updated book as JSON
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle validation errors
    }
});

/**
 * DELETE: Remove a book by ID
 * - Route: DELETE /api/books/:id
 * - Middleware: verifyToken to ensure the user is authenticated
 * - Response: A success message or a 404 error if not found
 */
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id); // Find and delete book by ID
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" }); // If not found, respond with 404
        }
        res.status(200).json({ message: "Book deleted successfully" }); // Send success message
    } catch (error) {
        res.status(500).json({
            message: "Error deleting book", // Handle server errors
            error: error.message,
        });
    }
});

/**
 * CREATE: Add a new book to the collection
 * - Route: POST /api/books
 * - Middleware: verifyToken to ensure the user is authenticated
 * - Request Body: JSON containing book details (title, author, etc.)
 * - Response: The saved book or an error message
 */
router.post("/", verifyToken, async (req, res) => {
    const { title, author, year, category, price, rating, image } = req.body;

    // Manual validation of request body
    if (!title || typeof title !== "string") {
        return res
            .status(400)
            .json({ message: "Title is required and must be a string" });
    }
    if (!image || typeof image !== "string") {
        return res
            .status(400)
            .json({ message: "Image is required and must be a string" });
    }
    if (!author || typeof author !== "string") {
        return res
            .status(400)
            .json({ message: "Author is required and must be a string" });
    }
    if (!year || typeof year !== "number") {
        return res.status(400).json({
            message: "Publication Year is required and must be a number",
        });
    }
    if (!category || typeof category !== "string") {
        return res
            .status(400)
            .json({ message: "Category is required and must be a string" });
    }
    if (!price || typeof price !== "number" || price <= 0) {
        return res.status(400).json({
            message: "Price is required and cannot be zero or  negative",
        });
    }
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
        return res
            .status(400)
            .json({ message: "Rating is required, must be between 1 and 5" });
    }

    try {
        const savedBook = await Book.create(req.body); // Create and save book
        res.status(201).json(savedBook); // Send the saved book as a response
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle validation errors
    }
});

/**
 * READ: Get all books from the collection
 * - Route: GET /api/books
 * - Response: An array of all books or an error message
 */
router.get("/", async (_, res) => {
    try {
        const result = await Book.aggregate([
            {
                $lookup: {
                    from: "users", // the collection to join
                    localField: "_id", // field from the book collection
                    foreignField: "likedBooks", // field from the user collection
                    as: "likes", // the name for the new array containing the matched users
                },
            },
            {
                $addFields: {
                    totalLikes: { $size: "$likes" }, // calculate the size of the likes array
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author: 1,
                    category: 1,
                    image: 1,
                    totalLikes: 1,
                    price: 1,
                    rating: 1
                },
            },
        ]);
        
        res.status(200).json(result); // Send books as JSON response
        // Show example of calculated fields (fields not available in the Schema)
        // Write code to calculate total likes for a book and attach the results
        // to the response of each Book object
        // Add a serialized (calcualted) field - which means
        // For each book, return trending or not depending on whether the book has >2 likes in last 24 hours

        // Also show an example of removing some field when sending to frontend
        // Intentionally remove the publication year
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books", // Handle server errors
            error: error.message,
        });
    }
});


// Export the router to be used in the main server file
export { router as bookRoutes };
